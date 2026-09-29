import React, { useState } from 'react';
import { X, Check, AlertTriangle, UserCheck, Search } from 'lucide-react';
import { MatchedRecord, HisRecord } from '../types';

interface DisambiguationModalProps {
  record: MatchedRecord | null;
  allHisRecords: HisRecord[];
  onClose: () => void;
  onSelectCandidate: (matchedRecordId: string, selectedHis: HisRecord) => void;
  onManualCustomEdit: (matchedRecordId: string, customMaBA: string, customMaBN: string, customDob: string) => void;
}

export const DisambiguationModal: React.FC<DisambiguationModalProps> = ({
  record,
  allHisRecords,
  onClose,
  onSelectCandidate,
  onManualCustomEdit,
}) => {
  if (!record) return null;

  const [customMaBA, setCustomMaBA] = useState(record.maBA);
  const [customMaBN, setCustomMaBN] = useState(record.maBN);
  const [customDob, setCustomDob] = useState(record.ngaySinh);
  const [searchTerm, setSearchTerm] = useState('');

  // Candidates list: either from record.candidates or searched from all HIS records
  const candidates = record.candidates && record.candidates.length > 0
    ? record.candidates
    : allHisRecords.filter(h => h.normalizedName === record.originalBia.normalizedName);

  // Search filtered candidates if search term provided
  const displayList = searchTerm.trim()
    ? allHisRecords.filter(h =>
        h.tenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.maBA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.maBN.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.cccd.includes(searchTerm) ||
        h.sdt.includes(searchTerm)
      ).slice(0, 10)
    : candidates;

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onManualCustomEdit(record.id, customMaBA.trim(), customMaBN.trim(), customDob.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Hiệu Chỉnh & Chọn Hồ Sơ Ghép HIS</h3>
              <p className="text-xs text-slate-400">
                Đối soát và lựa chọn chính xác hồ sơ bệnh nhân khi có trùng tên hoặc cùng tuổi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Target Bia Profile */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <div className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2">
              Hồ Sơ Đang Xét (Từ Danh Sách Bìa)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">STT:</span>
                <span className="font-bold text-slate-800">{record.stt}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Họ và tên:</span>
                <span className="font-bold text-sky-800 text-sm">{record.originalBia.hoVaTen}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ngày sinh:</span>
                <span className="font-bold text-slate-800">{record.originalBia.ns || 'Chưa có'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Giới tính:</span>
                <span className="font-bold text-slate-800">{record.originalBia.gt}</span>
              </div>
              <div>
                <span className="text-slate-500 block">SĐT:</span>
                <span className="font-semibold text-slate-800">{record.originalBia.sdt || 'Chưa có'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">CCCD:</span>
                <span className="font-semibold text-slate-800">{record.originalBia.cccd || 'Chưa có'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block">Bộ phận / Nghề:</span>
                <span className="font-semibold text-slate-800 truncate block">{record.originalBia.boPhan || record.originalBia.ngheNghiep}</span>
              </div>
            </div>
          </div>

          {/* List Candidates from HIS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Các ứng viên tìm thấy trên HIS ({displayList.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Nhấp nút "Chọn hồ sơ này" để gán
              </span>
            </div>

            {displayList.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                Không tìm thấy ứng viên nào cùng tên trên HIS.
              </div>
            ) : (
              <div className="space-y-2.5">
                {displayList.map((cand) => {
                  const isSelected = record.matchedHis?.id === cand.id || (record.maBA === cand.maBA && record.maBN === cand.maBN);
                  const isDobMatch = cand.normalizedDob && record.originalBia.normalizedDob && cand.normalizedDob === record.originalBia.normalizedDob;

                  return (
                    <div
                      key={cand.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{cand.tenBenhNhan}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                              {cand.gioiTinh}
                            </span>
                            {isDobMatch && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                ✓ Trùng ngày sinh
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-600 text-white">
                                Đang chọn
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 mt-1">
                            <div>
                              <span className="text-slate-400">Mã BA: </span>
                              <span className="font-mono font-bold text-sky-700">{cand.maBA}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Mã BN: </span>
                              <span className="font-mono font-bold text-indigo-700">{cand.maBN}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Ngày sinh: </span>
                              <span className="font-semibold text-slate-800">{cand.ngaySinh}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Tuổi: </span>
                              <span className="font-semibold text-slate-800">{cand.tuoi}</span>
                            </div>
                            {cand.cccd && (
                              <div>
                                <span className="text-slate-400">CCCD: </span>
                                <span>{cand.cccd}</span>
                              </div>
                            )}
                            {cand.sdt && (
                              <div>
                                <span className="text-slate-400">SĐT: </span>
                                <span>{cand.sdt}</span>
                              </div>
                            )}
                            {cand.diaChi && (
                              <div className="col-span-2 truncate" title={cand.diaChi}>
                                <span className="text-slate-400">Đ/c: </span>
                                <span>{cand.diaChi}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onSelectCandidate(record.id, cand);
                            onClose();
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700'
                          }`}
                        >
                          {isSelected ? 'Đã Chọn' : 'Chọn hồ sơ này'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Manual Entry Fallback */}
          <div className="pt-4 border-t border-slate-200">
            <form onSubmit={handleSaveCustom} className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Hoặc Nhập Thủ Công Mã BA / Mã BN
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mã BA</label>
                  <input
                    type="text"
                    value={customMaBA}
                    onChange={(e) => setCustomMaBA(e.target.value)}
                    placeholder="VD: BA26143917"
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mã BN</label>
                  <input
                    type="text"
                    value={customMaBN}
                    onChange={(e) => setCustomMaBN(e.target.value)}
                    placeholder="VD: BN26090070"
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ngày sinh (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    value={customDob}
                    onChange={(e) => setCustomDob(e.target.value)}
                    placeholder="VD: 25/05/1997"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Lưu Thủ Công
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
