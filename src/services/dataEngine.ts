import * as XLSXModule from 'xlsx-js-style';
const XLSX: any = (XLSXModule as any).default || XLSXModule;
import { BiaRecord, HisRecord, MatchedRecord, ProcessingSummary } from '../types';

/**
 * Remove Vietnamese diacritics and normalize string
 */
export function removeDiacritics(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Normalize plain text: trim ends, replace multiple spaces, NFC unicode
 */
export function normalizeText(val: any): string {
  if (val === null || val === undefined) return '';
  let str = String(val);
  // Replace non-breaking spaces and zero-width spaces
  str = str.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ');
  // Collapse whitespace
  str = str.replace(/\s+/g, ' ');
  // Trim ends
  str = str.trim();
  // Normalize Unicode to NFC
  return str.normalize('NFC');
}

/**
 * Normalize full name: uppercase, NFC, trimmed, no redundant spaces
 */
export function normalizeName(val: any): string {
  return normalizeText(val).toUpperCase();
}

/**
 * Normalize gender: return "Nam" or "Nữ" (or "" if unspecified)
 */
export function normalizeGender(val: any): string {
  const raw = removeDiacritics(normalizeText(val)).toLowerCase();
  if (raw === 'nam' || raw === 'm' || raw === 'male') return 'Nam';
  if (raw === 'nu' || raw === 'f' || raw === 'female') return 'Nữ';
  return normalizeText(val);
}

/**
 * Normalize phone number: keep leading 0, remove dots, dashes, spaces
 */
export function normalizePhone(val: any): string {
  if (!val) return '';
  let str = String(val).replace(/[^\d]/g, '');
  if (!str) return '';
  if (str.length === 9 && !str.startsWith('0')) {
    str = '0' + str;
  }
  return str;
}

/**
 * Normalize date of birth to DD/MM/YYYY or YYYY string
 */
export function normalizeDob(val: any): string {
  if (!val) return '';
  if (val instanceof Date) {
    const d = String(val.getDate()).padStart(2, '0');
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const y = val.getFullYear();
    return `${d}/${m}/${y}`;
  }
  
  let str = normalizeText(val);
  
  // If Excel numeric serial date (e.g. 33064 or 33064.0000462963)
  const num = parseFloat(str);
  if (!isNaN(num) && num >= 10000 && num <= 65000) {
    const serial = Math.floor(num);
    const dateObj = new Date((serial - 25569) * 86400 * 1000);
    const d = String(dateObj.getUTCDate()).padStart(2, '0');
    const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const y = dateObj.getUTCFullYear();
    return `${d}/${m}/${y}`;
  }

  // Format YYYY-MM-DD
  const ymd = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (ymd) {
    return `${ymd[3].padStart(2, '0')}/${ymd[2].padStart(2, '0')}/${ymd[1]}`;
  }

  // Format DD/MM/YYYY or DD-MM-YYYY
  const dmy = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmy) {
    return `${dmy[1].padStart(2, '0')}/${dmy[2].padStart(2, '0')}/${dmy[3]}`;
  }

  return str;
}

/**
 * Calculate age based on birth date string, HIS age, and reference year (2026 default)
 */
export function calculateAge(dobStr: string, hisAge?: string, refYear: number = 2026): string {
  if (hisAge && !isNaN(Number(hisAge)) && Number(hisAge) > 0) {
    return String(parseInt(hisAge, 10));
  }
  if (!dobStr) return '';
  
  // Extract 4-digit year
  const match = dobStr.match(/\b(19\d{2}|20\d{2})\b/);
  if (match) {
    const birthYear = parseInt(match[1], 10);
    const calculated = refYear - birthYear;
    if (calculated >= 0 && calculated <= 120) {
      return String(calculated);
    }
  }
  return '';
}

/**
 * Parse an Excel file (either XLS HTML, binary XLS, or XLSX) into 2D array of strings
 */
