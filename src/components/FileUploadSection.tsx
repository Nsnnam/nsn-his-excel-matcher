import React, { useRef, useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Trash2,
  ArrowRight,
  RefreshCw,
  FileText,
  Plus,
  FileCheck,
  X,
  Layers,
  FolderSync
} from 'lucide-react';
import { exportToStandardExcel } from '../services/dataEngine';
import { UploadedFileItem } from '../types';

interface FileUploadSectionProps {
  // HIS Files
  hisFiles: UploadedFileItem[];
  hisRecordCount: number;
  onAddHisFiles: (files: File[]) => void;
  onReplaceHisFiles: (files: File[]) => void;
  onReplaceSingleHisFile: (fileId: string, newFile: File) => void;
  onRemoveHisFile: (fileId: string) => void;

  // Bia Files
  biaFiles: UploadedFileItem[];
  biaRecordCount: number;
  onAddBiaFiles: (files: File[]) => void;
  onReplaceBiaFiles: (files: File[]) => void;
  onReplaceSingleBiaFile: (fileId: string, newFile: File) => void;
  onRemoveBiaFile: (fileId: string) => void;
  onChangeBiaSheet: (fileId: string, sheetName: string) => void;

  isProcessing: boolean;
  onProcess: () => void;
  onClearImport: () => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  hisFiles,
  hisRecordCount,
  onAddHisFiles,
  onReplaceHisFiles,
  onReplaceSingleHisFile,
  onRemoveHisFile,
  biaFiles,
  biaRecordCount,
  onAddBiaFiles,
  onReplaceBiaFiles,
  onReplaceSingleBiaFile,
  onRemoveBiaFile,
  onChangeBiaSheet,
  isProcessing,
  onProcess,
  onClearImport,
}) => {
  // File inputs for HIS
  const hisAppendInputRef = useRef<HTMLInputElement>(null);
  const hisReplaceAllInputRef = useRef<HTMLInputElement>(null);
  const hisSingleReplaceInputRef = useRef<HTMLInputElement>(null);
  const [selectedHisReplaceId, setSelectedHisReplaceId] = useState<string | null>(null);

  // File inputs for Bia
  const biaAppendInputRef = useRef<HTMLInputElement>(null);
  const biaReplaceAllInputRef = useRef<HTMLInputElement>(null);
  const biaSingleReplaceInputRef = useRef<HTMLInputElement>(null);
  const [selectedBiaReplaceId, setSelectedBiaReplaceId] = useState<string | null>(null);

  // Drag states
  const [isHisDragOver, setIsHisDragOver] = useState(false);
  const [isBiaDragOver, setIsBiaDragOver] = useState(false);

  // Handle Drag & Drop for HIS
  const handleHisDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHisDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (hisFiles.length === 0) {
        onReplaceHisFiles(files);
      } else {
        onAddHisFiles(files);
      }
    }
  };

  // Handle Drag & Drop for Bia
  const handleBiaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsBiaDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (biaFiles.length === 0) {
        onReplaceBiaFiles(files);
      } else {
        onAddBiaFiles(files);
      }
    }
  };

  const handleDownloadTemplate = () => {
    exportToStandardExcel([], 'FileMauChuan_NsN_Template');
  };

  const triggerSingleHisReplace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHisReplaceId(id);
    hisSingleReplaceInputRef.current?.click();
  };

  const triggerSingleBiaReplace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBiaReplaceId(id);
    biaSingleReplaceInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7 transition-all">
      {/* Hidden inputs for HIS */}
      <input
        ref={hisAppendInputRef}
        type="file"
        multiple
        accept=".xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAddHisFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
      />
      <input
        ref={hisReplaceAllInputRef}
        type="file"
        multiple
        accept=".xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onReplaceHisFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
      />
      <input
        ref={hisSingleReplaceInputRef}
        type="file"
        accept=".xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && selectedHisReplaceId) {
            onReplaceSingleHisFile(selectedHisReplaceId, e.target.files[0]);
            e.target.value = '';
            setSelectedHisReplaceId(null);
          }
        }}
      />

      {/* Hidden inputs for Bia */}
      <input
        ref={biaAppendInputRef}
        type="file"
        multiple
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAddBiaFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
      />
      <input
        ref={biaReplaceAllInputRef}
        type="file"
        multiple
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onReplaceBiaFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
      />
      <input
        ref={biaSingleReplaceInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && selectedBiaReplaceId) {
            onReplaceSingleBiaFile(selectedBiaReplaceId, e.target.files[0]);
            e.target.value = '';
            setSelectedBiaReplaceId(null);
          }
        }}
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600" />
            Nạp File Excel Đầu Vào (Hỗ Trợ Nạp Nhiều File / Thay Thế)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cho phép chọn nhiều file cùng lúc, nạp dồn dữ liệu hoặc thay thế linh hoạt trực tiếp trên giao diện
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

          {(hisFiles.length > 0 || biaFiles.length > 0) && (
            <button
              onClick={onClearImport}
              type="button"
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
              title="Xóa sạch toàn bộ danh sách file đã nạp và đặt lại trạng thái ban đầu"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Xóa danh sách (Clear Import)
            </button>
          )}
        </div>
      </div>

      {/* Grid 2 Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* ===================== FILE 1: HIS FILE ===================== */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsHisDragOver(true);
          }}
          onDragLeave={() => setIsHisDragOver(false)}
          onDrop={handleHisDrop}
          className={`relative border-2 border-dashed rounded-2xl p-5 transition-all flex flex-col justify-between ${
            isHisDragOver
              ? 'border-sky-500 bg-sky-100/50 ring-2 ring-sky-400/30'
              : hisFiles.length > 0
              ? 'border-emerald-400/90 bg-emerald-50/20'
              : 'border-slate-300 hover:border-sky-400 hover:bg-sky-50/20 bg-slate-50/50'
          }`}
        >
          <div>
            {/* Header of HIS Box */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  {hisFiles.length > 0 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Upload className="w-5 h-5 text-sky-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    File 1: Dữ liệu xuất từ HIS (.xls / .xlsx)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {hisFiles.length > 0 ? (
                      <span className="text-emerald-700 font-semibold">
                        Đã nạp {hisFiles.length} file · {hisRecordCount} dòng HIS
                      </span>
                    ) : (
                      'Chứa: Mã BA, Mã BN, Tên BN, Ngày sinh, Giới tính, Nơi làm việc'
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Header */}
              {hisFiles.length > 0 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => hisAppendInputRef.current?.click()}
                    className="inline-flex items-center px-2 py-1 text-[11px] font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors cursor-pointer"
                    title="Nạp thêm 1 hoặc nhiều file HIS khác (nạp dồn)"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    Thêm file
                  </button>
                  <button
                    type="button"
                    onClick={() => hisReplaceAllInputRef.current?.click()}
                    className="inline-flex items-center px-2 py-1 text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Thay thế toàn bộ danh sách file HIS bằng file mới"
                  >
                    <FolderSync className="w-3 h-3 mr-0.5 text-slate-500" />
                    Thay thế hết
                  </button>
                </div>
              )}
            </div>

            {/* List of uploaded HIS files */}
            {hisFiles.length > 0 ? (
              <div className="space-y-2 mt-3 mb-3 max-h-56 overflow-y-auto pr-1">
                {hisFiles.map((fileItem, idx) => (
                  <div
                    key={fileItem.id}
                    className="p-2.5 bg-white border border-slate-200 hover:border-sky-300 rounded-xl flex items-center justify-between gap-2 shadow-2xs text-xs transition-all"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-sky-50 text-sky-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 truncate" title={fileItem.name}>
                          {fileItem.name}
                        </div>
                        <div className="text-[10.5px] text-slate-400 flex items-center space-x-2">
                          <span>{(fileItem.size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-700">
                            {fileItem.recordCount} dòng
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => triggerSingleHisReplace(fileItem.id, e)}
                        className="px-2 py-1 text-[10.5px] font-medium text-slate-600 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-md transition-colors cursor-pointer"
                        title="Thay thế trực tiếp file này bằng file khác"
                      >
                        <RefreshCw className="w-3 h-3 inline mr-1 text-slate-500" />
                        Thay
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveHisFile(fileItem.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Xóa file này"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty dropzone state */
              <div
                onClick={() => hisAppendInputRef.current?.click()}
                className="py-8 text-center cursor-pointer"
              >
                <div className="text-xs text-sky-600 font-semibold mb-1">
                  Nhấp hoặc kéo thả 1 hoặc nhiều file HIS vào đây
                </div>
                <div className="text-[11px] text-slate-400">
                  Hỗ trợ định dạng .xls (VNPT-HIS) và .xlsx
                </div>
              </div>
            )}
          </div>

          {/* Bottom compact drop helper when files exist */}
          {hisFiles.length > 0 && (
            <div
              onClick={() => hisAppendInputRef.current?.click()}
              className="mt-2 py-2 px-3 border border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-100/50 rounded-xl text-center text-xs text-sky-700 font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nhấp hoặc kéo thả thêm file HIS vào đây để nạp dồn</span>
            </div>
          )}
        </div>

        {/* ===================== FILE 2: DANH SÁCH BÌA ===================== */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsBiaDragOver(true);
          }}
          onDragLeave={() => setIsBiaDragOver(false)}
          onDrop={handleBiaDrop}
          className={`relative border-2 border-dashed rounded-2xl p-5 transition-all flex flex-col justify-between ${
            isBiaDragOver
              ? 'border-indigo-500 bg-indigo-100/50 ring-2 ring-indigo-400/30'
              : biaFiles.length > 0
              ? 'border-emerald-400/90 bg-emerald-50/20'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/20 bg-slate-50/50'
          }`}
        >
          <div>
            {/* Header of Bia Box */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  {biaFiles.length > 0 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Upload className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    File 2: Danh sách hồ sơ KSK (Sheet Bìa)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {biaFiles.length > 0 ? (
                      <span className="text-emerald-700 font-semibold">
                        Đã nạp {biaFiles.length} file · {biaRecordCount} hồ sơ Bìa
                      </span>
                    ) : (
                      'Chứa: STT, Họ tên, Giới tính, Bộ phận, SĐT, Tên Cty, Địa Chỉ'
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Header */}
              {biaFiles.length > 0 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => biaAppendInputRef.current?.click()}
                    className="inline-flex items-center px-2 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors cursor-pointer"
                    title="Nạp thêm 1 hoặc nhiều file Danh sách khác (nạp dồn)"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    Thêm file
                  </button>
                  <button
                    type="button"
                    onClick={() => biaReplaceAllInputRef.current?.click()}
                    className="inline-flex items-center px-2 py-1 text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Thay thế toàn bộ danh sách file Bìa bằng file mới"
                  >
                    <FolderSync className="w-3 h-3 mr-0.5 text-slate-500" />
                    Thay thế hết
                  </button>
                </div>
              )}
            </div>

            {/* List of uploaded Bia files */}
            {biaFiles.length > 0 ? (
              <div className="space-y-2 mt-3 mb-3 max-h-56 overflow-y-auto pr-1">
                {biaFiles.map((fileItem, idx) => (
                  <div
                    key={fileItem.id}
                    className="p-2.5 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs text-xs transition-all"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 truncate" title={fileItem.name}>
                          {fileItem.name}
                        </div>
                        <div className="text-[10.5px] text-slate-400 flex items-center space-x-2">
                          <span>{(fileItem.size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-700">
                            {fileItem.recordCount} hồ sơ
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      {/* Sheet Selector for this file */}
                      {fileItem.availableSheets && fileItem.availableSheets.length > 1 && (
                        <div className="flex items-center gap-1">
                          <select
                            value={fileItem.selectedSheet || ''}
                            onChange={(e) => onChangeBiaSheet(fileItem.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-800 font-medium cursor-pointer max-w-[110px] truncate"
                            title="Chọn Sheet của file này"
                          >
                            {fileItem.availableSheets.map((s) => (
                              <option key={s} value={s}>
                                {s} {s.toLowerCase() === 'bìa' || s.toLowerCase() === 'bia' ? '★' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => triggerSingleBiaReplace(fileItem.id, e)}
                        className="px-2 py-1 text-[10.5px] font-medium text-slate-600 hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-md transition-colors cursor-pointer"
                        title="Thay thế trực tiếp file này bằng file khác"
                      >
                        <RefreshCw className="w-3 h-3 inline mr-1 text-slate-500" />
                        Thay
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBiaFile(fileItem.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Xóa file này"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty dropzone state */
              <div
                onClick={() => biaAppendInputRef.current?.click()}
                className="py-8 text-center cursor-pointer"
              >
                <div className="text-xs text-indigo-600 font-semibold mb-1">
                  Nhấp hoặc kéo thả 1 hoặc nhiều file Danh sách vào đây
                </div>
                <div className="text-[11px] text-slate-400">
                  Hỗ trợ định dạng .xlsx và .xls (Sheet Bìa)
                </div>
              </div>
            )}
          </div>

          {/* Bottom compact drop helper when files exist */}
          {biaFiles.length > 0 && (
            <div
              onClick={() => biaAppendInputRef.current?.click()}
              className="mt-2 py-2 px-3 border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/50 rounded-xl text-center text-xs text-indigo-700 font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nhấp hoặc kéo thả thêm file Danh sách vào đây để nạp dồn</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Submit */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          💡 Hỗ trợ nạp nhiều file cùng lúc, tự động ghép theo Tên + Giới tính, đối soát Tuổi và fallback Nơi làm việc từ HIS.
        </div>

        <button
          onClick={onProcess}
          disabled={hisFiles.length === 0 || biaFiles.length === 0 || isProcessing}
          className="w-full sm:w-auto px-7 py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
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
