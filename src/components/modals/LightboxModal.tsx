import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface LightboxModalProps {
  image: { url: string; title: string; caption: string } | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white border border-slate-200 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl text-slate-900 cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white transition-colors border border-slate-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[70vh] bg-slate-100 flex items-center justify-center overflow-hidden">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-contain max-h-[70vh]"
          />
        </div>

        <div className="p-5 border-t border-slate-200 space-y-1 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-900">{image.title}</h3>
          <p className="text-slate-600 text-sm">{image.caption}</p>
        </div>
      </div>
    </div>
  );
};
