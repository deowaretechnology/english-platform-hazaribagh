import React from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Note } from '../../types';
import { downloadNotePdf } from '../../utils/pdfgenerator';

interface PdfModalProps {
  note: Note | null;
  onClose: () => void;
}

export const PdfModal: React.FC<PdfModalProps> = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Class {note.class} • {note.subject}
              </span>
              <h2 className="text-lg font-bold text-slate-900 line-clamp-1">{note.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / PDF Simulated Sheet */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 bg-blue-600 text-white font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-widest">
              Verified Handwritten PDF
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Prepared by Senior Hazaribagh Faculty</span>
                <span>•</span>
                <span>{note.pages} Pages</span>
                <span>•</span>
                <span>{note.fileSize}</span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">
                {note.chapter}
              </h3>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">
                  Highlights Included in this Document:
                </h4>
                <ul className="space-y-2">
                  {note.previewHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Page Preview Canvas */}
            <div className="mt-6 pt-6 border-t border-slate-200 bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <div className="text-xs font-mono text-slate-500">
                PDF PREVIEW CANVAS {note.pdfUrl ? '(Uploaded File Preview)' : `[Page 1 of ${note.pages}]`}
              </div>
              {note.pdfUrl && note.pdfUrl !== '#' && note.pdfUrl.startsWith('http') ? (
                <iframe
                  src={note.pdfUrl}
                  className="w-full h-72 rounded-lg border border-slate-200"
                  title={note.title}
                />
              ) : (
                <div className="bg-slate-50 text-slate-800 p-4 rounded text-left font-serif text-xs leading-relaxed max-h-40 overflow-hidden border border-slate-200 relative">
                  <div className="font-bold text-blue-700 text-sm mb-1">{note.title} - CHAPTER OVERVIEW</div>
                  <p>1. Key Definition: English Literature & Grammar patterns for Board Examination 2026.</p>
                  <p className="mt-1">2. Core Formulas: Active to Passive Voice step-by-step conversion rules with practice examples...</p>
                  <p className="mt-1">3. Direct to Indirect Speech rules for statements, questions, imperative, and exclamatory sentences...</p>
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50 to-transparent flex items-end justify-center pb-2 text-[10px] text-blue-700 font-sans font-bold">
                    [ Full {note.pages}-page document available upon download ]
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Download Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500">
              Free study material provided by <strong className="text-slate-800">English Platform Hazaribagh</strong>.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  downloadNotePdf(note);
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Notes</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};