export interface HisRecord {
  id: string;
  maBA: string;
  maBN: string;
  tenBenhNhan: string;
  ngaySinh: string;
  tuoi: string;
  gioiTinh: string;
  cccd: string;
  sdt: string;
  noiLamViec: string;
  diaChi: string;
  ngayTiepNhan: string;
  raw: Record<string, any>;
  normalizedName: string;
  normalizedGender: string;
  normalizedDob: string;
}

export interface BiaRecord {
  id: string;
  stt: string | number;
  hoVaTen: string;
  ns: string;
  gt: string;
  diaChiChiTiet: string;
  diaChi2Cap: string;
  ngheNghiep: string;
  boPhan: string;
  sdt: string;
  tenCty: string;
  cccd: string;
  raw: Record<string, any>;
  normalizedName: string;
  normalizedGender: string;
  normalizedDob: string;
}

export type MatchStatus =
  | 'exact_single'       // Khớp duy nhất 1-1
  | 'warning_resolved'   // Trùng tên & giới tính nhưng đã đối soát thành công qua Ngày sinh / CCCD / SĐT
  | 'warning_conflict'   // Cùng tên tuổi / Trùng lặp hoàn toàn cần người dùng xác nhận
  | 'unmatched_bia'      // Có trong Bìa nhưng chưa tìm thấy trên HIS
  | 'manual_adjusted';   // Người dùng đã chỉnh sửa thủ công

export interface MatchedRecord {
  id: string;
  stt: string;
  maBA: string;
  maBN: string;
  tenBenhNhan: string;
  ngaySinh: string;
  tuoi: string;
  gioiTinh: string;
  boPhan: string;
  sdt: string;
  tenCty: string;
  diaChi: string;
  
  matchStatus: MatchStatus;
  warningNotes: string[];
  candidates: HisRecord[];
  
  originalBia: BiaRecord;
  matchedHis: HisRecord | null;
}

export interface ProcessingSummary {
  totalBia: number;
  totalHis: number;
  matchedCount: number;
  exactSingleCount: number;
  warningResolvedCount: number;
  warningConflictCount: number;
  unmatchedBiaCount: number;
  unmatchedHisCount: number;
  unmatchedHisList: HisRecord[];
}

export interface ColumnMappingConfig {
  biaSheetName?: string;
  biaColSTT?: string;
  biaColName?: string;
  biaColGender?: string;
  biaColDOB?: string;
  biaColDept?: string;
  biaColPhone?: string;
  biaColCompany?: string;
  biaColAddress?: string;

  hisColMaBA?: string;
  hisColMaBN?: string;
  hisColName?: string;
  hisColDOB?: string;
  hisColAge?: string;
  hisColGender?: string;
}
