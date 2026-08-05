import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, AlertCircle, Award, RotateCcw, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Test } from '../../types';

interface McqTestModalProps {
  test: Test | null;
  onClose: () => void;
}

export const McqTestModal: React.FC<McqTestModalProps> = ({ test, onClose }) => {
  if (!test || !test.questions || test.questions.length === 0) return null;

  const questions = test.questions;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const handleSelectOption = (optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIdx
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Score Calculation
  const calculateResult = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const marksObtained = (correctCount / total) * test.marks;
    return { correctCount, total, percentage, marksObtained };
  };

  const result = calculateResult();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-900 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 font-extrabold text-[10px] px-2 py-0.5 rounded border border-blue-200 uppercase">
                {test.type}
              </span>
              <span className="text-xs text-slate-500">Class {test.class} • {test.marks} Marks</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{test.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-blue-700 font-mono text-xs font-bold">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!isSubmitted ? (
            <>
              {/* Question Navigation Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {questions.map((_, idx) => {
                  const answered = userAnswers[idx] !== undefined;
                  const current = currentIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs shrink-0 transition-all ${
                        current
                          ? 'bg-blue-600 text-white font-black ring-2 ring-blue-400'
                          : answered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Current Question Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-slate-500">Multiple Choice</span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  {questions[currentIdx].question || (questions[currentIdx] as any).questionText || 'Question'}
                </h3>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {((Array.isArray(questions[currentIdx].options) && questions[currentIdx].options.length > 0)
                    ? questions[currentIdx].options
                    : [
                        (questions[currentIdx] as any)?.optionA,
                        (questions[currentIdx] as any)?.optionB,
                        (questions[currentIdx] as any)?.optionC,
                        (questions[currentIdx] as any)?.optionD
                      ].filter(Boolean)
                  ).map((opt, optIdx) => {
                    const isSelected = userAnswers[currentIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-slate-300 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Result Summary Screen */
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Test Completed!</h3>
                  <p className="text-slate-600 text-sm mt-1">Here is your official evaluation scorecard</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500">Score</div>
                    <div className="text-xl font-black text-blue-600">{result.marksObtained}/{test.marks}</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500">Correct</div>
                    <div className="text-xl font-black text-emerald-600">{result.correctCount}/{result.total}</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500">Accuracy</div>
                    <div className="text-xl font-black text-blue-600">{result.percentage}%</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500">Percentile</div>
                    <div className="text-xl font-black text-indigo-600">95.8%</div>
                  </div>
                </div>
              </div>

              {/* Detailed Answer Breakdown */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Detailed Question Analysis & Explanations:
                </h4>

                <div className="space-y-3">
                  {questions.map((q, idx) => {
                    const userAns = userAnswers[idx];
                    const isCorrect = userAns === q.correctAnswer;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border text-sm space-y-2 ${
                          isCorrect
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-red-50/50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 font-semibold text-slate-900">
                          <span>Q{idx + 1}. {q.question}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-slate-700">
                          <div>Your Choice: <strong className={isCorrect ? 'text-emerald-700' : 'text-red-700'}>{userAns !== undefined ? q.options[userAns] : 'Not Answered'}</strong></div>
                          <div>Correct Answer: <strong className="text-emerald-700">{q.options[q.correctAnswer]}</strong></div>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg text-xs text-slate-700 border border-slate-200">
                          <strong className="text-blue-700">Explanation: </strong>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          {!isSubmitted ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => prev - 1)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors text-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => setCurrentIdx((prev) => prev + 1)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors text-slate-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  if (Object.keys(userAnswers).length < questions.length) {
                    if (!confirm('You have unanswered questions. Are you sure you want to submit?')) return;
                  }
                  setIsSubmitted(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors shadow-sm"
              >
                Submit Test
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setUserAnswers({});
                  setTimeLeft(test.durationMinutes * 60);
                  setCurrentIdx(0);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg bg-white border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                Retake Test
              </button>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
