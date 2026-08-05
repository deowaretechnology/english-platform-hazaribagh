import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, FileText, Video as VideoIcon, Search, Download, ExternalLink, Link as LinkIcon, Eye } from 'lucide-react';

import {
  fetchVideosFromSanity,
  fetchNotesFromSanity,
  fetchResourceLinksFromSanity,
  ResourceLink
} from '../lib/sanity/queries';

import { ClassFilter } from '../components/ui/ClassFilter';
import { VideoModal } from '../components/modals/VideoModal';
import { PdfModal } from '../components/modals/PdfModal';
import { ClassLevel, Video, Note } from '../types';

export const ClassesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'notes' ? 'notes' : 'all';

  const [videos, setVideos] = useState<Video[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [resourceLinks, setResourceLinks] = useState<ResourceLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedClass, setSelectedClass] = useState<ClassLevel>('all');
  const [contentType, setContentType] = useState<'all' | 'videos' | 'notes'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [v, n, r] = await Promise.all([
          fetchVideosFromSanity(),
          fetchNotesFromSanity(),
          fetchResourceLinksFromSanity()
        ]);
        setVideos(v);
        setNotes(n);
        setResourceLinks(r);
      } catch (err) {
        console.error('Error loading classes data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered lists
  const filteredVideos = videos.filter((v) => {
    const matchesClass = selectedClass === 'all' || v.class === selectedClass;
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const filteredNotes = notes.filter((n) => {
    const matchesClass = selectedClass === 'all' || n.class === selectedClass;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const filteredLinks = resourceLinks.filter((r) => {
    const matchesClass = selectedClass === 'all' || r.classLevel === selectedClass || r.classLevel === 'all';
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const showVideos = contentType === 'all' || contentType === 'videos';
  const showNotes = contentType === 'all' || contentType === 'notes';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Digital Library
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Video Lectures & Study Material
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Access recorded classroom lectures, chapterwise NCERT breakdowns, handwritten PDF notes, and board resource links.
        </p>
      </div>

      {/* Control Bars Container */}
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Class Filter */}
        <ClassFilter selectedClass={selectedClass} onSelectClass={setSelectedClass} showAllOptions={false} />

        {/* Content Type Toggle: Videos | Notes/Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-xs">
          
          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setContentType('all')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                contentType === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              All Materials ({videos.length + notes.length})
            </button>
            <button
              onClick={() => setContentType('videos')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                contentType === 'videos' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Video Lectures ({videos.length})</span>
            </button>
            <button
              onClick={() => setContentType('notes')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                contentType === 'notes' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes & Links ({notes.length + resourceLinks.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures or notes..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

        </div>

      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto space-y-12">
        
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-medium">
            Fetching study materials from Sanity CMS...
          </div>
        ) : (
          <>
            {/* Videos Section */}
            {showVideos && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <VideoIcon className="w-5 h-5 text-blue-600" />
                    <span>Recorded Video Lectures ({filteredVideos.length})</span>
                  </h2>
                </div>

                {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-xl"
                      >
                        <div className="relative aspect-video bg-black overflow-hidden">
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                            {video.duration}
                          </div>
                        </div>

                        <div className="p-5 space-y-2">
                          <div className="flex items-center justify-between text-xs text-blue-600 font-bold uppercase">
                            <span>Class {video.class}</span>
                            <span className="text-slate-400 text-[10px] lowercase flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {video.views}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {video.chapter}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">No video lectures match the selected criteria.</p>
                )}
              </div>
            )}

            {/* Notes & Links Section */}
            {showNotes && (
              <div className="space-y-8 pt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Handwritten Chapter Notes ({filteredNotes.length})</span>
                    </h2>
                  </div>

                  {filteredNotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="bg-blue-50 text-blue-700 font-bold text-xs uppercase px-2.5 py-0.5 rounded border border-blue-200">
                                Class {note.class} • {note.subject}
                              </span>
                              <span className="text-xs font-mono text-slate-400">{note.fileSize}</span>
                            </div>

                            <h3 className="font-bold text-lg text-slate-900">
                              {note.title}
                            </h3>

                            <p className="text-xs text-slate-500">
                              {note.chapter}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                            <button
                              onClick={() => setSelectedNote(note)}
                              className="w-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200"
                            >
                              <FileText className="w-4 h-4" />
                              <span>View PDF Notes ({note.pages} Pages)</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">No study notes match the selected criteria.</p>
                  )}
                </div>

                {/* Resource Links Block */}
                {filteredLinks.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-blue-600" />
                      <span>Official Board Links & External Resources</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {filteredLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-4 flex items-center justify-between gap-3 group transition-all shadow-2xs hover:shadow-sm"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] font-bold text-blue-600 uppercase">
                              Class {link.classLevel}
                            </span>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                              {link.title}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>

      {/* Active Modals */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      <PdfModal note={selectedNote} onClose={() => setSelectedNote(null)} />

    </div>
  );
};
