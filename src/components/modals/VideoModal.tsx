import React from 'react';
import { X, Play, BookOpen, Download, Share2, Eye, Clock } from 'lucide-react';
import { Video } from '../../types';
import { downloadChapterPdf } from '../../utils/pdfgenerator';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-md text-xs uppercase border border-blue-200">
              Class {video.class} Lecture
            </span>
            <span className="text-slate-500 text-xs hidden sm:inline">• {video.duration}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black w-full">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Info */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-snug">
              {video.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                {video.chapter}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                {video.views} views
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {video.uploadDate}
              </span>
            </div>
          </div>

          {/* Lecture Notes & Key Takeaways */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-blue-600 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Lecture Summary & Key Concepts
              </h3>
              <button
                onClick={() => downloadChapterPdf(video.chapter || video.title, video.notesSummary || '')}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1.5 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Chapter PDF
              </button>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">
              {video.notesSummary}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Lecture link copied to clipboard!');
              }}
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Lecture
            </button>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors"
            >
              Close Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};