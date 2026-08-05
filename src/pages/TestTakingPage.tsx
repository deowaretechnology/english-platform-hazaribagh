import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ShieldAlert, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { seededShuffle } from '../lib/shuffle';
import { useAuth } from '../context/AuthContext';

interface Question {
  id: string | number;
  questionText: string;
  options: string[];
}

export const TestTakingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const studentId = user?.phone || user?.id || 'anonymous_student';
  const testSlug = slug || 'default-test';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [existingAttempt, setExistingAttempt] = useState<any | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string | number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 mins default
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Storage key for progress
  const progressKey = `test_progress_${studentId}_${testSlug}`;

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate(`/login?redirect=${encodeURIComponent(`/tests/${testSlug}`)}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate, testSlug]);

  // 1. Check attempt history & fetch questions from API route
  useEffect(() => {
    if (!isAuthenticated && !user) return;

    async function checkAndLoadTest() {
      setLoading(true);
      setError(null);

      // A. Check local storage for existing attempt
      try {
        const localAttemptsRaw = localStorage.getItem(`eph_attempts_${studentId}`);
        if (localAttemptsRaw) {
          const localList = JSON.parse(localAttemptsRaw);
          const match = localList.find((a: any) => a.testSlug === testSlug);
          if (match) {
            setExistingAttempt(match);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Error reading local attempts:', e);
      }

      // B. Check MongoDB backend for existing attempt
      try {
        const checkRes = await fetch(`/api/tests/${testSlug}/check-attempt/${studentId}`);
        const checkData = await checkRes.json();
        if (checkData.success && checkData.attempted) {
          setExistingAttempt(checkData.attempt);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Error checking server attempt:', e);
      }

      // C. Load questions if not attempted
      try {
        const res = await fetch(`/api/tests/${testSlug}/questions`);
        const data = await res.json();

        if (data.success && data.questions && data.questions.length > 0) {
          // Shuffle deterministically per student ID + test slug
          const seed = `${studentId}_${testSlug}`;
          const shuffled = seededShuffle<Question>(data.questions, seed);
          setQuestions(shuffled);

          // Restore saved progress if exists
          const saved = localStorage.getItem(progressKey);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.userAnswers) setUserAnswers(parsed.userAnswers);
              if (parsed.currentIdx !== undefined) setCurrentIdx(parsed.currentIdx);
              if (parsed.timeLeft !== undefined) setTimeLeft(parsed.timeLeft);
            } catch (e) {
              console.warn('Failed to parse saved progress:', e);
            }
          }
        } else {
          setError('No questions found for this test. Please check back soon.');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to connect to test server. Please reload page.');
      } finally {
        setLoading(false);
      }
    }

    checkAndLoadTest();
  }, [testSlug, studentId]);

  // 2. Persist progress to LocalStorage on state change
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(
        progressKey,
        JSON.stringify({
          userAnswers,
          currentIdx,
          timeLeft,
          updatedAt: Date.now()
        })
      );
    }
  }, [userAnswers, currentIdx, timeLeft, progressKey, questions.length]);

  // 3. Countdown Timer
  useEffect(() => {
    if (loading || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, questions.length]);

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = questions[currentIdx];
    if (!currentQ) return;

    // Rule: If question is already answered, answer is LOCKED and CANNOT be changed!
    if (userAnswers[currentQ.id] !== undefined) {
      return;
    }

    const updated = {
      ...userAnswers,
      [currentQ.id]: optionIndex
    };

    setUserAnswers(updated);

    // Save immediately to localStorage for instant refresh safety
    localStorage.setItem(
      progressKey,
      JSON.stringify({
        userAnswers: updated,
        currentIdx,
        timeLeft,
        updatedAt: Date.now()
      })
    );
  };

  // 4. Server-Side Submit and Evaluation
  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/tests/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: studentId,
          slug: testSlug,
          userAnswers
        })
      });

      const resultData = await res.json();

      if (resultData.success) {
        // Clear in-progress storage
        localStorage.removeItem(progressKey);

        // Store persistent local attempt snapshot for profile & attempt checks
        try {
          const attemptSnapshot = {
            id: 'att_' + Date.now(),
            testSlug: testSlug,
            testTitle: resultData.testTitle || testSlug.toUpperCase().replace(/-/g, ' '),
            classLevel: resultData.classLevel || user?.classLevel || '10',
            score: resultData.score,
            totalQuestions: resultData.totalQuestions,
            accuracyPercent: resultData.percentage,
            questions: (resultData.breakdown || []).map((b: any) => ({
              questionText: b.questionText,
              options: [b.userAnswer, b.correctAnswer],
              correctOption: b.isCorrect ? 0 : 1,
              studentAnswer: 0,
              isCorrect: b.isCorrect
            })),
            submittedAt: new Date().toISOString()
          };

          const localAttemptsRaw = localStorage.getItem(`eph_attempts_${studentId}`);
          let localList = localAttemptsRaw ? JSON.parse(localAttemptsRaw) : [];
          localList = localList.filter((a: any) => a.testSlug !== testSlug);
          localList.unshift(attemptSnapshot);
          localStorage.setItem(`eph_attempts_${studentId}`, JSON.stringify(localList));
        } catch (e) {
          console.warn('Failed to save local attempt snapshot:', e);
        }

        // Store result for display on result page
        localStorage.setItem(`test_result_${testSlug}`, JSON.stringify(resultData));

        // Redirect to result page
        navigate(`/tests/${testSlug}/result`);
      } else {
        alert(resultData.error || 'Evaluation failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error submitting test. Please check network connection.');
      setIsSubmitting(false);
    }
  };

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Redirecting to Student Login...</h2>
          <p className="text-xs text-slate-500">Please sign in or create an account to start this test.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Preparing OMR Question Paper...</h2>
          <p className="text-xs text-slate-500">Shuffling questions deterministically for student session.</p>
        </div>
      </div>
    );
  }

  if (existingAttempt) {
    const formattedDate = existingAttempt.submittedAt
      ? new Date(existingAttempt.submittedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      : 'Recently';

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Test Already Attempted
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {existingAttempt.testTitle || testSlug.toUpperCase().replace(/-/g, ' ')}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Aapne yeh test pehle hi de diya hai ({formattedDate})! Ek student ek test ko sirf ek baar hi attempt kar sakta hai. Aap wapas answer change ya re-test nahi kar sakte.
            </p>
          </div>

          {/* Score Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Your Score</div>
              <div className="text-lg sm:text-xl font-black text-blue-600 mt-1">
                {existingAttempt.score} <span className="text-xs text-slate-400 font-normal">/ 50</span>
              </div>
            </div>
            <div className="border-x border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Accuracy</div>
              <div className="text-lg sm:text-xl font-black text-emerald-600 mt-1">
                {existingAttempt.accuracyPercent}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Class</div>
              <div className="text-lg sm:text-xl font-black text-slate-700 mt-1">
                Class {existingAttempt.classLevel || '10'}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate(`/tests/${testSlug}/result`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>View Scorecard & Solutions</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-3.5 rounded-xl text-xs border border-slate-300 transition-colors"
            >
              <span>Go to My Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-black text-slate-900">Test Unavailable</h2>
          <p className="text-xs text-slate-600">{error || 'No test questions found.'}</p>
          <button
            onClick={() => navigate('/tests')}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Return to Test Series
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const selectedOptionIdx = userAnswers[currentQ?.id];
  const isAnswerLocked = selectedOptionIdx !== undefined;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      
      {/* Test Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-md">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            JAC / CBSE Board Standard OMR Session
          </span>
          <h1 className="text-base sm:text-lg font-black text-white line-clamp-1">
            {testSlug.toUpperCase().replace(/-/g, ' ')}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            timeLeft < 300 ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-blue-300'
          }`}>
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to submit your test now?')) {
                handleSubmitTest();
              }
            }}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            {isSubmitting ? 'Evaluating...' : 'Submit Test'}
          </button>
        </div>
      </header>

      {/* Test Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Question Panel (Cols 3) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            
            {/* Question Header Status */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2">
                {isAnswerLocked && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Answer Locked
                  </span>
                )}
                <span className="text-xs text-slate-500 font-semibold">
                  Single Choice (+2.5 Marks)
                </span>
              </div>
            </div>

            {/* Answer Locked Banner if attempted */}
            {isAnswerLocked && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-xl flex items-center gap-2.5 font-semibold">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Is sawal ka answer lock ho chuka hai. Aap wapas aa sakte hain, par answer change nahi kar sakte.
                </span>
              </div>
            )}

            {/* Question Prompt */}
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.questionText}
            </div>

            {/* MCQ Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((optText, idx) => {
                const isSelected = selectedOptionIdx === idx;
                const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={idx}
                    disabled={isAnswerLocked}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 group ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-600'
                        : isAnswerLocked
                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isAnswerLocked
                        ? 'bg-slate-200 text-slate-400'
                        : 'bg-slate-100 border border-slate-200 text-slate-600 group-hover:bg-slate-200'
                    }`}>
                      {optionLabel}
                    </span>
                    <span className="text-sm pt-0.5 leading-relaxed flex-1 font-medium">
                      {optText}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md self-center">
                        Selected Choice
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                {isAnswerLocked ? (
                  <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Answer Locked
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Select an option to record your answer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Previous
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
                  >
                    Next Question
                    <ArrowRight className="w-4 h-4 inline ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md"
                  >
                    Finish & Submit Test
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar Question Palette (Col 1) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Question Palette</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {answeredCount} / {questions.length} Attempted
              </span>
            </div>

            {/* Grid of Number Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = currentIdx === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-blue-600 bg-blue-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span>
                <span>Answered Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></span>
                <span>Unattempted Questions</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
