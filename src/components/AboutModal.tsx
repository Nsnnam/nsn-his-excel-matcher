import React, { useState } from 'react';
import { X, Coffee, Check, Copy, ExternalLink, ShieldCheck, History, Info, Sparkles } from 'lucide-react';
import { APP_META } from '../constants/meta';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [modalTab, setModalTab] = useState<'coffee' | 'history' | 'about'>('coffee');

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{APP_META.name}</h3>
              <p className="text-xs text-sky-100">Phiên bản v{APP_META.version} · Chuẩn NSN App Standard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setModalTab('coffee')}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              modalTab === 'coffee'
                ? 'border-amber-500 text-amber-700 bg-white rounded-t-lg border-t border-x border-b-white -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Coffee className="w-4 h-4 text-amber-500" />
            <span>Mời cà phê tác giả</span>
          </button>

          <button
            onClick={() => setModalTab('history')}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              modalTab === 'history'
                ? 'border-sky-500 text-sky-700 bg-white rounded-t-lg border-t border-x border-b-white -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-4 h-4 text-sky-600" />
            <span>Lịch sử phiên bản</span>
          </button>

          <button
            onClick={() => setModalTab('about')}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              modalTab === 'about'
                ? 'border-sky-500 text-sky-700 bg-white rounded-t-lg border-t border-x border-b-white -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Info className="w-4 h-4 text-sky-600" />
            <span>Về ứng dụng</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {modalTab === 'coffee' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-4">
                  Nếu công cụ giúp bạn tiết kiệm thời gian ghép và xuất file KSK, hãy mời tác giả một ly cà phê nhé! ☕
                </p>
                <div className="inline-block p-2 bg-white rounded-xl border border-slate-200 shadow-md">
                  <img
                    src="coffee-qr.jpg"
                    alt="VietQR BIDV 8855989777 - NGUYEN SON NAM"
                    className="w-52 h-52 object-contain mx-auto rounded-lg"
                    onError={(e) => {
                      (e.target as any).style.display = 'none';
                    }}
                  />
                  <div className="text-[11px] text-slate-500 mt-1">Quét mã VietQR chuyển khoản nhanh</div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-sm space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Ngân hàng:</span>
                  <span className="font-semibold text-slate-800">{APP_META.coffee.bank} — {APP_META.coffee.branch}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Chủ tài khoản:</span>
                  <span className="font-semibold text-slate-800">{APP_META.coffee.accountName}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-xs text-slate-600 font-medium">Số tài khoản BIDV:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sky-700 text-base">
                      {APP_META.coffee.accountNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(APP_META.coffee.accountNumber)}
                      className="p-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-600 text-xs flex items-center space-x-1 cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 italic">
                Cảm ơn bạn đã luôn tin tưởng và sử dụng các công cụ trong hệ sinh thái NSN!
              </div>
            </div>
          )}

          {modalTab === 'history' && (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {APP_META.changelog.map((log) => (
                <div key={log.version} className="border-l-2 border-sky-500 pl-4 py-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Phiên bản {log.version}</span>
                    <span className="text-xs text-slate-400">{log.date}</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {log.features.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {modalTab === 'about' && (
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  <strong>An toàn & Bảo mật 100%:</strong> Toàn bộ dữ liệu xử lý trên máy khách (client-side), không truyền file hay thông tin bệnh nhân lên internet.
                </span>
              </div>

              <p className="text-xs leading-relaxed">
                Ứng dụng hỗ trợ ghép tự động thông tin tiếp nhận từ VNPT-HIS với danh sách đăng ký hồ sơ KSK của công ty (Sheet Bìa), xử lý chuẩn hóa dữ liệu, đối soát ngày sinh khi trùng tên tuổi và xuất File Mẫu Chuẩn NSN với định dạng General Text chống nuốt số 0.
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div><strong>Tác giả:</strong> {APP_META.author.name} ({APP_META.author.alias})</div>
                <div><strong>Zalo:</strong> {APP_META.author.zalo}</div>
                <div><strong>GitHub:</strong> <a href={APP_META.author.github} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{APP_META.author.github}</a></div>
                <div><strong>Múi giờ:</strong> GMT+7 ({APP_META.timezone})</div>
                <div><strong>Quy chuẩn:</strong> NSN App Standard (Exact-Match, Clear Import, General Text)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
