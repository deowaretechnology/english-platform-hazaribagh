import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
  Users,
  Video,
  FileText,
  CheckCircle,
  Play,
  ArrowRight,
  Clock,
  ShieldCheck,
  Star,
  ChevronDown,
  BookOpen
} from 'lucide-react';

import {
  fetchCoursesFromSanity,
  fetchVideosFromSanity,
  fetchNotesFromSanity,
  fetchToppersFromSanity,
  fetchTestimonialsFromSanity,
  fetchGalleryFromSanity,
  fetchFAQsFromSanity,
  GalleryItem
} from '../lib/sanity/queries';

import { testimonialsData } from '../data/testimonials';
import { faqsData } from '../data/faqs';

import { VideoModal } from '../components/modals/VideoModal';
import { PdfModal } from '../components/modals/PdfModal';
import { LightboxModal } from '../components/modals/LightboxModal';
import { Course, Video as VideoType, Note as NoteType, Topper as TopperType, Testimonial, FAQItem } from '../types';

export const HomePage: React.FC = () => {
  // Live Sanity State
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [toppers, setToppers] = useState<TopperType[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Default Campus Gallery Data
  const defaultGallery: GalleryItem[] = [
    {
      id: 'gal-default-1',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      title: 'Modern Smart Classroom',
      caption: 'Air-conditioned smart audio-visual classrooms at Ananda Chowk campus.'
    },
    {
      id: 'gal-default-2',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      title: 'Interactive Group Discussions',
      caption: 'Spoken English students practicing real-world debate and extempore speaking.'
    },
    {
      id: 'gal-default-3',
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      title: 'Weekly OMR Examination Cell',
      caption: 'Strict examination setup simulating actual JAC & CBSE Board hall conditions.'
    },
    {
      id: 'gal-default-4',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      title: 'Faculty Doubt Desk',
      caption: '1-on-1 personal doubt clearing desk after regular batch hours.'
    },
    {
      id: 'gal-default-5',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      title: 'Annual Felicitation Ceremony',
      caption: 'Honoring top board scorers and government selection achievers.'
    },
    {
      id: 'gal-default-6',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      title: 'Digital Language Lab',
      caption: 'Phonetics and pronunciation audio station for fluency training.'
    }
  ];

  useEffect(() => {
    async function loadSanityData() {
      try {
        const [c, v, n, t, testm, gal, f] = await Promise.all([
          fetchCoursesFromSanity(),
          fetchVideosFromSanity(),
          fetchNotesFromSanity(),
          fetchToppersFromSanity(),
          fetchTestimonialsFromSanity(),
          fetchGalleryFromSanity(),
          fetchFAQsFromSanity()
        ]);
        setCourses(c);
        setVideos(v);
        setNotes(n);
        setToppers(t);
        setTestimonials(testm.length > 0 ? testm : testimonialsData);
        setGallery(gal.length > 0 ? gal : defaultGallery);
        setFaqs(f.length > 0 ? f : faqsData);
      } catch (err) {
        console.error('Error fetching data for HomePage:', err);
        setTestimonials(testimonialsData);
        setGallery(defaultGallery);
        setFaqs(faqsData);
      } finally {
        setLoading(false);
      }
    }
    loadSanityData();
  }, []);

  // Hero Slider State
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
      tag: 'Early Bird Offer — 20% Off This Month',
      title: 'Master Board English with Hazaribagh\'s Premier Coaching',
      subtitle: 'Small Step Every Day • Board Target & Spoken English Batches Starting Now'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
      tag: 'New Batch Starting 15th August',
      title: 'Class 10 & 12 JAC / CBSE Target Success Blueprint',
      subtitle: 'Line-by-Line NCERT Explanation • Weekly OMR Practice • Handwritten Notes'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1600&q=80',
      tag: 'Express Spoken Batch',
      title: 'Overcome Hesitation & Speak Fluent English Confidently',
      subtitle: 'Group Discussions • Accent Neutralization • Interview & Public Speaking Skills'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Modal States
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<{ url: string; title: string; caption: string } | null>(null);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Campus Gallery Data
  const campusGallery = [
    {
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      title: 'Modern Smart Classroom',
      caption: 'Air-conditioned smart audio-visual classrooms at Ananda Chowk campus.'
    },
    {
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      title: 'Interactive Group Discussions',
      caption: 'Spoken English students practicing real-world debate and extempore speaking.'
    },
    {
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      title: 'Weekly OMR Examination Cell',
      caption: 'Strict examination setup simulating actual JAC & CBSE Board hall conditions.'
    },
    {
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      title: 'Faculty Doubt Desk',
      caption: '1-on-1 personal doubt clearing desk after regular batch hours.'
    },
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      title: 'Annual Felicitation Ceremony',
      caption: 'Honoring top board scorers and government selection achievers.'
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      title: 'Digital Language Lab',
      caption: 'Phonetics and pronunciation audio station for fluency training.'
    }
  ];

  const featuredVideo = videos[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* ================= 1. HERO SECTION WITH SLIDER ================= */}
      <section className="relative w-full min-h-[540px] lg:min-h-[600px] bg-slate-900 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30"></div>
          </motion.div>
        </AnimatePresence>

        {/* Hero Content Layer */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-6">
            
            <motion.div
              key={`tag-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide backdrop-blur-md shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>{slides[currentSlide].tag}</span>
            </motion.div>

            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]"
            >
              English Platform <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-sky-200">
                Hazaribagh
              </span>
            </motion.h1>

            <motion.p
              key={`sub-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal max-w-xl"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
            >
              <Link
                to="/admission"
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-7 py-3.5 rounded-xl text-base shadow-lg shadow-blue-600/30 text-center transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/courses"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-xl text-base border border-white/20 backdrop-blur-md text-center transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Courses</span>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-blue-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>


      {/* ================= 2. STATS / TRUST BAR ================= */}
      <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="pt-4 sm:pt-0 sm:pl-0 space-y-1 text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">5+ Years</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">Faculty Excellence</div>
              <p className="text-xs text-slate-500">Trusted in Hazaribagh since 2014</p>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-6 space-y-1 text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">2500+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">Students Trained</div>
              <p className="text-xs text-slate-500">Across JAC, CBSE & Spoken Batches</p>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-6 space-y-1 text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">100%</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">Board Result Rate</div>
              <p className="text-xs text-slate-500">Consistent district toppers</p>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-6 space-y-1 text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">10+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">Govt Selections</div>
              <p className="text-xs text-slate-500">SSC, Railway & Defence exams</p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= 3. COURSES PREVIEW ================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Academic Programs
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Courses, Fees & Batch Timings
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Comprehensive curriculum tailored for Class 9 to 12 Board exams, Spoken English fluency, and competitive entrance preparation.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-xl group relative overflow-hidden"
            >
              {course.isPopular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                  Popular Choice
                </div>
              )}

              <div className="space-y-4">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Class {course.class} • {course.mode} Mode
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {course.subtitle}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">₹{course.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      Save ₹{course.originalPrice - course.price}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{course.batchTiming}</span>
                  </div>
                </div>

                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {course.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  to={`/admission?course=${encodeURIComponent(course.title)}`}
                  className="w-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                >
                  <span>Enroll in Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all hover:scale-105"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>


      {/* ================= 4. VIDEO LECTURES PREVIEW ================= */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Online Classroom
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Online Classes & Recorded Lectures
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              Access high-definition recorded lectures, grammar concept video breakdowns, and board strategy sessions anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Featured Video Embed */}
            {featuredVideo && (
              <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black group">
                  <iframe
                    src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}`}
                    title={featuredVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                      Featured Class {featuredVideo.class} Lecture
                    </span>
                    <span className="text-xs text-slate-400">• {featuredVideo.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{featuredVideo.title}</h3>
                  <p className="text-xs text-slate-300">{featuredVideo.notesSummary}</p>
                </div>
              </div>
            )}

            {/* Side Grid of Video Cards */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-200 border-b border-slate-800 pb-2">
                Recent Recorded Classes
              </h3>
              <div className="space-y-3">
                {videos.slice(0, 4).map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-blue-500 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="text-[10px] font-bold text-blue-400 uppercase">
                        Class {vid.class} • {vid.chapter}
                      </div>
                      <div className="text-xs font-bold text-white truncate group-hover:text-blue-300">
                        {vid.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{vid.duration}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/classes"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-600/20"
              >
                <span>View All Video Lectures</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* ================= 5. NOTES PREVIEW ================= */}
      <section className="py-16 sm:py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Study Material
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Study Notes & Materials
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              High-yield handwritten summary PDFs prepared exclusively by Verma Sir for quick board revision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {notes.slice(0, 4).map((note) => (
              <div
                key={note.id}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-50 text-blue-700 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded border border-blue-200">
                      Class {note.class}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">{note.fileSize}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {note.chapter}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedNote(note)}
                    className="w-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View / Download Notes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/classes?tab=notes"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-xs"
            >
              <span>View All Notes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* ================= 6. TOPPERS ================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Hall of Fame</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Proud Toppers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Real results created through hard work, small step daily discipline, and personalized faculty mentoring.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toppers.map((topper) => (
            <div
              key={topper.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400 shadow-sm">
                <img
                  src={topper.photoUrl}
                  alt={topper.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-0 inset-x-0 bg-amber-500 text-slate-950 font-black text-[9px] text-center uppercase py-0.5">
                  {topper.year}
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
                  {topper.classTag}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 truncate">
                  {topper.name}
                </h3>
                <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                  {topper.achievement}
                </div>
                <p className="text-xs text-slate-600 italic line-clamp-2 pt-1">
                  "{topper.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/admission"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all hover:scale-105"
          >
            <span>Join Our Success Stories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>


      {/* ================= 7. WHY CHOOSE US ================= */}
      <section className="py-16 sm:py-20 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Why English Platform
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Preferred Choice of Toppers & Aspirants
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Disciplined academic environment combined with modern visual learning techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '5+ Years Combined Faculty Experience',
                desc: 'Taught by Er. R.K. Verma & senior subject experts with deep insight into JAC & CBSE marking schemes.',
                icon: Award
              },
              {
                title: 'Weekly OMR & Subjective Tests',
                desc: 'Every Sunday exam simulation with instant evaluation, SMS alerts to parents, and rank publishing.',
                icon: CheckCircle
              },
              {
                title: 'Small Batch Size & Personal Care',
                desc: 'Limited students per batch ensuring every student gets individual attention and speaking practice.',
                icon: Users
              },
              {
                title: 'Handwritten Notes & Workbook',
                desc: 'No need for extra guidebooks! Complete chapter summaries, formula sheets, and solved previous papers included.',
                icon: FileText
              },
              {
                title: 'Audio-Visual Language Lab',
                desc: 'Dedicated phonetics, group discussion, and accent lab for Spoken English fluency development.',
                icon: Video
              },
              {
                title: 'Dedicated Daily Doubt Desk',
                desc: '1-on-1 doubt clearance desk operating after regular batch hours to ensure zero confusion.',
                icon: ShieldCheck
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-blue-300 transition-all duration-300 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ================= 8. LIFE AT CAMPUS (GALLERY) ================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Campus Tour
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Life at English Platform
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Glimpse into our modern smart classrooms, group discussions, and student felicitations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {gallery.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setSelectedGalleryImage(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-slate-200 hover:border-blue-500 transition-all duration-300 shadow-xs"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-left">
                <span className="text-xs font-bold text-white line-clamp-1">{item.title}</span>
                <span className="text-[10px] text-slate-200 line-clamp-1">{item.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ================= 9. TESTIMONIALS ================= */}
      <section className="py-16 sm:py-20 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What Our Students Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-blue-200"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-blue-600 font-semibold">{item.roleOrClass}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================= 10. FAQ ================= */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Common Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about joining English Platform Hazaribagh.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-colors shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* Active Modals */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      <PdfModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      <LightboxModal image={selectedGalleryImage} onClose={() => setSelectedGalleryImage(null)} />

    </div>
  );
};
