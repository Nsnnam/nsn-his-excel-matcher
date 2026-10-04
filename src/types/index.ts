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
  | 'exact_single'           // Khớp chuẩn 1-1 (duy nhất hoặc cùng tên nhưng khác ngày sinh/tuổi)
  | 'warning_same_dob'       // CẢNH BÁO: CÙNG HỌ TÊN VÀ CÙNG NGÀY SINH / TUỔI
  | 'warning_dob_mismatch'   // Cùng họ tên nhưng lệch ngày sinh
  | 'unmatched_bia'          // Có trong Bìa nhưng chưa tìm thấy trên HIS
  | 'manual_adjusted';       // Người dùng đã chỉnh sửa thủ công

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
  exactCount: number;
  warningSameDobCount: number;
  warningMismatchDobCount: number;
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

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  recordCount: number;
  uploadedAt: Date;
  selectedSheet?: string;
  availableSheets?: string[];
  rawRowsBySheet?: Record<string, string[][]>;
  parsedHisRecords?: HisRecord[];
  parsedBiaRecords?: BiaRecord[];
}
