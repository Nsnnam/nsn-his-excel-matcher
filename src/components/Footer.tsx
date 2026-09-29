import React from 'react';
import { Heart, Coffee, ExternalLink } from 'lucide-react';
import { APP_META } from '../constants/meta';

interface FooterProps {
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAbout }) => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-semibold text-slate-700">{APP_META.name}</span> · Phiên bản{' '}
          <span className="font-mono text-slate-800">v{APP_META.version}</span> ({APP_META.releaseDate})
          <div className="text-[11px] text-slate-400 mt-0.5">
            Tác giả: <strong className="text-slate-600">{APP_META.author.name}</strong> ({APP_META.author.alias}) · Múi giờ: GMT+7 ({APP_META.timezone})
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAbout}
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
