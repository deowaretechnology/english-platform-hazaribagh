import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Phone, User as UserIcon, Mail, BookOpen, ArrowRight, GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchCoursesFromSanity } from '../lib/sanity/queries';
import { Course } from '../types';
import { getPhoneValidationError } from '../lib/phoneValidation';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [targetClass, setTargetClass] = useState('Class 10');
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCoursesFromSanity().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setCourses(fetched);
      }
    }).catch(console.error);
  }, []);

  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.trim();
    const validationError = getPhoneValidationError(cleanPhone);
    if (validationError) {
      setError(validationError);
      return;
    }

    const res = await signup(name, cleanPhone, targetClass, email);
    if (res.success) {
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/profile');
      }
    } else {
      setError(res.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create Student Account</h1>
          <p className="text-xs text-slate-500">
            Register to access online tests, notes, and progress reports
          </p>
        </div>

        {redirectUrl && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-xl flex items-start gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">Registration Required:</strong>
              Please create an account or log in to start taking this test.
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Kumari"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 select-none">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pl-[4.25rem] pr-4 py-3 text-sm text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Class / Stream
            </label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
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
                  <option value="Class 10">Class 10 (JAC / CBSE)</option>
                  <option value="Class 12">Class 12 (JAC / CBSE)</option>
                  <option value="Class 11">Class 11 Foundation</option>
                  <option value="Class 9">Class 9 Base</option>
                  <option value="Spoken English">Spoken English Express</option>
                  <option value="Competitive Exam">Competitive (SSC / Railway / NDA)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Create Account & Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link
            to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
            className="text-blue-600 font-bold hover:underline"
          >
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
};