import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '916364240496';
  const defaultMessage = encodeURIComponent(
    'Hi, I want to know more about English Platform Hazaribagh courses, fees, and batch timings.'
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-slate-950 text-emerald-500" />
      <span className="hidden sm:inline-block text-xs font-extrabold tracking-wide uppercase">
        Enquire on WhatsApp
      </span>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
      </span>
    </a>
  );
};
