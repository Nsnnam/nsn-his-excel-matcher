import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, UserX, Users, Info } from 'lucide-react';
import { ProcessingSummary, MatchStatus } from '../types';

interface DuplicateWarningBannerProps {
  summary: ProcessingSummary;
  activeFilter: 'all' | 'warning' | 'exact' | 'unmatched_bia' | 'unmatched_his';
  onFilterChange: (filter: 'all' | 'warning' | 'exact' | 'unmatched_bia' | 'unmatched_his') => void;
}

export const DuplicateWarningBanner: React.FC<DuplicateWarningBannerProps> = ({
  summary,
  activeFilter,
  onFilterChange,
}) => {
  const totalWarnings = summary.warningResolvedCount + summary.warningConflictCount;

  return (
    <div className="space-y-4">
      {/* Alert Banner for Duplicate / Warning Cases */}
      {totalWarnings > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs animate-in fade-in">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 bg-amber-200/60 rounded-xl text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <span>CẢNH BÁO: Phát hiện {totalWarnings} trường hợp trùng họ tên & giới tính!</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-200 text-amber-900 border border-amber-300">
                  Cần kiểm tra
                </span>
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Hệ thống đã tự động đối soát cấp 2 dựa vào <strong>Ngày sinh / CCCD / SĐT</strong> để ghép đúng hồ sơ. 
                Vui lòng kiểm tra lại cột <strong>Mã BA, Mã BN và Ngày sinh</strong> đối với các dòng có huy hiệu cảnh báo màu vàng/cam bên dưới để hiệu chỉnh nếu cần.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => onFilterChange('warning')}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  Xem ngay {totalWarnings} trường hợp trùng tên
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards & Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Tab 1: All */}
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-400/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng DS Bìa</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            {summary.totalBia}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tất cả bản ghi</div>
        </button>

        {/* Tab 2: Exact Single */}
        <button
          type="button"
          onClick={() => onFilterChange('exact')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'exact'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Khớp chuẩn 1-1</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">
            {summary.exactSingleCount}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Duy nhất, không trùng</div>
        </button>

        {/* Tab 3: Warning Duplicates */}
        <button
          type="button"
          onClick={() => onFilterChange('warning')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'warning'
              ? 'bg-amber-100/70 border-amber-500 ring-2 ring-amber-400/30'
              : totalWarnings > 0
              ? 'bg-amber-50/60 border-amber-300 hover:bg-amber-100/50'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">⚠️ Trùng tên/tuổi</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-900 mt-1">
            {totalWarnings}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Cùng họ tên & giới tính</div>
        </button>

        {/* Tab 4: Unmatched Bia */}
        <button
          type="button"
          onClick={() => onFilterChange('unmatched_bia')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'unmatched_bia'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Chưa có trên HIS</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-extrabold text-rose-800 mt-1">
            {summary.unmatchedBiaCount}
          </div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">Chỉ có trong Bìa</div>
        </button>

        {/* Tab 5: Unmatched HIS */}
        <button
          type="button"
          onClick={() => onFilterChange('unmatched_his')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'unmatched_his'
              ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700">Thừa trên HIS</span>
            <Info className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-indigo-800 mt-1">
            {summary.unmatchedHisCount}
          </div>
          <div className="text-[11px] text-indigo-600/80 mt-0.5">Không có trong Bìa</div>
        </button>
      </div>
    </div>
  );
};
