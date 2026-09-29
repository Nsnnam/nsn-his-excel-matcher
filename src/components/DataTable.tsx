import React, { useState } from 'react';
import { Download, Search, Edit3, AlertTriangle, CheckCircle, UserX, Info, Phone, ExternalLink } from 'lucide-react';
import { MatchedRecord, HisRecord, ProcessingSummary } from '../types';
import { exportToStandardExcel } from '../services/dataEngine';

interface DataTableProps {
  records: MatchedRecord[];
  summary: ProcessingSummary;
  activeFilter: 'all' | 'warning' | 'exact' | 'unmatched_bia' | 'unmatched_his';
  onFilterChange: (f: 'all' | 'warning' | 'exact' | 'unmatched_bia' | 'unmatched_his') => void;
  onOpenDisambiguate: (record: MatchedRecord) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  records,
  summary,
  activeFilter,
  onFilterChange,
  onOpenDisambiguate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter records based on activeFilter and searchTerm
  const filteredRecords = records.filter((r) => {
    // Status filter
    if (activeFilter === 'warning') {
      if (r.matchStatus !== 'warning_same_dob' && r.matchStatus !== 'warning_dob_mismatch') return false;
    } else if (activeFilter === 'exact') {
      if (r.matchStatus !== 'exact_single') return false;
    } else if (activeFilter === 'unmatched_bia') {
      if (r.matchStatus !== 'unmatched_bia') return false;
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.tenBenhNhan.toLowerCase().includes(q);
      const matchStt = String(r.stt).includes(q);
      const matchMaBA = r.maBA.toLowerCase().includes(q);
      const matchMaBN = r.maBN.toLowerCase().includes(q);
      const matchPhone = r.sdt.includes(q);
      const matchDept = r.boPhan.toLowerCase().includes(q);
      return matchName || matchStt || matchMaBA || matchMaBN || matchPhone || matchDept;
    }
    return true;
  });

