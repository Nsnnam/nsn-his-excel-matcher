import React from 'react';
import { Layers, Coffee, BookOpen, Lock, ShieldCheck } from 'lucide-react';
import { APP_META } from '../constants/meta';

interface NavbarProps {
  onOpenGuide: () => void;
  onOpenAbout: () => void;
  onLockApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGuide, onOpenAbout, onLockApp }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  {APP_META.name}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  v{APP_META.version}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                  Offline 100%
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Ghép dữ liệu khám sức khỏe VNPT-HIS & Danh sách Bìa sang File Mẫu Chuẩn NSN
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:text-sky-700 hover:bg-sky-50 border border-slate-200 transition-colors cursor-pointer"
              title="Hướng dẫn sử dụng"
            >
              <BookOpen className="w-4 h-4 sm:mr-1.5 text-sky-600" />
              <span className="hidden sm:inline">Hướng dẫn</span>
            </button>

            <button
              onClick={onOpenAbout}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg text-amber-800 bg-amber-50/70 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
              title="Tác giả & Mời cà phê"
            >
              <Coffee className="w-4 h-4 sm:mr-1.5 text-amber-600" />
              <span className="hidden sm:inline">Tác giả & Cà phê</span>
            </button>

            <button
              onClick={onLockApp}
              className="inline-flex items-center p-2 sm:px-3 sm:py-2 text-xs font-medium rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Khóa bảo mật ứng dụng"
            >
              <Lock className="w-4 h-4 sm:mr-1.5 text-slate-500" />
              <span className="hidden sm:inline">Khóa app</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
