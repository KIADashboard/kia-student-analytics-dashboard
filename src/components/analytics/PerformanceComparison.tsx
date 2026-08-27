import React, { useState } from 'react';
import { BarChart3, HelpCircle } from 'lucide-react';
import { Student } from '../../types';

interface PerformanceComparisonProps {
  students: Student[];
  onFilterChange?: (filter: { field: string; value: string }) => void;
}

type ComparisonMode = 'gender' | 'residence' | 'school' | 'firstGraduate' | 'farming';
interface Group { label: string; students: Student[]; }

const average = (students: Student[], field: 'hscMarks' | 'cutoffScore') => students.length > 0
  ? (students.reduce((total, student) => total + student[field], 0) / students.length).toFixed(1)
  : '—';

export const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({ students, onFilterChange }) => {
  const [mode, setMode] = useState<ComparisonMode>('gender');
  const modes: { id: ComparisonMode; label: string }[] = [
    { id: 'gender', label: 'Male vs Female' },
    { id: 'residence', label: 'Residence area' },
    { id: 'school', label: 'School background' },
    { id: 'firstGraduate', label: 'First Graduate' },
    { id: 'farming', label: 'Farming background' },
  ];

  const getGroups = (): Group[] | null => {
    if (mode === 'gender') return ['Male', 'Female'].map(label => ({ label, students: students.filter(student => student.gender === label) }));
    if (mode === 'school') return [
      { label: 'Government', students: students.filter(student => student.schoolType === 'Government') },
      { label: 'Private', students: students.filter(student => student.schoolType === 'Private Matric' || student.schoolType === 'CBSE/ICSE') },
      { label: 'Aided', students: students.filter(student => student.schoolType === 'Govt-Aided') },
    ];
    if (mode === 'firstGraduate') return ['Yes', 'No'].map(label => ({ label, students: students.filter(student => (student.firstGenerationGraduate ? 'Yes' : 'No') === label) }));
    if (mode === 'farming') return ['Farming', 'Non-farming'].map(label => ({ label, students: students.filter(student => (student.agricultureBackground === 'Yes' ? 'Farming' : 'Non-farming') === label) }));
    return null;
  };

  const groups = getGroups();
  const maxCount = groups ? Math.max(...groups.map(group => group.students.length), 1) : 1;

  return (
    <section id="performance-comparison-section" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700"><BarChart3 className="w-4 h-4" /></div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Performance Comparison</h3>
            <p className="text-[11px] text-slate-500">Compare population size, XII marks, and cut-off across observed groups.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {modes.map(item => <button key={item.id} onClick={() => setMode(item.id)} className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition ${mode === item.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}>{item.label}</button>)}
        </div>
      </div>
      {!groups ? (
        <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500"><HelpCircle className="w-6 h-6 mb-2 text-slate-400" /><p className="text-sm font-semibold text-slate-700">Residence area data unavailable</p><p className="text-xs mt-1 max-w-sm">The current student dataset does not include rural, urban, or semi-urban classification.</p></div>
      ) : groups.every(group => group.students.length === 0) ? (
        <div className="py-12 text-center text-sm text-slate-500">No comparison data for the selected population.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 pt-5">
          {groups.map(group => <button type="button" key={group.label} onClick={() => onFilterChange?.({ field: mode, value: group.label })} className="border border-slate-200 p-4 text-left hover:border-slate-400 transition"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-800">{group.label}</span><span className="text-xs font-bold text-slate-900">{group.students.length}</span></div><div className="h-2 bg-slate-100 mt-3 overflow-hidden"><div className="h-full bg-slate-700" style={{ width: `${(group.students.length / maxCount) * 100}%` }} /></div><div className="grid grid-cols-2 gap-3 mt-5"><div><span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Avg XII mark</span><strong className="block mt-1 text-lg text-slate-900">{average(group.students, 'hscMarks')}{group.students.length > 0 && '%'}</strong></div><div><span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Avg cut-off</span><strong className="block mt-1 text-lg text-slate-900">{average(group.students, 'cutoffScore')}</strong></div></div></button>)}
        </div>
      )}
    </section>
  );
};
