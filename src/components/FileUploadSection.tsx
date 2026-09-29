import React, { useRef } from 'react';
import { FileSpreadsheet, Upload, CheckCircle2, Trash2, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { exportToStandardExcel } from '../services/dataEngine';

interface FileUploadSectionProps {
  hisFile: File | null;
  hisRecordCount: number;
  onHisFileChange: (file: File | null) => void;

  biaFile: File | null;
  biaRecordCount: number;
  availableSheets: string[];
  selectedSheet: string;
  onSheetChange: (sheet: string) => void;
  onBiaFileChange: (file: File | null) => void;

  isProcessing: boolean;
  onProcess: () => void;
  onClearImport: () => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  hisFile,
  hisRecordCount,
  onHisFileChange,
  biaFile,
  biaRecordCount,
  availableSheets,
  selectedSheet,
  onSheetChange,
  onBiaFileChange,
  isProcessing,
  onProcess,
  onClearImport,
}) => {
  const hisInputRef = useRef<HTMLInputElement>(null);
  const biaInputRef = useRef<HTMLInputElement>(null);

  const handleHisDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onHisFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleBiaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onBiaFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    exportToStandardExcel([], 'FileMauChuan_NsN_Template');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600" />
            Nạp 2 File Excel Đầu Vào
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ghép thông tin Mã BA, Mã BN, Tuổi từ HIS với STT, Bộ phận, SĐT, Công ty từ Danh sách Bìa
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            type="button"
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
            title="Tải cấu trúc file mẫu chuẩn 11 cột để tham khảo"
          >
            <FileText className="w-3.5 h-3.5 mr-1" />
            Mẫu Chuẩn 11 Cột
          </button>

          {(hisFile || biaFile) && (
            <button
              onClick={onClearImport}
              type="button"
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
              title="Xóa sạch danh sách import và đặt lại trạng thái ban đầu"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Xóa danh sách (Clear Import)
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* FILE 1: HIS FILE */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleHisDrop}
          onClick={() => hisInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
            hisFile
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-slate-300 hover:border-sky-400 hover:bg-sky-50/20 bg-slate-50/50'
          }`}
        >
          <input
            ref={hisInputRef}
            type="file"
            accept=".xls,.xlsx"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onHisFileChange(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
            {hisFile ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div className="text-sm font-bold text-slate-800">
            File 1: Dữ liệu xuất từ HIS (.xls / .xlsx)
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chứa: <span className="font-semibold text-slate-700">Mã BA, Mã BN, Tên bệnh nhân, Ngày sinh, Giới tính</span>
          </p>

          {hisFile ? (
            <div className="mt-3.5 pt-3 border-t border-emerald-200 text-left bg-white/80 p-2.5 rounded-lg border border-emerald-100">
              <div className="text-xs font-semibold text-emerald-800 truncate" title={hisFile.name}>
                📄 {hisFile.name}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5 flex items-center justify-between">
                <span>Dung lượng: {(hisFile.size / 1024).toFixed(1)} KB</span>
                <span className="font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  {hisRecordCount} bản ghi HIS
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs text-sky-600 font-medium">
              Nhấp hoặc kéo thả file HIS vào đây
            </div>
          )}
        </div>

        {/* FILE 2: DANH SÁCH BÌA */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleBiaDrop}
          onClick={(e) => {
            // Prevent file picker if user is interacting with sheet dropdown
            if ((e.target as HTMLElement).tagName.toLowerCase() !== 'select') {
              biaInputRef.current?.click();
            }
          }}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
            biaFile
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-slate-300 hover:border-sky-400 hover:bg-sky-50/20 bg-slate-50/50'
          }`}
        >
          <input
            ref={biaInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onBiaFileChange(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            {biaFile ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div className="text-sm font-bold text-slate-800">
            File 2: Danh sách hồ sơ KSK (Sheet Bìa)
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chứa: <span className="font-semibold text-slate-700">STT, Họ tên, Giới tính, Bộ phận, SĐT, Tên Cty, Địa Chỉ</span>
          </p>

          {biaFile ? (
            <div className="mt-3.5 pt-3 border-t border-emerald-200 text-left bg-white/80 p-2.5 rounded-lg border border-emerald-100">
              <div className="text-xs font-semibold text-emerald-800 truncate" title={biaFile.name}>
                📋 {biaFile.name}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1 flex items-center justify-between gap-2">
                <span>{(biaFile.size / 1024).toFixed(1)} KB</span>

                {/* Sheet selector */}
                {availableSheets.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600 font-medium">Sheet:</span>
                    <select
                      value={selectedSheet}
                      onChange={(e) => onSheetChange(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-800 font-semibold cursor-pointer"
                    >
                      {availableSheets.map((s) => (
                        <option key={s} value={s}>
                          {s} {s.toLowerCase() === 'bìa' || s.toLowerCase() === 'bia' ? '★ (Khuyên dùng)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <span className="font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  {biaRecordCount} hồ sơ Bìa
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs text-indigo-600 font-medium">
              Nhấp hoặc kéo thả file Danh sách vào đây
            </div>
          )}
        </div>
      </div>

      {/* Action Submit */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          💡 Thuật toán tự động chuẩn hóa dấu cách, chuẩn hóa Unicode NFC và giữ nguyên số 0 ở đầu SĐT.
        </div>

        <button
          onClick={onProcess}
          disabled={!hisFile || !biaFile || isProcessing}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang đối soát & ghép...</span>
            </>
          ) : (
            <>
              <span>Bắt Đầu Ghép Dữ Liệu</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
