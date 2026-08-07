import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Phone, User as UserIcon, Lock, ArrowRight, GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPhoneValidationError } from '../lib/phoneValidation';

export const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim();
    const validationError = getPhoneValidationError(cleanPhone);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const res = await login(cleanPhone);
    setLoading(false);

    if (res.success) {
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/profile');
      }
    } else {
      setError(res.error || 'Yeh mobile number registered nahi hai. Pehle Sign Up (Register) karein.');
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
          <h1 className="text-2xl font-black text-slate-900">Student Portal Login</h1>
          <p className="text-xs text-slate-500">
            Enter your registered 10-digit mobile number to log in
          </p>
        </div>

        {redirectUrl && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-xl flex items-start gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">Authentication Required:</strong>
              Please log in or sign up to start taking this test.
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl text-center font-bold space-y-1">
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Registered Mobile Number *
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
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pl-[4.25rem] pr-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Mobile Number...' : 'Login with Mobile Number'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          Mobile number registered nahi hai?{' '}
          <Link
            to={redirectUrl ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : '/signup'}
            className="text-blue-600 font-bold hover:underline"
          >
            Naya Account (Register) Banayein
          </Link>
        </div>
      </div>
    </div>
  );
};