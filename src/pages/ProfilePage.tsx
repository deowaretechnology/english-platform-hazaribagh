import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import {
  BookOpen,
  Clock,
  Download,
  LogOut,
  ShieldCheck,
  FileText,
  Sparkles,
  ChevronRight,
  Eye,
  X,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { downloadStudentCardPdf, downloadFeeReceiptPdf } from '../utils/pdfgenerator';

interface QuestionSnapshot {
  questionText: string;
  options: string[];
  correctOption: number;
  studentAnswer: number;
  isCorrect: boolean;
}

interface DBTestAttempt {
  id: string;
  attemptNumber?: number;
  totalAttemptsForTest?: number;
  testSlug: string;
  testTitle: string;
  classLevel: string;
  score: number;
  totalMarks: number;
  marksPerQuestion: number;
  totalQuestions: number;
  accuracyPercent: number;
  questions: QuestionSnapshot[];
  submittedAt: string;
}

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState<DBTestAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [attemptsError, setAttemptsError] = useState<string | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<DBTestAttempt | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function fetchUserHistory() {
      if (!user) return;
      setLoadingAttempts(true);
      setAttemptsError(null);
      const identifier = user.phone || user.id;

      try {
        const data = await apiFetch<{ success: boolean; attempts: DBTestAttempt[] }>(`/api/auth/user/${identifier}`);
        const sorted = [...(data.attempts || [])].sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setAttempts(sorted);
      } catch (err) {
        console.warn('Failed to load user attempt history:', err);
        setAttemptsError('Could not load your test history right now. Please refresh to try again.');
      } finally {
        setLoadingAttempts(false);
      }
    }

    fetchUserHistory();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 space-y-10">

      {/* Top Banner Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-blue-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-blue-200">
                ADMISSION ID: {user.admissionId || 'EPH-2026-901'}
              </span>
              <span className="text-xs text-slate-500">Joined {user.createdAt || '2026-08-01'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{user.name}</h1>
            <p className="text-xs text-slate-500">{user.targetClass || `Class ${user.classLevel}`} • Mobile: +91 {user.phone}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col: Enrolled Batches & Documents */}
        <div className="lg:col-span-1 space-y-6">

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Enrolled Batches</span>
            </h2>

            <div className="space-y-3">
              {user.enrolledCourses.map((c, idx) => {
                const title = typeof c === 'string' ? c : c.courseTitle;
                return (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">Active Enrolled</span>
                    <div className="text-sm font-bold text-slate-900 pt-1">{title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" /> Morning 07:00 AM - 08:30 AM
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/courses"
              className="block text-center text-xs text-blue-600 font-bold hover:underline pt-2"
            >
              + Enroll in additional batch &rarr;
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Student Pass & Receipts</span>
            </h2>

            <div className="space-y-2">
              <button
                onClick={() => downloadStudentCardPdf(user)}
                className="w-full bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-left text-xs text-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Download Student Identity Card</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => downloadFeeReceiptPdf(user)}
                className="w-full bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-left text-xs text-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Download Official Fee Receipt</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Col: Test Performance Analytics */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-blue-600">Test Record</span>
                <h2 className="text-xl font-bold text-slate-900">Sunday OMR Test Score History</h2>
              </div>
              <Link
                to="/tests"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors shadow-xs"
              >
                <span>Take Live Test</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loadingAttempts ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Loading your test records...
              </div>
            ) : attemptsError ? (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-2">
                <p className="text-sm font-bold text-rose-700">{attemptsError}</p>
              </div>
            ) : attempts.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No live test attempts recorded yet.</p>
                <p className="text-xs text-slate-500">Take your first Sunday OMR mock test to view a detailed performance breakdown.</p>
                <Link
                  to="/tests"
                  className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs mt-2"
                >
                  Browse Available Tests
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {attempts.map((att) => {
                  const dateStr = new Date(att.submittedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  const timeStr = new Date(att.submittedAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div key={att.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-blue-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase mr-2">
                            Class {att.classLevel}
                          </span>
                          <span className="font-bold text-sm text-slate-900">{att.testTitle}</span>
                          {(att.totalAttemptsForTest ?? 1) > 1 && (
                            <span className="ml-2 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
                              Attempt {att.attemptNumber} of {att.totalAttemptsForTest}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">Submitted on {dateStr} at {timeStr}</div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div>
                          Score: <strong className="text-blue-600 font-bold text-sm">{att.score}</strong> / {att.totalMarks ?? att.totalQuestions} ({att.accuracyPercent}%)
                        </div>
                        <button
                          onClick={() => setSelectedAttempt(att)}
                          className="bg-white hover:bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-slate-300 hover:border-blue-400 flex items-center gap-1.5 text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>View Full Question Snapshot</span>
                        </button>
                      </div>

                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(100, att.accuracyPercent)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-0.5">Sanity + MongoDB Hybrid Architecture:</strong>
                Question papers are served live from Sanity CMS, while your user profile and test snapshots are persisted permanently in MongoDB Atlas.
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Question Breakdown Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="text-lg font-black text-white">{selectedAttempt.testTitle}</h3>
                <p className="text-xs text-slate-400">
                  Score: {selectedAttempt.score}/{selectedAttempt.totalMarks ?? selectedAttempt.totalQuestions} • Accuracy: {selectedAttempt.accuracyPercent}% • Class {selectedAttempt.classLevel}
                </p>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {selectedAttempt.questions.map((q, idx) => {
                const isUnanswered = q.studentAnswer === -1;
                const studentOptionText = !isUnanswered && q.options[q.studentAnswer] ? q.options[q.studentAnswer] : 'Not Answered';
                const correctOptionText = q.options[q.correctOption] || 'Option A';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border space-y-3 ${
                      q.isCorrect
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : isUnanswered
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Q{idx + 1}. {q.questionText}
                      </span>
                      {q.isCorrect ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Correct
                        </span>
                      ) : isUnanswered ? (
                        <span className="bg-slate-400 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                          Unanswered
                        </span>
                      ) : (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                          <XCircle className="w-3 h-3" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 font-semibold block text-[10px] uppercase">Your Answer:</span>
                        <span className={`font-bold ${q.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {studentOptionText}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 font-semibold block text-[10px] uppercase">Correct Option:</span>
                        <span className="font-bold text-slate-900">
                          {correctOptionText}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs"
              >
                Close Snapshot
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};