import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Send, MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { fetchCoursesFromSanity } from '../lib/sanity/queries';
import { Course } from '../types';

export const AdmissionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledCourse = searchParams.get('course') || '';

  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    targetClass: prefilledCourse ? prefilledCourse : 'Class 10 JAC & CBSE English Mastery',
    batchTiming: 'Morning (07:00 AM - 08:30 AM)',
    mode: 'Offline Campus',
    schoolName: '',
    address: ''
  });

  useEffect(() => {
    fetchCoursesFromSanity().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setCourses(fetched);
        if (!prefilledCourse) {
          setFormData((prev) => ({ ...prev, targetClass: fetched[0].title }));
        }
      }
    }).catch(console.error);
  }, [prefilledCourse]);

  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Please fill in your Full Name and Phone Number.');
      return;
    }
    const appId = 'EPH-2026-' + Math.floor(1000 + Math.random() * 9000);
    setSubmittedAppId(appId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Online Admission Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Apply Online for 2026 Batches
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Reserve your seat for 3 days free demo classes. No upfront payment required to apply!
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Application Form or Success Sheet */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {!submittedAppId ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Student Admission Registration Form</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Aman Kumar Verma"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit Mobile Number"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="Same as mobile or WhatsApp"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Target Course / Class *
                  </label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                  >
                    {courses.length > 0 ? (
                      courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Class 10 JAC & CBSE English Mastery">Class 10 JAC & CBSE English Mastery</option>
                        <option value="Class 12 JAC & CBSE Core English Target Batch">Class 12 JAC & CBSE Core English Target Batch</option>
                        <option value="Class 11 Academic & Competitive Foundation">Class 11 Academic & Competitive Foundation</option>
                        <option value="Class 9 Strong Base English Foundation">Class 9 Strong Base English Foundation</option>
                        <option value="Fluent Spoken English & Personality Development">Fluent Spoken English & Personality Development</option>
                        <option value="SSC CGL, CHSL, Railway & NDA English Masterclass">SSC CGL, CHSL, Railway & NDA English Masterclass</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Batch Time
                    </label>
                    <select
                      value={formData.batchTiming}
                      onChange={(e) => setFormData({ ...formData, batchTiming: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                    >
                      <option value="Morning (07:00 AM - 08:30 AM)">Morning (07:00 AM - 08:30 AM)</option>
                      <option value="Late Morning (10:00 AM - 11:30 AM)">Late Morning (10:00 AM - 11:30 AM)</option>
                      <option value="Afternoon (02:00 PM - 03:30 PM)">Afternoon (02:00 PM - 03:30 PM)</option>
                      <option value="Evening (05:30 PM - 07:00 PM)">Evening (05:30 PM - 07:00 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Learning Mode
                    </label>
                    <select
                      value={formData.mode}
                      onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                    >
                      <option value="Offline Campus">Offline Campus (Ananda Chowk)</option>
                      <option value="Online Portal Recording">Online Recorded & Live</option>
                      <option value="Hybrid (Offline + Online)">Hybrid (Offline + Online)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    School / College Name
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="e.g. Zila School / DAV Public School Hazaribagh"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application & Register for Demo Class</span>
                </button>
              </div>
            </form>
          ) : (
            /* Success Receipt View */
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                  APPLICATION ID: {submittedAppId}
                </span>
                <h2 className="text-2xl font-black text-slate-900">Application Received!</h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Dear <strong className="text-slate-900">{formData.fullName}</strong>, your seat for 3 days free demo classes in <strong className="text-blue-600">{formData.targetClass}</strong> has been provisionally reserved.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 text-slate-700">
                <div className="font-bold text-blue-600 border-b border-slate-200 pb-2">Next Steps for Demo Class:</div>
                <p>1. Please visit campus at <strong>Ananda Chowk, Hazaribagh</strong> during your chosen batch time ({formData.batchTiming}).</p>
                <p>2. Show your Application ID <strong>{submittedAppId}</strong> at the reception desk to receive your demo pass & handwritten workbook.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/916364240496?text=${encodeURIComponent(
                    `Hi, I submitted online admission form on website for ${formData.fullName} (Application ID: ${submittedAppId}). Please confirm my demo class timing.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Confirm Application on WhatsApp</span>
                </a>
                <button
                  onClick={() => setSubmittedAppId(null)}
                  className="w-full sm:w-auto bg-slate-100 text-slate-700 font-semibold px-5 py-3 rounded-xl text-xs hover:bg-slate-200 border border-slate-200"
                >
                  Submit Another Form
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Campus Info & Map */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-200 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Campus Location & Helpline</span>
            </h3>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                <div>
                  <strong className="block text-slate-900 font-semibold">Address:</strong>
                  babughat Chowk opposite Shiv Mandir second floor, Hazaribagh, Jharkhand - 825301
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                <div>
                  <strong className="block text-slate-900 font-semibold">Admission Helpline:</strong>
                  +91 6364240496 
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                <div>
                  <strong className="block text-slate-900 font-semibold">Class Hours:</strong>
                  Monday – Saturday: 6:00 AM – 7:30 PM <br />
                  Sunday: 8:00 AM – 1:00 PM (Weekly Test)
                </div>
              </li>
            </ul>
          </div>

          {/* Interactive Map Visual */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-2 shadow-xs">
            <div className="bg-slate-100 aspect-video rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-200">
              <iframe
                title="Hazaribagh Campus Location Map"
                src="https://maps.google.com/maps?q=Hazaribagh+Jharkhand&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 transition-all duration-300"
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