export async function readExcelFileToRows(file: File): Promise<{ sheetNames: string[]; rowsBySheet: Record<string, string[][]> }> {
  const buffer = await file.arrayBuffer();
  
  // Try reading via SheetJS
  let workbook: any;
  try {
    workbook = XLSX.read(buffer, { type: 'array', cellDates: false, raw: true });
  } catch (err) {
    // If failed, try reading text if it's HTML table
    const text = new TextDecoder('utf-8').decode(buffer);
    workbook = XLSX.read(text, { type: 'string', cellDates: false, raw: true });
  }

  const rowsBySheet: Record<string, string[][]> = {};
  for (const name of workbook.SheetNames) {
    const ws = workbook.Sheets[name];
    const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as any[][];
    // Normalize every cell to string
    const stringRows = rawData.map(row => 
      (row || []).map(cell => normalizeText(cell))
    );
    rowsBySheet[name] = stringRows;
  }

  return {
    sheetNames: workbook.SheetNames,
    rowsBySheet
  };
}

/**
 * Parse HIS File rows into HisRecord list
 */
export function parseHisRows(rows: string[][]): HisRecord[] {
  if (!rows || rows.length < 2) return [];

  // Find header row containing "Mã BA" or "Tên bệnh nhân"
  let headerIndex = -1;
  let headers: string[] = [];

  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const r = rows[i].map(c => normalizeText(c).toLowerCase());
    if (r.some(c => c.includes('mã ba') || c.includes('maba') || c.includes('tên bệnh nhân') || c.includes('ten benh nhan'))) {
      headerIndex = i;
      headers = rows[i].map(c => normalizeText(c));
      break;
    }
  }

  if (headerIndex === -1) {
    headerIndex = 0;
    headers = rows[0].map(c => normalizeText(c));
  }

  // Column mapper
  const colMap = {
    maBA: headers.findIndex(h => /mã\s*ba|ma\s*ba/i.test(h)),
    maBN: headers.findIndex(h => /mã\s*bn|ma\s*bn/i.test(h)),
    tenBenhNhan: headers.findIndex(h => /tên\s*bệnh\s*nhân|tên\s*bn|họ\s*và\s*tên|họ\s*tên/i.test(h)),
    ngaySinh: headers.findIndex(h => /ngày\s*sinh|ngay\s*sinh/i.test(h)),
    tuoi: headers.findIndex(h => /^tuổi$|^tuoi$/i.test(h)),
    gioiTinh: headers.findIndex(h => /giới\s*tính|gioi\s*tinh/i.test(h)),
    cccd: headers.findIndex(h => /cccd|cmt|căn\s*cước/i.test(h)),
    sdt: headers.findIndex(h => /sđt|sdt|điện\s*thoại/i.test(h)),
    diaChi: headers.findIndex(h => /đ\/c|địa\s*chỉ|dia\s*chi/i.test(h)),
    noiLamViec: headers.findIndex(h => /nơi\s*làm\s*việc|công\s*ty|don\s*vi/i.test(h)),
    ngayTiepNhan: headers.findIndex(h => /tiếp\s*nhận/i.test(h)),
  };

  const records: HisRecord[] = [];
  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(c => !c)) continue;

    const maBA = colMap.maBA !== -1 ? normalizeText(row[colMap.maBA]) : '';
    const maBN = colMap.maBN !== -1 ? normalizeText(row[colMap.maBN]) : '';
    const tenBenhNhan = colMap.tenBenhNhan !== -1 ? normalizeText(row[colMap.tenBenhNhan]) : '';
    const ngaySinhRaw = colMap.ngaySinh !== -1 ? normalizeText(row[colMap.ngaySinh]) : '';
    const ngaySinh = normalizeDob(ngaySinhRaw);
    const tuoiRaw = colMap.tuoi !== -1 ? normalizeText(row[colMap.tuoi]) : '';
    const gioiTinh = normalizeGender(colMap.gioiTinh !== -1 ? row[colMap.gioiTinh] : '');
    const cccd = colMap.cccd !== -1 ? normalizeText(row[colMap.cccd]) : '';
    const sdt = normalizePhone(colMap.sdt !== -1 ? row[colMap.sdt] : '');
    const diaChi = colMap.diaChi !== -1 ? normalizeText(row[colMap.diaChi]) : '';
    const noiLamViec = colMap.noiLamViec !== -1 ? normalizeText(row[colMap.noiLamViec]) : '';
    const ngayTiepNhan = colMap.ngayTiepNhan !== -1 ? normalizeText(row[colMap.ngayTiepNhan]) : '';

    if (!tenBenhNhan && !maBA && !maBN) continue;

    // Determine reference year from ngayTiepNhan if available (e.g. 30/09/2026 -> 2026)
    let refYear = 2026;
    const tnMatch = ngayTiepNhan.match(/\b(20\d{2})\b/);
    if (tnMatch) {
      refYear = parseInt(tnMatch[1], 10);
    }
    const tuoi = calculateAge(ngaySinh, tuoiRaw, refYear);

    const rawObj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      rawObj[h || `Col_${idx}`] = row[idx] || '';
    });

    records.push({
      id: `his_${i}_${maBA || maBN || tenBenhNhan}`,
      maBA,
      maBN,
      tenBenhNhan,
      ngaySinh,
      tuoi,
      gioiTinh,
      cccd,
      sdt,
      noiLamViec,
      diaChi,
      ngayTiepNhan,
      raw: rawObj,
      normalizedName: normalizeName(tenBenhNhan),
      normalizedGender: gioiTinh,
      normalizedDob: ngaySinh,
    });
  }

  return records;
}

