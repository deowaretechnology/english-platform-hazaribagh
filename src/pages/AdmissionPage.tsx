import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Send, MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, MessageCircle, Copy, Check, QrCode, Landmark, Wallet, ScanLine, ArrowLeft } from 'lucide-react';
import { fetchCoursesFromSanity } from '../lib/sanity/queries';
import { Course } from '../types';
import qrImage from '../assets/qr.png';

type Step = 'form' | 'payment' | 'success';

export const AdmissionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledCourse = searchParams.get('course') || '';

  const [courses, setCourses] = useState<Course[]>([]);
  const [step, setStep] = useState<Step>('form');
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

  const [paymentMethod, setPaymentMethod] = useState('Direct Bank Transfer (SBI Account)');
  const [transactionId, setTransactionId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Please fill in your Full Name and Phone Number.');
      return;
    }
    const appId = 'EPH-2026-' + Math.floor(1000 + Math.random() * 9000);
    setSubmittedAppId(appId);
    setStep('payment');
  };

  const handlePaymentContinue = () => {
    setStep('success');
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  // Builds a complete, formatted WhatsApp message with every field (admission + payment)
  const buildWhatsAppMessage = (appId: string) => {
    const lines = [
      `Hi, I submitted the online admission form on the website. Please confirm my demo class timing.`,
      ``,
      `*Application ID:* ${appId}`,
      `*Student Name:* ${formData.fullName}`,
      `*Phone Number:* ${formData.phone}`,
      `*WhatsApp Number:* ${formData.whatsapp ? formData.whatsapp : formData.phone}`,
      `*Target Course/Class:* ${formData.targetClass}`,
      `*Preferred Batch Timing:* ${formData.batchTiming}`,
      `*Learning Mode:* ${formData.mode}`,
      `*School/College Name:* ${formData.schoolName ? formData.schoolName : 'Not provided'}`,
      ``,
      `*Payment Method:* ${paymentMethod}`,
      `*Transaction ID / UTR:* ${transactionId ? transactionId : 'Not provided (Cash / To be shared)'}`,
      ``,
      `I am also sharing my payment screenshot here for confirmation.`,
    ];
    return lines.join('\n');
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

        {/* Left Side: Form / Payment / Success */}
        <div className={`lg:col-span-7 rounded-2xl shadow-xs ${step === 'payment' ? 'bg-[#0b1220] border border-[#1e2a3d] p-6 sm:p-8' : 'bg-white border border-slate-200 p-6 sm:p-8'}`}>

          {/* STEP 1: FORM */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-5">
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
                  <span>Continue to Payment</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-6 text-slate-200">
              <button
                onClick={() => setStep('form')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-yellow-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to form</span>
              </button>

              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-yellow-400" />
                  <span>Complete Your Admission Payment</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Application ID <span className="text-yellow-400 font-mono font-bold">{submittedAppId}</span> generated for <strong className="text-white">{formData.fullName}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1.5">
                    Select Payment Method *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#0f1826] border border-yellow-500/60 focus:border-yellow-400 rounded-xl px-4 py-3 text-sm text-yellow-300 font-semibold focus:outline-none"
                  >
                    <option value="Online UPI (PhonePe / Google Pay / Paytm)">Online UPI (PhonePe / Google Pay / Paytm)</option>
                    <option value="QR Code Scanner (Instant Scan)">QR Code Scanner (Instant Scan)</option>
                    <option value="Direct Bank Transfer (SBI Account)">Direct Bank Transfer (SBI Account)</option>
                    <option value="Pay Cash at Institute Counter">Pay Cash at Institute Counter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Enter Payment Transaction ID / UTR No. <span className="text-slate-500 normal-case font-normal">(If paid online)</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 420918239012 or PhonePe Ref No."
                    className="w-full bg-[#0f1826] border border-slate-700 focus:border-yellow-400 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment details panel - changes based on method */}
              {(paymentMethod === 'Online UPI (PhonePe / Google Pay / Paytm)' || paymentMethod === 'QR Code Scanner (Instant Scan)') && (
                <div className="bg-[#0f1826] border border-yellow-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="bg-white p-2 rounded-xl shrink-0">
                      <img src={qrImage} alt="Scan to Pay QR" className="w-32 h-32 object-contain" />
                    </div>
                    <div className="flex-1 w-full space-y-3">
                      <div className="flex items-center justify-between bg-[#0b1220] border border-slate-700 rounded-xl px-4 py-2.5">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">UPI ID</p>
                          <p className="text-sm font-bold text-yellow-300">6364240496@ybl</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard('6364240496@ybl', 'upi')}
                          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg"
                        >
                          {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'upi' ? 'Copied' : 'Copy UPI ID'}</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-[#0b1220] border border-slate-700 rounded-xl px-4 py-2.5">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">PhonePe / GPay / Paytm</p>
                          <p className="text-sm font-bold text-white">6364240496 <span className="text-slate-400 font-normal">(R.K. Yadav Sir)</span></p>
                        </div>
                        <button
                          onClick={() => copyToClipboard('6364240496', 'phone')}
                          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg"
                        >
                          {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'phone' ? 'Copied' : 'Copy Number'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-yellow-400 font-bold text-sm">Scan to Pay ₹2500/-</p>
                  <p className="flex items-start gap-1.5 text-[11px] text-slate-400">
                    <span>⚡</span>
                    <span>After paying on PhonePe, Google Pay, or Paytm, enter the 12-digit UTR / Transaction ID above for instant fee receipt generation.</span>
                  </p>
                </div>
              )}

              {paymentMethod === 'Direct Bank Transfer (SBI Account)' && (
                <div className="bg-[#0f1826] border border-yellow-500/40 rounded-2xl p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                    <Landmark className="w-4 h-4" />
                    <span>Bank Transfer Details (SBI Hazaribagh Branch):</span>
                  </div>
                  <p className="text-sm text-slate-200"><span className="text-slate-400">Bank Name:</span> <strong>State Bank of India (SBI)</strong></p>
                  <p className="text-sm text-slate-200"><span className="text-slate-400">Account Number:</span> <strong>38291048291</strong></p>
                  <p className="text-sm text-slate-200"><span className="text-slate-400">IFSC Code:</span> <strong className="font-mono">SBIN0000088</strong></p>
                  <p className="text-sm text-slate-200"><span className="text-slate-400">Account Holder:</span> <strong>English Platform Hazaribagh</strong></p>
                </div>
              )}

              {paymentMethod === 'Pay Cash at Institute Counter' && (
                <div className="bg-[#0f1826] border border-yellow-500/40 rounded-2xl p-5 space-y-2 flex items-start gap-3">
                  <ScanLine className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-200">
                    Please visit <strong>Ananda Chowk, Hazaribagh</strong> campus and pay the admission fee in cash at the counter. Show your Application ID <strong className="text-yellow-300">{submittedAppId}</strong> at reception to get your receipt.
                  </p>
                </div>
              )}

              {/* Highlighted note about WhatsApp screenshot */}
              <div className="bg-yellow-400/10 border border-yellow-400/50 rounded-xl px-4 py-3">
                <p className="text-xs sm:text-sm text-yellow-300 font-semibold flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Note: After payment, please take a screenshot of the payment confirmation and share it on WhatsApp along with your Application ID for instant seat confirmation.</span>
                </p>
              </div>

              <button
                onClick={handlePaymentContinue}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Continue</span>
              </button>
            </div>
          )}

          {/* STEP 3: SUCCESS / WHATSAPP */}
          {step === 'success' && submittedAppId && (
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
                <div className="font-bold text-blue-600 border-b border-slate-200 pb-2">Next Steps:</div>
                <p>1. Please visit campus at <strong>Ananda Chowk, Hazaribagh</strong> during your chosen batch time ({formData.batchTiming}).</p>
                <p>2. Show your Application ID <strong>{submittedAppId}</strong> at the reception desk to receive your demo pass & handwritten workbook.</p>
                <p>3. Don't forget to share your payment screenshot on WhatsApp for instant confirmation.</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 text-left">
                <p className="text-xs sm:text-sm text-yellow-800 font-semibold flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Reminder: Please attach your payment screenshot on WhatsApp in the chat below for instant seat confirmation.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                
                <a  href={`https://wa.me/916364240496?text=${encodeURIComponent(buildWhatsAppMessage(submittedAppId))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Details & Confirm on WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setStep('form');
                    setSubmittedAppId(null);
                    setTransactionId('');
                  }}
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