import React from 'react';
import { Users, GraduationCap, Award, Percent, MapPin, School } from 'lucide-react';
import { Student } from '../../types';

interface KPICardsProps {
  students: Student[];
  allStudents: Student[];
  isFiltered: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({
  students,
  allStudents,
  isFiltered
}) => {
  const totalCount = students.length;

  // Admissions represented in current selection
  // If a specific year is chosen, that year's count is the admission batch
  const admissionsCount = students.filter(s => s.currentSemester <= 2 || s.academicYear === 2025 || s.academicYear === 2024).length;
  const scaledAdmissions = isFiltered 
    ? Math.max(1, Math.round((admissionsCount / Math.max(1, allStudents.length)) * 480))
    : 480;

  // Scaled total for enterprise magnitude
  const scaledTotal = isFiltered
    ? Math.max(1, Math.round((students.length / Math.max(1, allStudents.length)) * 2450))
    : 2450;

  // Average Marks
  const avgMarks = totalCount > 0
    ? (students.reduce((acc, s) => acc + s.hscMarks, 0) / totalCount).toFixed(1)
    : '0.0';
  const avgCutoff = totalCount > 0
    ? (students.reduce((acc, s) => acc + s.cutoffScore, 0) / totalCount).toFixed(1)
    : '—';

  // Gender Distribution
  const maleCount = students.filter(s => s.gender === 'Male').length;
  const femaleCount = students.filter(s => s.gender === 'Female').length;
  const malePct = totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0;
  const femalePct = totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : null;
  const firstGraduatePct = totalCount > 0
    ? Math.round((students.filter(s => s.firstGenerationGraduate).length / totalCount) * 100)
    : null;

  // Unique Districts Represented
  const uniqueDistricts = new Set(students.map(s => s.district)).size;

  return (
    <div id="analytics-kpi-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Students */}
      <div id="kpi-total-students" className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Total Students
          </span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {totalCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">({totalCount} in sample)</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 font-medium">
          Across selected period
        </p>
      </div>

      {/* 2. Admissions */}
      <div id="kpi-admissions" className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Female %
          </span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Percent className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {femalePct === null ? '—' : `${femalePct}%`}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">seats</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 font-medium">
          Share of selected population
        </p>
      </div>

      {/* 3. Average Marks */}
      <div id="kpi-avg-marks" className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            First Graduate %
          </span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {firstGraduatePct === null ? '—' : `${firstGraduatePct}%`}
          </span>
          <span className="text-[10px] text-slate-600 font-medium">
            of students
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 font-medium">
          Based on first-generation flag
        </p>
      </div>

      {/* 4. Gender Distribution */}
      <div id="kpi-gender-dist" className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Average XII Mark
          </span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Award className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {avgMarks}%
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 font-medium">
          HSC mark available in dataset
        </p>
      </div>

      {/* 5. Districts Represented */}
      <div id="kpi-districts" className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Average Cut-off
          </span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <School className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {avgCutoff}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">districts</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 font-medium">
          Across selected students
        </p>
      </div>
      {/* 6. Rural percentage is unavailable in the current Student API shape. */}
      <div id="kpi-rural-percentage" className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rural %</span><div className="p-1.5 rounded-lg bg-slate-100 text-slate-700"><MapPin className="w-3.5 h-3.5" /></div></div>
        <div className="mt-2.5 flex items-baseline gap-1.5"><span className="text-2xl font-bold text-slate-900 tracking-tight">—</span></div>
        <p className="mt-1 text-[11px] text-slate-500 font-medium">Residence area is not in current API shape</p>
      </div>
    </div>
  );
};