  const handleExport = () => {
    exportToStandardExcel(records, 'FileMauChuan_NsN');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo Tên, STT, Mã BA/BN, SĐT..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            Hiển thị <strong>{activeFilter === 'unmatched_his' ? summary.unmatchedHisCount : filteredRecords.length}</strong> kết quả
          </div>
        </div>

        {/* Big Prominent Export Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={records.length === 0}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất File: FileMauChuan_NsN.xlsx</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-800/60 text-white text-[11px] font-bold">
              {records.length} dòng
            </span>
          </button>
        </div>
      </div>

      {/* Main Content: Either Normal Table or Unmatched HIS List */}
      {activeFilter === 'unmatched_his' ? (
        /* View list of records on HIS that do not exist in Bia */
        <div className="p-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-indigo-900">
                Danh Sách {summary.unmatchedHisList.length} Bệnh Nhân Có Trên HIS Nhưng Không Có Trong DS Bìa
              </h4>
              <p className="text-xs text-indigo-700 mt-0.5">
                Các bệnh nhân này được tiếp nhận trên hệ thống HIS nhưng chưa có tên trong danh sách đăng ký khám của công ty (Ví dụ chuyên gia nước ngoài, nhân viên bổ sung đột xuất).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">Mã BA</th>
                  <th className="px-4 py-3">Mã BN</th>
                  <th className="px-4 py-3">Tên Bệnh Nhân</th>
                  <th className="px-4 py-3">Ngày Sinh</th>
                  <th className="px-4 py-3">Giới Tính</th>
                  <th className="px-4 py-3">CCCD</th>
                  <th className="px-4 py-3">SĐT</th>
                  <th className="px-4 py-3">Địa Chỉ BN</th>
                  <th className="px-4 py-3">Nơi Làm Việc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {summary.unmatchedHisList.map((h, idx) => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono font-bold text-sky-700">{h.maBA}</td>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">{h.maBN}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{h.tenBenhNhan}</td>
                    <td className="px-4 py-3">{h.ngaySinh}</td>
                    <td className="px-4 py-3">{h.gioiTinh}</td>
                    <td className="px-4 py-3 font-mono">{h.cccd}</td>
                    <td className="px-4 py-3 font-mono">{h.sdt}</td>
                    <td className="px-4 py-3 text-slate-600">{h.diaChi}</td>
                    <td className="px-4 py-3 text-slate-600">{h.noiLamViec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View 11-column Standard Output Table */
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-sky-600 text-white font-bold text-[11px] uppercase tracking-wider select-none">
                <th className="px-3 py-3 text-center border-r border-sky-500/50 w-12">STT</th>
                <th className="px-3 py-3 text-center border-r border-sky-500/50">Mã BA</th>
                <th className="px-3 py-3 text-center border-r border-sky-500/50">Mã BN</th>
                <th className="px-4 py-3 border-r border-sky-500/50 min-w-[180px]">Tên bệnh nhân</th>
                <th className="px-3 py-3 text-center border-r border-sky-500/50">Ngày sinh</th>
                <th className="px-3 py-3 text-center border-r border-sky-500/50 w-14">Tuổi</th>
                <th className="px-3 py-3 text-center border-r border-sky-500/50 w-16">Giới tính</th>
                <th className="px-3 py-3 border-r border-sky-500/50 min-w-[160px]">Bộ phận</th>
                <th className="px-3 py-3 text-center border-r border-sky-500/50">SĐT</th>
                <th className="px-3 py-3 border-r border-sky-500/50 min-w-[180px]">Tên C.ty</th>
                <th className="px-4 py-3 border-r border-sky-500/50 min-w-[220px]">Địa Chỉ</th>
                <th className="px-3 py-3 text-center min-w-[140px] bg-sky-700">Trạng Thái & Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-slate-400">
                    Không tìm thấy bản ghi nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => {
                  const isSameDobWarning = r.matchStatus === 'warning_same_dob';
                  const isDobMismatch = r.matchStatus === 'warning_dob_mismatch';
                  const isUnmatched = r.matchStatus === 'unmatched_bia';
                  const isAdjusted = r.matchStatus === 'manual_adjusted';

                  let rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40';
                  if (isSameDobWarning) rowBg = 'bg-amber-100/50 hover:bg-amber-100/80';
                  else if (isDobMismatch) rowBg = 'bg-amber-50/50 hover:bg-amber-100/50';
                  else if (isUnmatched) rowBg = 'bg-rose-50/40 hover:bg-rose-100/50';
                  else if (isAdjusted) rowBg = 'bg-sky-50/40 hover:bg-sky-100/50';
                  else rowBg += ' hover:bg-sky-50/30';

                  return (
                    <tr key={r.id} className={`${rowBg} transition-colors border-b border-slate-200`}>
                      {/* 1. STT */}
                      <td className="px-3 py-2.5 text-center font-bold text-slate-600 border-r border-slate-200">
                        {r.stt}
                      </td>

                      {/* 2. Mã BA */}
                      <td className="px-3 py-2.5 text-center font-mono font-bold text-sky-700 border-r border-slate-200">
                        {r.maBA || <span className="text-slate-300 italic">Trống</span>}
                      </td>

                      {/* 3. Mã BN */}
                      <td className="px-3 py-2.5 text-center font-mono font-bold text-indigo-700 border-r border-slate-200">
                        {r.maBN || <span className="text-slate-300 italic">Trống</span>}
                      </td>

                      {/* 4. Tên bệnh nhân */}
                      <td className="px-4 py-2.5 font-bold text-slate-900 border-r border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span>{r.tenBenhNhan}</span>
                          {(isSameDobWarning || isDobMismatch) && (
                            <span
                              title={r.warningNotes.join(' - ')}
                              className="inline-flex text-amber-600"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Ngày sinh */}
                      <td className="px-3 py-2.5 text-center text-slate-700 font-medium border-r border-slate-200">
                        {r.ngaySinh || '-'}
                      </td>

                      {/* 6. Tuổi */}
                      <td className="px-3 py-2.5 text-center font-semibold text-slate-800 border-r border-slate-200">
                        {r.tuoi || '-'}
                      </td>

                      {/* 7. Giới tính */}
                      <td className="px-3 py-2.5 text-center text-slate-700 border-r border-slate-200">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                            r.gioiTinh === 'Nam'
                              ? 'bg-blue-50 text-blue-700'
                              : r.gioiTinh === 'Nữ'
                              ? 'bg-rose-50 text-rose-700'
                              : 'text-slate-600'
                          }`}
                        >
                          {r.gioiTinh || '-'}
                        </span>
                      </td>

                      {/* 8. Bộ phận */}
                      <td className="px-3 py-2.5 text-slate-700 border-r border-slate-200 truncate max-w-[200px]" title={r.boPhan}>
                        {r.boPhan || '-'}
                      </td>

                      {/* 9. SĐT (Formatted with leading zero) */}
                      <td className="px-3 py-2.5 text-center font-mono font-semibold text-emerald-800 border-r border-slate-200">
                        {r.sdt ? (
                          <span className="flex items-center justify-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            {r.sdt}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* 10. Tên C.ty */}
                      <td className="px-3 py-2.5 text-slate-700 border-r border-slate-200 truncate max-w-[200px]" title={r.tenCty}>
                        {r.tenCty || '-'}
                      </td>

                      {/* 11. Địa Chỉ */}
                      <td className="px-4 py-2.5 text-slate-600 border-r border-slate-200 truncate max-w-[260px]" title={r.diaChi}>
                        {r.diaChi || '-'}
                      </td>

                      {/* Trạng thái & Thao tác */}
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {isSameDobWarning ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                              ⚠️ Cùng tên & ngày sinh
                            </span>
                          ) : isDobMismatch ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200" title={r.warningNotes.join('; ')}>
                              ⚠️ Lệch ngày sinh
                            </span>
                          ) : isUnmatched ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                              Chưa có trên HIS
                            </span>
                          ) : isAdjusted ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                              Đã chọn thủ công
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              ✓ Khớp chuẩn 1-1
                            </span>
                          )}

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => onOpenDisambiguate(r)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-800 hover:underline pt-0.5 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{isSameDobWarning || isDobMismatch ? 'Hiệu chỉnh' : 'Đổi hồ sơ'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
