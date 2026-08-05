import React from 'react';
import { ClassLevel } from '../../types';

interface ClassFilterProps {
  selectedClass: ClassLevel;
  onSelectClass: (c: ClassLevel) => void;
  showAllOptions?: boolean;
}

export const ClassFilter: React.FC<ClassFilterProps> = ({
  selectedClass,
  onSelectClass,
  showAllOptions = true
}) => {
  const filterOptions: { id: ClassLevel; label: string }[] = [
    { id: 'all', label: 'All Classes' },
    { id: '10', label: 'Class 10' },
    { id: '12', label: 'Class 12' },
    { id: '11', label: 'Class 11' },
    { id: '9', label: 'Class 9' },
    ...(showAllOptions
      ? [
          { id: 'spoken-english' as ClassLevel, label: 'Spoken English' },
          { id: 'competitive' as ClassLevel, label: 'Competitive Exam' }
        ]
      : [])
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
        {filterOptions.map((opt) => {
          const active = selectedClass === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectClass(opt.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 ${
                active
                  ? 'bg-blue-600 text-white shadow-sm scale-[1.02]'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
