import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  Send,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Copy,
  Check,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { fetchCoursesFromSanity } from '../lib/sanity/queries';
import { Course } from '../types';
import qrImage from '../assets/qr.png';

type Step = 'form' | 'payment' | 'success';

// Fallback fees for the hardcoded course list (used only when Sanity data isn't available
// or a fetched course doesn't carry a `price` field). Update amounts here as needed.
const FALLBACK_COURSE_FEES: Record<string, number> = {
  'Class 10 JAC & CBSE English Mastery': 2500,
  'Class 12 JAC & CBSE Core English Target Batch': 2500,
  'Class 11 Academic & Competitive Foundation': 2200,
  'Class 9 Strong Base English Foundation': 2000,
  'Fluent Spoken English & Personality Development': 3000,
  'SSC CGL, CHSL, Railway & NDA English Masterclass': 3500,
};
const DEFAULT_FEE = 2500;

const UPI_ID = '6364240496@ybl';
const UPI_NAME = '6364240496 (R.K. Yadav Sir)';
const BANK_NAME = 'State Bank of India (SBI)';
const BANK_ACCOUNT = '38291048291';
const BANK_IFSC = 'SBIN0000088';
const BANK_HOLDER = 'English Platform Hazaribagh';
const WHATSAPP_NUMBER = '916364240496';