/**
 * Parse Bia Sheet rows into BiaRecord list
 */
export function parseBiaRows(rows: string[][]): BiaRecord[] {
  if (!rows || rows.length < 2) return [];

  // Find header row containing "STT" and ("HOVATEN" or "Họ và tên")
  let headerIndex = -1;
  let headers: string[] = [];

  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const r = rows[i].map(c => normalizeText(c).toLowerCase());
    if (r.some(c => c === 'stt' || c === 'số tt' || c === 'số thứ tự') &&
        r.some(c => c.includes('họ') || c.includes('ten') || c.includes('hovaten'))) {
      headerIndex = i;
      headers = rows[i].map(c => normalizeText(c));
      break;
    }
  }

  if (headerIndex === -1) {
    headerIndex = 0;
    headers = rows[0].map(c => normalizeText(c));
  }

  const colMap = {
    stt: headers.findIndex(h => /^stt$|^số\s*tt$|^số\s*thứ\s*tự$/i.test(h)),
    hoVaTen: headers.findIndex(h => /hovaten|họ\s*và\s*tên|họ\s*tên|tên/i.test(h)),
    ns: headers.findIndex(h => /^ns$|ngày\s*sinh|ngày\s*tháng\s*năm\s*sinh/i.test(h)),
    gt: headers.findIndex(h => /^gt$|giới\s*tính/i.test(h)),
    dc2Cap: headers.findIndex(h => /đc\s*2\s*cấp|đc\s*2cấp|địa\s*chỉ\s*2\s*cấp/i.test(h)),
    dcChiTiet: headers.findIndex(h => /^đc$|^địa\s*chỉ$|địa\s*chỉ\s*chi\s*tiết/i.test(h)),
    boPhan: headers.findIndex(h => /bộ\s*phận|^bp$|phòng\s*ban/i.test(h)),
    ngheNghiep: headers.findIndex(h => /nghề\s*nghiệp|nghenghiep|chức\s*vụ|vị\s*trí/i.test(h)),
    sdt: headers.findIndex(h => /sđt|sdt|số\s*điện\s*thoại|điện\s*thoại/i.test(h)),
    tenCty: headers.findIndex(h => /tencty|tên\s*c\.?ty|tên\s*công\s*ty|công\s*ty|doanh\s*nghiệp/i.test(h)),
    cccd: headers.findIndex(h => /cccd|cmt|số\s*cccd/i.test(h)),
  };

  const records: BiaRecord[] = [];
  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(c => !c)) continue;

    const stt = colMap.stt !== -1 ? normalizeText(row[colMap.stt]) : String(records.length + 1);
    const hoVaTen = colMap.hoVaTen !== -1 ? normalizeText(row[colMap.hoVaTen]) : '';
    const ns = normalizeDob(colMap.ns !== -1 ? row[colMap.ns] : '');
    const gt = normalizeGender(colMap.gt !== -1 ? row[colMap.gt] : '');
    const diaChi2Cap = colMap.dc2Cap !== -1 ? normalizeText(row[colMap.dc2Cap]) : '';
    const diaChiChiTiet = colMap.dcChiTiet !== -1 ? normalizeText(row[colMap.dcChiTiet]) : '';
    
    // Determine Department: if explicit "Bộ phận" column exists, use it; otherwise use "Nghề nghiệp"
    let boPhan = '';
    if (colMap.boPhan !== -1 && normalizeText(row[colMap.boPhan])) {
      boPhan = normalizeText(row[colMap.boPhan]);
    } else if (colMap.ngheNghiep !== -1 && normalizeText(row[colMap.ngheNghiep])) {
      boPhan = normalizeText(row[colMap.ngheNghiep]);
    }

    const ngheNghiep = colMap.ngheNghiep !== -1 ? normalizeText(row[colMap.ngheNghiep]) : '';
    const sdt = normalizePhone(colMap.sdt !== -1 ? row[colMap.sdt] : '');
    const tenCty = colMap.tenCty !== -1 ? normalizeText(row[colMap.tenCty]) : '';
    const cccd = colMap.cccd !== -1 ? normalizeText(row[colMap.cccd]) : '';

    if (!hoVaTen && !stt) continue;

    const rawObj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      rawObj[h || `Col_${idx}`] = row[idx] || '';
    });

    records.push({
      id: `bia_${i}_${stt}_${hoVaTen}`,
      stt,
      hoVaTen,
      ns,
      gt,
      diaChiChiTiet,
      diaChi2Cap,
      ngheNghiep,
      boPhan,
      sdt,
      tenCty,
      cccd,
      raw: rawObj,
      normalizedName: normalizeName(hoVaTen),
      normalizedGender: gt,
      normalizedDob: ns,
    });
  }

  return records;
}

