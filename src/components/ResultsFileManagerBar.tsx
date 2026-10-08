import React, { useRef, useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  X,
  FileCheck,
  ChevronDown,
  ChevronUp,
  FolderSync,
  Layers,
  MapPin
} from 'lucide-react';
import { AddressPriority, UploadedFileItem } from '../types';

interface ResultsFileManagerBarProps {
  hisFiles: UploadedFileItem[];
  hisRecordCount: number;
  onAddHisFiles: (files: File[]) => void;
  onReplaceHisFiles: (files: File[]) => void;
  onReplaceSingleHisFile: (fileId: string, newFile: File) => void;
  onRemoveHisFile: (fileId: string) => void;
  onChangeHisAddressCol: (fileId: string, colIndex: number) => void;

  biaFiles: UploadedFileItem[];
  biaRecordCount: number;
  onAddBiaFiles: (files: File[]) => void;
  onReplaceBiaFiles: (files: File[]) => void;
  onReplaceSingleBiaFile: (fileId: string, newFile: File) => void;
  onRemoveBiaFile: (fileId: string) => void;
  onChangeBiaSheet: (fileId: string, sheetName: string) => void;
  onChangeBiaAddressCol: (fileId: string, colIndex: number) => void;

  addressPriority: AddressPriority;
  onChangeAddressPriority: (priority: AddressPriority) => void;

  isUploadVisible: boolean;
  onToggleUploadVisible: () => void;
  onClearImport: () => void;
}

