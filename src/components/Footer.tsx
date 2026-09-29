import React from 'react';
import { Coffee, ExternalLink, BookOpen, History } from 'lucide-react';
import { APP_META } from '../constants/meta';

interface FooterProps {
  onOpenGuide: () => void;
  onOpenAbout: (tab?: 'coffee' | 'history' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuide, onOpenAbout }) => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-semibold text-slate-700">{APP_META.name}</span> ·{' '}
          <button
            type="button"
            onClick={() => onOpenAbout('history')}
            className="font-mono text-sky-700 hover:text-sky-900 font-bold hover:underline cursor-pointer"
            title="Xem Lịch sử phiên bản"
          >
            v{APP_META.version}
          </button>{' '}
          ({APP_META.releaseDate})
          <div className="text-[11px] text-slate-400 mt-0.5">
            Tác giả: <strong className="text-slate-600">{APP_META.author.name}</strong> ({APP_META.author.alias}) · Múi giờ: GMT+7 ({APP_META.timezone})
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <button
            type="button"
            onClick={onOpenGuide}
            className="inline-flex items-center text-slate-600 hover:text-sky-700 font-medium cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1 text-sky-600" />
            <span>Hướng dẫn</span>
          </button>

          <span className="text-slate-300">|</span>

          <button
            type="button"
            onClick={() => onOpenAbout('history')}
            className="inline-flex items-center text-slate-600 hover:text-sky-700 font-medium cursor-pointer"
          >
            <History className="w-3.5 h-3.5 mr-1 text-sky-600" />
            <span>Lịch sử phiên bản</span>
          </button>

          <span className="text-slate-300">|</span>

          <button
            type="button"
            onClick={() => onOpenAbout('coffee')}
            className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium cursor-pointer"
          >
            <Coffee className="w-3.5 h-3.5 mr-1 text-amber-600" />
            <span>Mời cà phê</span>
          </button>

          <span className="text-slate-300">|</span>

          <a
            href={APP_META.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sky-600 hover:text-sky-800 font-medium"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    </footer>
  );
};