/**
 * Extract 4-digit birth year from date string
 */
export function extractBirthYear(dobStr: string): number | null {
  if (!dobStr) return null;
  const match = dobStr.match(/\b(19\d{2}|20\d{2})\b/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Compare two DOB strings: true if identical date string or same birth year / age
 */
export function isSameDobOrAge(dob1: string, dob2: string): boolean {
  if (!dob1 || !dob2) return false;
  const d1 = dob1.trim();
  const d2 = dob2.trim();
  if (d1 === d2) return true;
  const y1 = extractBirthYear(d1);
  const y2 = extractBirthYear(d2);
  if (y1 && y2 && y1 === y2) return true;
  return false;
}

/**
 * Match Bia records with HIS records based on Name, Gender, and DOB/Age
 * Rule: Cùng họ tên nhưng KHÁC ngày sinh/tuổi là 2 người khác nhau -> khớp chuẩn, bỏ qua cảnh báo.
 * Chỉ cảnh báo đối với trường hợp CÙNG HỌ TÊN VÀ CÙNG NGÀY THÁNG NĂM SINH (trùng lặp thực sự).
 */
export function matchRecords(biaRecords: BiaRecord[], hisRecords: HisRecord[]): {
  matchedResults: MatchedRecord[];
  summary: ProcessingSummary;
} {
  const matchedResults: MatchedRecord[] = [];
  const usedHisIds = new Set<string>();

  // Group HIS by (normalizedName, normalizedGender)
  const hisMap = new Map<string, HisRecord[]>();
  for (const h of hisRecords) {
    const key = `${h.normalizedName}|${h.normalizedGender}`;
    const list = hisMap.get(key) || [];
    list.push(h);
    hisMap.set(key, list);
  }

  let exactCount = 0;
  let warningSameDobCount = 0;
  let warningMismatchDobCount = 0;
  let unmatchedBiaCount = 0;

  for (const bia of biaRecords) {
    const key = `${bia.normalizedName}|${bia.normalizedGender}`;
    const candidates = hisMap.get(key) || [];

    let matchedHis: HisRecord | null = null;
    let matchStatus: MatchedRecord['matchStatus'] = 'unmatched_bia';
    const warningNotes: string[] = [];

    // Prioritize Địa chỉ: prefer ĐC 2Cấp, fallback to ĐC chi tiết
    const finalAddress = bia.diaChi2Cap || bia.diaChiChiTiet;

    if (candidates.length === 0) {
      // 0 candidates on HIS
      matchStatus = 'unmatched_bia';
      warningNotes.push('❌ Không tìm thấy hồ sơ tương ứng trên HIS (Chỉ có trong danh sách Bìa).');
      unmatchedBiaCount++;
    } else if (candidates.length === 1) {
      // Exactly 1 candidate on HIS
      const cand = candidates[0];
      if (cand.normalizedDob && bia.normalizedDob) {
        if (isSameDobOrAge(cand.normalizedDob, bia.normalizedDob)) {
          matchedHis = cand;
          usedHisIds.add(matchedHis.id);
          matchStatus = 'exact_single';
          exactCount++;
        } else {
          matchedHis = cand;
          usedHisIds.add(matchedHis.id);
          matchStatus = 'warning_dob_mismatch';
          warningNotes.push(`Khớp họ tên nhưng khác ngày sinh/tuổi (Bìa: ${bia.ns}, HIS: ${cand.ngaySinh})`);
          warningMismatchDobCount++;
        }
      } else {
        matchedHis = cand;
        usedHisIds.add(matchedHis.id);
        matchStatus = 'exact_single';
        exactCount++;
      }
    } else {
      // Multiple candidates with same Name & Gender on HIS!
      // Compare Ngày sinh / Tuổi
      const sameDobCandidates = candidates.filter((c) =>
        isSameDobOrAge(c.normalizedDob, bia.normalizedDob)
      );

      if (sameDobCandidates.length === 1) {
        // EXACTLY 1 candidate has this DOB/Age, other candidates have different DOBs
        // => Cùng tên nhưng khác ngày sinh là 2 người khác nhau, KHỚP CHUẨN, BỎ QUA CẢNH BÁO!
        matchedHis = sameDobCandidates[0];
        usedHisIds.add(matchedHis.id);
        matchStatus = 'exact_single';
        exactCount++;
      } else if (sameDobCandidates.length > 1) {
        // CÙNG HỌ TÊN VÀ CÙNG NGÀY THÁNG NĂM SINH / TUỔI!
        // Đây mới chính là trường hợp thực sự trùng lặp cần cảnh báo để kiểm tra!
        let matchedByCccdOrPhone = sameDobCandidates.filter((c) => {
          if (c.cccd && bia.cccd && c.cccd === bia.cccd) return true;
          if (c.sdt && bia.sdt && c.sdt === bia.sdt) return true;
          return false;
        });

        if (matchedByCccdOrPhone.length === 1) {
          matchedHis = matchedByCccdOrPhone[0];
          usedHisIds.add(matchedHis.id);
          warningNotes.push(`⚠️ CẢNH BÁO: Có ${sameDobCandidates.length} người CÙNG TÊN VÀ CÙNG NGÀY SINH (${bia.ns}) trên HIS (Đã tạm ghép theo CCCD/SĐT). Vui lòng kiểm tra lại!`);
        } else {
          const unused = sameDobCandidates.filter((c) => !usedHisIds.has(c.id));
          matchedHis = unused[0] || sameDobCandidates[0];
          if (matchedHis) usedHisIds.add(matchedHis.id);
          warningNotes.push(`🚨 CẢNH BÁO TRÙNG LẶP: Có ${sameDobCandidates.length} người CÙNG HỌ TÊN VÀ CÙNG NGÀY SINH (${bia.ns}) trên HIS. Vui lòng nhấp Hiệu chỉnh để xác nhận!`);
        }
        matchStatus = 'warning_same_dob';
        warningSameDobCount++;
      } else {
        // Multiple candidates with same name, but none matches DOB
        const unused = candidates.filter((c) => !usedHisIds.has(c.id));
        matchedHis = unused[0] || candidates[0];
        if (matchedHis) usedHisIds.add(matchedHis.id);
        matchStatus = 'warning_dob_mismatch';
        warningNotes.push(`⚠️ Có ${candidates.length} người cùng tên trên HIS nhưng không khớp ngày sinh (${bia.ns}). Vui lòng kiểm tra và hiệu chỉnh.`);
        warningMismatchDobCount++;
      }
    }

    matchedResults.push({
      id: `match_${bia.id}`,
      stt: String(bia.stt),
      maBA: matchedHis ? matchedHis.maBA : '',
      maBN: matchedHis ? matchedHis.maBN : '',
      tenBenhNhan: matchedHis ? matchedHis.tenBenhNhan : bia.hoVaTen,
      ngaySinh: matchedHis ? matchedHis.ngaySinh : bia.ns,
      tuoi: matchedHis ? matchedHis.tuoi : calculateAge(bia.ns),
      gioiTinh: matchedHis ? matchedHis.gioiTinh : bia.gt,
      boPhan: bia.boPhan,
      sdt: bia.sdt,
      tenCty: bia.tenCty,
      diaChi: finalAddress,
      matchStatus,
      warningNotes,
      candidates,
      originalBia: bia,
      matchedHis,
    });
  }

  // Find unmatched HIS records
  const unmatchedHisList = hisRecords.filter((h) => !usedHisIds.has(h.id));

  const summary: ProcessingSummary = {
    totalBia: biaRecords.length,
    totalHis: hisRecords.length,
    matchedCount: exactCount + warningSameDobCount + warningMismatchDobCount,
    exactCount,
    warningSameDobCount,
    warningMismatchDobCount,
    unmatchedBiaCount,
    unmatchedHisCount: unmatchedHisList.length,
    unmatchedHisList,
  };

  return { matchedResults, summary };
}

/**
 * Export results to File Mẫu Chuẩn NSN Excel Workbook
 * Guaranteeing 11 columns, General Text format, and no leading-0 loss on phones!
 */
export function exportToStandardExcel(records: MatchedRecord[], fileNamePrefix: string = 'FileMauChuan_NsN'): void {
  // 11 Standard Headers exactly matching FileMauChuan_NsN.xlsx
  const headers = [
    'STT',
    'Mã BA',
    'Mã BN',
    'Tên bệnh nhân',
    'Ngày sinh',
    'Tuổi',
    'Giới tính',
    'Bộ phận',
    'SĐT',
    'Tên C.ty',
    'Địa Chỉ',
  ];

  // Convert records to 2D array
  const aoa: any[][] = [];
  aoa.push(headers);

  for (const r of records) {
    aoa.push([
      r.stt || '',
      r.maBA || '',
      r.maBN || '',
      normalizeText(r.tenBenhNhan),
      r.ngaySinh || '',
      r.tuoi || '',
      r.gioiTinh || '',
      normalizeText(r.boPhan),
      normalizePhone(r.sdt),
      normalizeText(r.tenCty),
      normalizeText(r.diaChi),
    ]);
  }

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Column widths
  ws['!cols'] = [
    { wch: 8 },   // STT
    { wch: 14 },  // Mã BA
    { wch: 14 },  // Mã BN
    { wch: 28 },  // Tên bệnh nhân
    { wch: 14 },  // Ngày sinh
    { wch: 8 },   // Tuổi
    { wch: 10 },  // Giới tính
    { wch: 26 },  // Bộ phận
    { wch: 15 },  // SĐT
    { wch: 32 },  // Tên C.ty
    { wch: 40 },  // Địa Chỉ
  ];

  // Format EVERY cell to General Text (@) and style professionally
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:K1');

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) {
        ws[cellAddress] = { t: 's', v: '', z: '@' };
      }

      const cell = ws[cellAddress];
      // Force string type & text format
      cell.t = 's';
      cell.z = '@';
      if (cell.v !== undefined && cell.v !== null) {
        cell.v = String(cell.v);
      }

      // Styling
      if (R === 0) {
        // Header row
        cell.s = {
          fill: { fgColor: { rgb: '0284C7' } }, // Sky 600
          font: { name: 'Arial', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
          border: {
            top: { style: 'thin', color: { rgb: '0369A1' } },
            bottom: { style: 'medium', color: { rgb: '0369A1' } },
            left: { style: 'thin', color: { rgb: '0369A1' } },
            right: { style: 'thin', color: { rgb: '0369A1' } },
          },
        };
      } else {
        // Data rows
        const isEven = R % 2 === 0;
        let align: 'center' | 'left' | 'right' = 'left';
        if (C === 0 || C === 1 || C === 2 || C === 4 || C === 5 || C === 6 || C === 8) {
          align = 'center';
        }

        cell.s = {
          fill: { fgColor: { rgb: isEven ? 'F8FAFC' : 'FFFFFF' } },
          font: { name: 'Arial', sz: 10, color: { rgb: '0F172A' } },
          alignment: { horizontal: align, vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: 'E2E8F0' } },
            bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
            left: { style: 'thin', color: { rgb: 'E2E8F0' } },
            right: { style: 'thin', color: { rgb: 'E2E8F0' } },
          },
        };
      }
    }
  }

  // Create workbook with sheet named "Chuan"
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Chuan');

  // Default export filename: FileMauChuan_NsN.xlsx (for BarTender label printing & Mail Merge compatibility)
  const fullFileName = fileNamePrefix.endsWith('.xlsx') ? fileNamePrefix : `${fileNamePrefix}.xlsx`;
  XLSX.writeFile(wb, fullFileName);
}