export const ResultsFileManagerBar: React.FC<ResultsFileManagerBarProps> = ({
  hisFiles,
  hisRecordCount,
  onAddHisFiles,
  onReplaceHisFiles,
  onReplaceSingleHisFile,
  onRemoveHisFile,
  onChangeHisAddressCol,
  biaFiles,
  biaRecordCount,
  onAddBiaFiles,
  onReplaceBiaFiles,
  onReplaceSingleBiaFile,
  onRemoveBiaFile,
  onChangeBiaSheet,
  onChangeBiaAddressCol,
  addressPriority,
  onChangeAddressPriority,
  isUploadVisible,
  onToggleUploadVisible,
  onClearImport,
}) => {
  // Input refs
  const addHisInputRef = useRef<HTMLInputElement>(null);
  const replaceHisInputRef = useRef<HTMLInputElement>(null);
  const singleReplaceHisInputRef = useRef<HTMLInputElement>(null);
  const [targetHisId, setTargetHisId] = useState<string | null>(null);

  const addBiaInputRef = useRef<HTMLInputElement>(null);
  const replaceBiaInputRef = useRef<HTMLInputElement>(null);
  const singleReplaceBiaInputRef = useRef<HTMLInputElement>(null);
  const [targetBiaId, setTargetBiaId] = useState<string | null>(null);

  // Drag states
  const [isHisDragOver, setIsHisDragOver] = useState(false);
  const [isBiaDragOver, setIsBiaDragOver] = useState(false);

  const handleHisDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHisDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddHisFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleBiaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsBiaDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddBiaFiles(Array.from(e.dataTransfer.files));
    }
  };

  const triggerSingleHis = (id: string) => {
    setTargetHisId(id);
    singleReplaceHisInputRef.current?.click();
  };

  const triggerSingleBia = (id: string) => {
    setTargetBiaId(id);
    singleReplaceBiaInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
      {/* Hidden inputs */}
      <input
        ref={addHisInputRef}
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
        ref={replaceHisInputRef}
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
        ref={singleReplaceHisInputRef}
        type="file"
        accept=".xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && targetHisId) {
            onReplaceSingleHisFile(targetHisId, e.target.files[0]);
            e.target.value = '';
            setTargetHisId(null);
          }
        }}
      />

      <input
        ref={addBiaInputRef}
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
        ref={replaceBiaInputRef}
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
        ref={singleReplaceBiaInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && targetBiaId) {
            onReplaceSingleBiaFile(targetBiaId, e.target.files[0]);
            e.target.value = '';
            setTargetBiaId(null);
          }
        }}
      />

      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-700">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>Quản Lý File & Cột Địa Chỉ (Hỗ trợ thêm / thay thế / đổi cột trực tiếp)</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ✓ Đang đối soát
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Đang ghép <strong className="text-sky-700">{hisFiles.length} file HIS</strong> ({hisRecordCount} dòng) với{' '}
              <strong className="text-indigo-700">{biaFiles.length} file Bìa</strong> ({biaRecordCount} hồ sơ)
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Address Priority Quick Switch in Results View */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-slate-500 font-medium">Ưu tiên Đ/C:</span>
            <select
              value={addressPriority}
              onChange={(e) => onChangeAddressPriority(e.target.value as any)}
              className="text-[11px] bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-800 font-bold cursor-pointer"
              title="Chọn ưu tiên nguồn lấy Địa chỉ"
            >
              <option value="bia_first">Bìa trước (dự phòng HIS)</option>
              <option value="his_first">HIS trước (dự phòng Bìa)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onToggleUploadVisible}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Đóng/Mở khung nạp file lớn"
          >
            {isUploadVisible ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 mr-1" />
                <span>Thu gọn khung nạp</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 mr-1" />
                <span>Mở rộng khung nạp</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClearImport}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            title="Xóa danh sách và đặt lại trạng thái ban đầu"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Xóa DS
          </button>
        </div>
      </div>

      {/* 2 Sub-bars for HIS and Bia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ================= HIS FILES BAR ================= */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsHisDragOver(true);
          }}
          onDragLeave={() => setIsHisDragOver(false)}
          onDrop={handleHisDrop}
          className={`p-3.5 rounded-xl border transition-all ${
            isHisDragOver
              ? 'border-sky-500 bg-sky-100/60 ring-2 ring-sky-400/40'
              : 'border-slate-200 bg-slate-50/70 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span className="font-bold text-xs text-slate-800">
                File HIS ({hisFiles.length} file · {hisRecordCount} dòng)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => addHisInputRef.current?.click()}
                className="inline-flex items-center px-2 py-1 text-[11px] font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-md transition-colors cursor-pointer"
                title="Chọn thêm 1 hoặc nhiều file HIS để nạp dồn dữ liệu"
              >
                <Plus className="w-3 h-3 mr-0.5" />
                Thêm file
              </button>
              <button
                type="button"
                onClick={() => replaceHisInputRef.current?.click()}
                className="inline-flex items-center px-2 py-1 text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                title="Thay thế toàn bộ file HIS bằng file mới"
              >
                <FolderSync className="w-3 h-3 mr-0.5 text-slate-500" />
                Thay thế
              </button>
            </div>
          </div>

          {/* Chips list */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {hisFiles.map((f, idx) => (
              <div
                key={f.id}
                className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col gap-1.5 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <span className="text-sky-600 font-bold font-mono text-[10px] w-4 shrink-0">
                      {idx + 1}.
                    </span>
                    <div className="truncate font-medium text-slate-800" title={f.name}>
                      {f.name}
                    </div>
                    <span className="text-[10.5px] text-emerald-700 font-semibold shrink-0">
                      ({f.recordCount} dòng)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => triggerSingleHis(f.id)}
                      className="p-1 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                      title="Thay thế file này"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveHisFile(f.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="Xóa file này khỏi danh sách"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Address Column selector for this file */}
                <div className="flex items-center justify-between gap-1.5 text-[10.5px] pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-slate-400 font-medium shrink-0">Đ/C:</span>
                    <select
                      value={f.addressColIndex ?? -1}
                      onChange={(e) => onChangeHisAddressCol(f.id, Number(e.target.value))}
                      className={`text-[10.5px] rounded px-1.5 py-0.5 font-medium cursor-pointer truncate max-w-[170px] ${
                        f.addressColIndex !== undefined && f.addressColIndex >= 0
                          ? 'bg-slate-50 border border-slate-200 text-slate-700'
                          : 'bg-amber-50 border border-amber-300 text-amber-900 font-bold'
                      }`}
                      title="Chọn cột Địa chỉ cho file này"
                    >
                      <option value="-1">-- Không lấy địa chỉ file này --</option>
                      {f.headers && f.headers.map((h, hIdx) => (
                        <option key={hIdx} value={hIdx}>
                          {h ? h : `[Cột ${hIdx + 1}]`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {f.addressColIndex !== undefined && f.addressColIndex >= 0 ? (
                    f.isAddressAutoDetected ? (
                      <span className="text-[9.5px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-bold shrink-0">
                        ✓ Tự nhận diện
                      </span>
                    ) : (
                      <span className="text-[9.5px] text-sky-700 bg-sky-50 px-1 py-0.2 rounded font-semibold shrink-0">
                        Đã chọn
                      </span>
                    )
                  ) : (
                    <span className="text-[9.5px] text-amber-800 bg-amber-100 px-1 py-0.2 rounded font-bold shrink-0">
                      ⚠️ Chưa có
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-[10.5px] text-slate-400 text-center">
            💡 Có thể kéo thả trực tiếp file HIS vào khung này để nạp thêm
          </div>
        </div>

        {/* ================= BIA FILES BAR ================= */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsBiaDragOver(true);
          }}
          onDragLeave={() => setIsBiaDragOver(false)}
          onDrop={handleBiaDrop}
          className={`p-3.5 rounded-xl border transition-all ${
            isBiaDragOver
              ? 'border-indigo-500 bg-indigo-100/60 ring-2 ring-indigo-400/40'
              : 'border-slate-200 bg-slate-50/70 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="font-bold text-xs text-slate-800">
                File Bìa ({biaFiles.length} file · {biaRecordCount} hồ sơ)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => addBiaInputRef.current?.click()}
                className="inline-flex items-center px-2 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-md transition-colors cursor-pointer"
                title="Chọn thêm 1 hoặc nhiều file Danh sách để nạp dồn dữ liệu"
              >
                <Plus className="w-3 h-3 mr-0.5" />
                Thêm file
              </button>
              <button
                type="button"
                onClick={() => replaceBiaInputRef.current?.click()}
                className="inline-flex items-center px-2 py-1 text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                title="Thay thế toàn bộ file Bìa bằng file mới"
              >
                <FolderSync className="w-3 h-3 mr-0.5 text-slate-500" />
                Thay thế
              </button>
            </div>
          </div>

          {/* Chips list */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {biaFiles.map((f, idx) => (
              <div
                key={f.id}
                className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col gap-1.5 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <span className="text-indigo-600 font-bold font-mono text-[10px] w-4 shrink-0">
                      {idx + 1}.
                    </span>
                    <div className="truncate font-medium text-slate-800" title={f.name}>
                      {f.name}
                    </div>
                    <span className="text-[10.5px] text-emerald-700 font-semibold shrink-0">
                      ({f.recordCount} hồ sơ)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Sheet Selector for this specific file */}
                    {f.availableSheets && f.availableSheets.length > 1 && (
                      <select
                        value={f.selectedSheet || ''}
                        onChange={(e) => onChangeBiaSheet(f.id, e.target.value)}
                        className="text-[10.5px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-700 font-medium cursor-pointer max-w-[90px] truncate"
                        title="Đổi sheet file này"
                      >
                        {f.availableSheets.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={() => triggerSingleBia(f.id)}
                      className="p-1 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                      title="Thay thế file này"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveBiaFile(f.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="Xóa file này khỏi danh sách"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Address Column selector for this Bia file */}
                <div className="flex items-center justify-between gap-1.5 text-[10.5px] pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-slate-400 font-medium shrink-0">Đ/C:</span>
                    <select
                      value={f.addressColIndex ?? -1}
                      onChange={(e) => onChangeBiaAddressCol(f.id, Number(e.target.value))}
                      className={`text-[10.5px] rounded px-1.5 py-0.5 font-medium cursor-pointer truncate max-w-[170px] ${
                        f.addressColIndex !== undefined && f.addressColIndex >= 0
                          ? 'bg-slate-50 border border-slate-200 text-slate-700'
                          : 'bg-amber-50 border border-amber-300 text-amber-900 font-bold'
                      }`}
                      title="Chọn cột Địa chỉ cho file Danh sách này"
                    >
                      <option value="-1">-- Không lấy địa chỉ file này --</option>
                      {f.headers && f.headers.map((h, hIdx) => (
                        <option key={hIdx} value={hIdx}>
                          {h ? h : `[Cột ${hIdx + 1}]`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {f.addressColIndex !== undefined && f.addressColIndex >= 0 ? (
                    f.isAddressAutoDetected ? (
                      <span className="text-[9.5px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-bold shrink-0">
                        ✓ Tự nhận diện
                      </span>
                    ) : (
                      <span className="text-[9.5px] text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded font-semibold shrink-0">
                        Đã chọn
                      </span>
                    )
                  ) : (
                    <span className="text-[9.5px] text-amber-800 bg-amber-100 px-1 py-0.2 rounded font-bold shrink-0">
                      ⚠️ Chưa có
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-[10.5px] text-slate-400 text-center">
            💡 Có thể kéo thả trực tiếp file Danh sách vào khung này để nạp thêm
          </div>
        </div>
      </div>
    </div>
  );
};
