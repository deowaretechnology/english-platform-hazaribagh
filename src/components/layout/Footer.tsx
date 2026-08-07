import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Clock, Facebook, Youtube, Instagram, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Institute Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                ENGLISH PLATFORM
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Hazaribagh’s leading English language & literature coaching institute for Class 9th, 10th, 11th, 12th Board examinations, Spoken English, and Competitive exams.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://www.facebook.com/share/1C8v2uWkjL/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@apnaenglishplatform"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/english_platform_hazaribag?igsh=Z2duYWF0YmdqeXE1"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/6364240496"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                aria-label="WhatsApp Channel"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-bold text-white text-base mb-4 tracking-wide text-blue-400">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-blue-400 transition-colors">
                  Courses & Fee Structure
                </Link>
              </li>
              <li>
                <Link to="/classes" className="hover:text-blue-400 transition-colors">
                  Classes & Notes
                </Link>
              </li>
              <li>
                <Link to="/tests" className="hover:text-blue-400 transition-colors">
                  Online OMR Test Series
                </Link>
              </li>
              <li>
                <Link to="/admission" className="hover:text-blue-400 transition-colors">
                  Apply for Admission
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Student Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Batches */}
          <div>
            <h3 className="font-bold text-white text-base mb-4 tracking-wide text-blue-400">
              Target Batches
            </h3>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link to="/courses?class=10" className="hover:text-blue-400 transition-colors">
                  Class 10 JAC & CBSE Board
                </Link>
              </li>
              <li>
                <Link to="/courses?class=12" className="hover:text-blue-400 transition-colors">
                  Class 12 JAC & CBSE Board
                </Link>
              </li>
              <li>
                <Link to="/courses?class=11" className="hover:text-blue-400 transition-colors">
                  Class 11 Foundation Batch
                </Link>
              </li>
              <li>
                <Link to="/courses?class=9" className="hover:text-blue-400 transition-colors">
                  Class 9 English Grammar
                </Link>
              </li>
              <li>
                <Link to="/courses?class=spoken-english" className="hover:text-blue-400 transition-colors">
                  Spoken English Express
                </Link>
              </li>
              <li>
                <Link to="/courses?class=competitive" className="hover:text-blue-400 transition-colors">
                  SSC / Railway / NDA Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div>
            <h3 className="font-bold text-white text-base mb-4 tracking-wide text-blue-400">
              Campus Info
            </h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span>Opposite Shiv Mandir, Babugaon Chowk, Hazaribagh, Jharkhand - 825301</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-blue-400">
                  +91 6364240496 
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:info@englishplatformhzb.com" className="hover:text-blue-400">
                  englishplatformhazaribag@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Mon – Sat: 6:00 AM – 7:30 PM</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} English Platform Hazaribagh. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Designed By</span>
            <span>•</span>
            <span className="text-slate-400">Deoware Technology</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