export const AdmissionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledCourse = searchParams.get('course') || '';

  const [step, setStep] = useState<Step>('form');
  const [courses, setCourses] = useState<Course[]>([]);
  const [copied, setCopied] = useState<'upi' | 'number' | 'account' | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    targetClass: prefilledCourse ? prefilledCourse : 'Class 10 JAC & CBSE English Mastery',
    batchTiming: 'Morning (07:00 AM - 08:30 AM)',
    mode: 'Offline Campus',
    schoolName: '',
    address: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Online UPI (PhonePe / Google Pay / Paytm)');
  const [transactionId, setTransactionId] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  useEffect(() => {
    fetchCoursesFromSanity()
      .then((fetched) => {
        if (fetched && fetched.length > 0) {
          setCourses(fetched);
          if (!prefilledCourse) {
            setFormData((prev) => ({ ...prev, targetClass: fetched[0].title }));
          }
        }
      })
      .catch(console.error);
  }, [prefilledCourse]);

  // Works out the fee for whichever course is currently selected in the form.
  // Priority: price from the Sanity-fetched course (if that field exists) -> fallback map -> default.
  const getSelectedFee = (): number => {
    const matchedCourse = courses.find((c) => c.title === formData.targetClass) as
      | (Course & { price?: number })
      | undefined;
    if (matchedCourse?.price) {
      return matchedCourse.price;
    }
    if (FALLBACK_COURSE_FEES[formData.targetClass]) {
      return FALLBACK_COURSE_FEES[formData.targetClass];
    }
    return DEFAULT_FEE;
  };

  const selectedFee = getSelectedFee();

  // Step 1: Form -> Payment
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Please fill in your Full Name and Phone Number.');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Payment -> Success
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const isCash = paymentMethod === 'Pay Cash at Institute Counter';
    if (!isCash && !transactionId.trim()) {
      alert('Please enter your Payment Transaction ID / UTR No. after making the payment.');
      return;
    }
    const appId = 'EPH-2026-' + Math.floor(1000 + Math.random() * 9000);
    setSubmittedAppId(appId);
    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = (text: string, key: 'upi' | 'number' | 'account') => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  // Builds a complete, formatted WhatsApp message with every field + payment details
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
      `*Amount:* ₹${selectedFee}/-`,
      `*Transaction ID / UTR:* ${transactionId ? transactionId : 'N/A (Cash Payment)'}`,
      ``,
      `*I am attaching my payment screenshot along with this message.*`,
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

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-full ${step === 'form' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            1. Details
          </span>
          <span className="text-slate-300">—</span>
          <span className={`px-3 py-1 rounded-full ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            2. Payment
          </span>
          <span className="text-slate-300">—</span>
          <span className={`px-3 py-1 rounded-full ${step === 'success' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            3. Confirm
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form / Payment / Success */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* STEP 1: FORM */}
          {step === 'form' && (
            <form onSubmit={handleContinueToPayment} className="space-y-5">
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
                      Object.keys(FALLBACK_COURSE_FEES).map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Registration fee for this course: <strong className="text-blue-700">₹{selectedFee}/-</strong>
                  </p>
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
            <form onSubmit={handleConfirmPayment} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Registration Fee Payment</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Edit Details
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                    Fee for Selected Course
                  </span>
                  <span className="text-[11px] text-blue-600">{formData.targetClass}</span>
                </div>
                <span className="text-lg font-black text-blue-700">₹{selectedFee}/-</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                >
                  <option value="Online UPI (PhonePe / Google Pay / Paytm)">Online UPI (PhonePe / Google Pay / Paytm)</option>
                  <option value="QR Code Scanner (Instant Scan)">QR Code Scanner (Instant Scan)</option>
                  <option value="Direct Bank Transfer (SBI Account)">Direct Bank Transfer (SBI Account)</option>
                  <option value="Pay Cash at Institute Counter">Pay Cash at Institute Counter</option>
                </select>
              </div>

              {/* Dynamic panel per method */}
              {(paymentMethod === 'Online UPI (PhonePe / Google Pay / Paytm)' ||
                paymentMethod === 'QR Code Scanner (Instant Scan)') && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                  {paymentMethod === 'QR Code Scanner (Instant Scan)' && (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={qrImage}
                        alt="Scan to Pay QR Code"
                        className="w-40 h-40 rounded-lg border border-slate-300 bg-white p-2"
                      />
                      <span className="text-xs font-bold text-blue-700">Scan to Pay ₹{selectedFee}/-</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2.5">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">UPI ID</div>
                      <div className="text-sm font-bold text-slate-900">{UPI_ID}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(UPI_ID, 'upi')}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-100"
                    >
                      {copied === 'upi' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === 'upi' ? 'Copied' : 'Copy UPI ID'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2.5">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PhonePe / GPay / Paytm</div>
                      <div className="text-sm font-bold text-slate-900">{UPI_NAME}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('6364240496', 'number')}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-100"
                    >
                      {copied === 'number' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === 'number' ? 'Copied' : 'Copy Number'}
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'Direct Bank Transfer (SBI Account)' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-sm">
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Bank Transfer Details (SBI Hazaribagh Branch)
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank Name:</span>
                    <span className="font-bold text-slate-900">{BANK_NAME}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Account Number:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      {BANK_ACCOUNT}
                      <button
                        type="button"
                        onClick={() => handleCopy(BANK_ACCOUNT, 'account')}
                        className="text-blue-700"
                      >
                        {copied === 'account' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">IFSC Code:</span>
                    <span className="font-bold text-slate-900">{BANK_IFSC}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Holder:</span>
                    <span className="font-bold text-slate-900">{BANK_HOLDER}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Amount to Transfer:</span>
                    <span className="font-black text-blue-700">₹{selectedFee}/-</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'Pay Cash at Institute Counter' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
                  You can pay <strong>₹{selectedFee}/-</strong> in cash directly at the reception desk,
                  Ananda Chowk campus, at the time of your demo class. No online transaction ID needed —
                  just submit this form to confirm your seat.
                </div>
              )}

              {paymentMethod !== 'Pay Cash at Institute Counter' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enter Payment Transaction ID / UTR No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 420918239012 or PhonePe Ref No."
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              )}

              {/* Highlighted note */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-bold text-amber-800">
                  Payment karne ke baad uska screenshot zaroor WhatsApp par share karein — tabhi aapki
                  seat confirm hogi. Neeche button dabate hi aapki saari details WhatsApp par chali jayengi,
                  bas screenshot attach karke bhej dein.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Payment & Continue</span>
              </button>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
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
                  Dear <strong className="text-slate-900">{formData.fullName}</strong>, your seat for 3 days
                  free demo classes in <strong className="text-blue-600">{formData.targetClass}</strong> (Fee: ₹
                  {selectedFee}/-) has been provisionally reserved.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-left text-xs sm:text-sm font-bold text-amber-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Zaroori: Payment ka screenshot neeche WhatsApp button dabakar zaroor bhej dein.
                  Screenshot ke bina seat final confirm nahi hogi.
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 text-slate-700">
                <div className="font-bold text-blue-600 border-b border-slate-200 pb-2">Next Steps for Demo Class:</div>
                <p>1. Click the WhatsApp button below — your full details will be pre-filled automatically.</p>
                <p>2. Attach your payment screenshot in the same WhatsApp chat and hit send.</p>
                <p>
                  3. Visit campus at <strong>Ananda Chowk, Hazaribagh</strong> during your chosen batch time (
                  {formData.batchTiming}) and show Application ID <strong>{submittedAppId}</strong> at reception.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                
                <a  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(submittedAppId))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Details & Screenshot on WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setStep('form');
                    setSubmittedAppId(null);
                    setTransactionId('');
                    setFormData({
                      fullName: '',
                      phone: '',
                      whatsapp: '',
                      targetClass: courses[0]?.title || 'Class 10 JAC & CBSE English Mastery',
                      batchTiming: 'Morning (07:00 AM - 08:30 AM)',
                      mode: 'Offline Campus',
                      schoolName: '',
                      address: '',
                    });
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