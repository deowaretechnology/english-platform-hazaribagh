import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, ArrowLeft, RefreshCw, BarChart2, BookOpen, AlertCircle } from 'lucide-react';

interface QuestionBreakdown {
  questionId: string | number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface TestResult {
  correctCount: number;
  totalQuestions: number;
  score: number;
  totalMarks: number;
  percentage: number;
  percentile: number;
  breakdown: QuestionBreakdown[];
}

export const TestResultPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const testSlug = slug || 'default-test';

  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`test_result_${testSlug}`);
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse test result:', e);
      }
    }
  }, [testSlug]);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-black text-slate-900">No Result Record Found</h2>
          <p className="text-xs text-slate-600">Please complete an OMR test session first.</p>
          <button
            onClick={() => navigate('/tests')}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Go to Test Series
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Evaluation Complete</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Test Performance Scorecard
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 uppercase font-mono tracking-widest">
          {testSlug.toUpperCase().replace(/-/g, ' ')}
        </p>
      </div>

      {/* Score Stats Summary Card */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          <div className="pt-2 sm:pt-0 space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase">Score</div>
            <div className="text-3xl sm:text-4xl font-black text-blue-600">
              {result.score} <span className="text-sm text-slate-400 font-normal">/ {result.totalMarks}</span>
            </div>
            <div className="text-[10px] text-slate-400">Total Marks</div>
          </div>

          <div className="pt-2 sm:pt-0 sm:pl-4 space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase">Accuracy</div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">
              {result.percentage}%
            </div>
            <div className="text-[10px] text-slate-400">{result.correctCount} of {result.totalQuestions} Correct</div>
          </div>

          <div className="pt-2 sm:pt-0 sm:pl-4 space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase">Percentile</div>
            <div className="text-3xl sm:text-4xl font-black text-amber-600">
              {result.percentile}%ile
            </div>
            <div className="text-[10px] text-slate-400">Hazaribagh District Rank</div>
          </div>

          <div className="pt-2 sm:pt-0 sm:pl-4 space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase">Status</div>
            <div className={`text-2xl sm:text-3xl font-black ${result.percentage >= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {result.percentage >= 60 ? 'PASSED' : 'NEEDS PRACTICE'}
            </div>
            <div className="text-[10px] text-slate-400">Board Cutoff 40%</div>
          </div>

        </div>

        {/* CTAs */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/tests"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors text-center"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            Back to All Tests
          </Link>

          <Link
            to="/profile"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md text-center"
          >
            View Dashboard Test History
          </Link>
        </div>
      </div>

      {/* Question-by-Question Detailed Breakdown */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <span>Detailed Question Analysis ({result.breakdown.length})</span>
          </h2>
        </div>

        <div className="space-y-4">
          {result.breakdown.map((q, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-2xl p-5 space-y-4 transition-all shadow-xs ${
                q.isCorrect ? 'border-emerald-200' : 'border-rose-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-500">Q{idx + 1}.</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded flex items-center gap-1 ${
                    q.isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {q.isCorrect ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                    {q.isCorrect ? 'Correct (+2.5)' : 'Incorrect (0)'}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                {q.questionText}
              </div>

              {/* Answer comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className={`p-3 rounded-xl border ${
                  q.isCorrect ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-rose-50/50 border-rose-200 text-rose-900'
                }`}>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Your Selected Answer</div>
                  <div className="font-semibold">{q.userAnswer}</div>
                </div>

                <div className="p-3 rounded-xl border bg-blue-50/50 border-blue-200 text-blue-900">
                  <div className="text-[10px] uppercase font-bold text-blue-600 mb-0.5">Correct Answer Key</div>
                  <div className="font-semibold">{q.correctAnswer}</div>
                </div>
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-bold block mb-1">Grammar & Concept Reference:</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
