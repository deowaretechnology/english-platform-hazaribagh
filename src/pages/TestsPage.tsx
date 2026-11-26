import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, Play, CheckCircle, Lock, Award } from 'lucide-react';
import { fetchTestsFromSanity } from '../lib/sanity/queries';
import { apiFetch } from '../lib/api';
import { ClassFilter } from '../components/ui/ClassFilter';
import { ClassLevel, Test } from '../types';
import { useAuth } from '../context/AuthContext';

export const TestsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [userAttemptsMap, setUserAttemptsMap] = useState<Record<string, any>>({});

  const handleStartTest = (testId: string) => {
    if (isAuthenticated || user) {
      navigate(`/tests/${testId}`);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(`/tests/${testId}`)}`);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const fetched = await fetchTestsFromSanity();
        setTests(fetched);
      } catch (err) {
        console.error('Error fetching tests from Sanity:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!user) return;
    const identifier = user.phone || user.id;

    async function loadUserAttempts() {
      try {
        const data = await apiFetch<{ success: boolean; attempts: any[] }>(`/api/auth/user/${identifier}`);
        // attempts come newest-first: keep the LATEST attempt and count all of them
        const map: Record<string, any> = {};
        (data.attempts || []).forEach((att: any) => {
          if (!att.testSlug) return;
          if (!map[att.testSlug]) map[att.testSlug] = { ...att, attemptCount: 0 };
          map[att.testSlug].attemptCount += 1;
        });
        setUserAttemptsMap(map);
      } catch (e) {
        console.warn('Could not load attempt history:', e);
      }
    }

    loadUserAttempts();
  }, [user]);

  const filteredTests = tests.filter((t) => {
    const matchesClass = selectedClass === 'all' || t.class === selectedClass;
    const matchesType = selectedType === 'all' || t.type === selectedType;
    return matchesClass && matchesType;
  });

  // Format marksPerQuestion without a trailing ".0" (e.g. "5" not "5.0"),
  // but keep decimals when they matter (e.g. "2.5").
  const formatMarks = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, ''));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 space-y-10">

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Examination Portal
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Online OMR Test Series
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Practice Sunday OMR tests, monthly grand mock exams, and board pattern question papers with instant score evaluation and percentile ranks.
        </p>
      </div>

      {/* Control Bars */}
      <div className="max-w-5xl mx-auto space-y-6">
        <ClassFilter selectedClass={selectedClass} onSelectClass={setSelectedClass} showAllOptions={false} />

        {/* Type Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Tests' },
            { id: 'Weekly OMR', label: 'Weekly OMR' },
            { id: 'Monthly Grand', label: 'Monthly Grand' },
            { id: 'Board Mock', label: 'Board Pattern Mock' }
          ].map((typeOpt) => (
            <button
              key={typeOpt.id}
              onClick={() => setSelectedType(typeOpt.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedType === typeOpt.id
                  ? 'bg-blue-600 text-white font-black shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600'
              }`}
            >
              {typeOpt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test List Grid */}
      <div className="max-w-5xl mx-auto space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-medium">
            Loading test series from Sanity...
          </div>
        ) : filteredTests.length > 0 ? (
          filteredTests.map((test) => {
            const isActive = test.status === 'Active';
            const isUpcoming = test.status === 'Upcoming';
            const isCompleted = test.status === 'Completed';
            const attempt = userAttemptsMap[test.id];

            return (
              <div
                key={test.id}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all shadow-xs hover:shadow-md"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded border border-blue-200">
                      Class {test.class} • {test.type}
                    </span>

                    {attempt && (
                      <span className="bg-amber-50 text-amber-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                        Attempted {attempt.attemptCount}x (Latest: {attempt.score}/{attempt.totalMarks ?? test.marks})
                      </span>
                    )}

                    {isActive && !attempt && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        Active Now
                      </span>
                    )}

                    {isUpcoming && (
                      <span className="bg-amber-50 text-amber-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-amber-200">
                        Upcoming
                      </span>
                    )}

                    {isCompleted && !attempt && (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                        Completed
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{test.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      {test.totalQuestions} Questions ({test.marks} Marks)
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      {formatMarks(test.marksPerQuestion)} Marks / Question
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {test.durationMinutes} Minutes Time Limit
                    </span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  {attempt && (isActive || isCompleted) ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => navigate(`/tests/${test.id}/result`)}
                        className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                      >
                        <CheckCircle className="w-4 h-4 text-amber-400" />
                        <span>View Last Score</span>
                      </button>
                      <button
                        onClick={() => handleStartTest(test.id)}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Retake Test</span>
                      </button>
                    </div>
                  ) : isActive || isCompleted ? (
                    <button
                      onClick={() => handleStartTest(test.id)}
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isActive ? 'Start OMR Test' : 'Review Test'}</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full md:w-auto bg-slate-100 text-slate-400 cursor-not-allowed font-semibold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-200"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Starts {test.date}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm shadow-xs">
            No tests match the chosen filter.
          </div>
        )}
      </div>

    </div>
  );
};