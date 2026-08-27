import React, { useState } from 'react';
import { PieChart, School } from 'lucide-react';
import { Student } from '../../types';

interface DemographicsSectionProps {
  students: Student[];
  allStudents: Student[];
  selectedGender: string;
  selectedSchoolType: string;
  onFilterGender: (gender: string) => void;
  onFilterSchoolType: (schoolType: string) => void;
}

export const DemographicsSection: React.FC<DemographicsSectionProps> = ({
  students,
  allStudents,
  selectedGender,
  selectedSchoolType,
  onFilterGender,
  onFilterSchoolType
}) => {
  const [genderViewMode, setGenderViewMode] = useState<'overall' | 'yearwise'>('overall');

  const totalStudents = students.length;

  // Gender counts
  const maleCount = students.filter(s => s.gender === 'Male').length;
  const femaleCount = students.filter(s => s.gender === 'Female').length;
  const otherCount = students.filter(s => s.gender === 'Other').length;

  const malePct = totalStudents > 0 ? Math.round((maleCount / totalStudents) * 100) : 0;
  const femalePct = totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0;
  const otherPct = totalStudents > 0 ? Math.max(0, 100 - malePct - femalePct) : 0;

  // Year-wise gender distribution
  const years = [2021, 2022, 2023, 2024, 2025];
  const yearwiseGender = years.map(y => {
    const yStudents = allStudents.filter(s => s.academicYear === y);
    const m = yStudents.filter(s => s.gender === 'Male').length;
    const f = yStudents.filter(s => s.gender === 'Female').length;
    const tot = yStudents.length;
    return {
      year: y,
      malePct: tot > 0 ? Math.round((m / tot) * 100) : 50,
      femalePct: tot > 0 ? Math.round((f / tot) * 100) : 50,
      maleCount: m,
      femaleCount: f,
      total: tot
    };
  });

  // School types breakdown
  const schoolTypeKeys = ['Private Matric', 'Government', 'CBSE/ICSE', 'Govt-Aided'] as const;
  const schoolTypeData = schoolTypeKeys.map(type => {
    const count = students.filter(s => s.schoolType === type).length;
    const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
    return {
      type,
      count,
      pct,
      isSelected: selectedSchoolType === type
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div id="demographics-section" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Chart 1: Gender Distribution */}
      <div id="chart-gender-distribution" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Gender Distribution
                </h3>
                <p className="text-[11px] text-slate-500">Student enrollment by gender</p>
              </div>
            </div>

            {/* Toggle: Overall vs Year-wise */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
              <button
                onClick={() => setGenderViewMode('overall')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                  genderViewMode === 'overall'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Overall
              </button>
              <button
                onClick={() => setGenderViewMode('yearwise')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                  genderViewMode === 'yearwise'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Year-wise
              </button>
            </div>
          </div>

          {genderViewMode === 'overall' ? (
            <div className="space-y-4 pt-2">
              {/* Visual Multi-Segment Bar */}
              <div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    className="bg-slate-800 transition-all duration-500 hover:opacity-90 cursor-pointer"
                    style={{ width: `${femalePct}%` }}
                    title={`Female: ${femaleCount} (${femalePct}%)`}
                    onClick={() => onFilterGender(selectedGender === 'Female' ? 'All' : 'Female')}
                  ></div>
                  <div
                    className="bg-slate-400 transition-all duration-500 hover:opacity-90 cursor-pointer"
                    style={{ width: `${malePct}%` }}
                    title={`Male: ${maleCount} (${malePct}%)`}
                    onClick={() => onFilterGender(selectedGender === 'Male' ? 'All' : 'Male')}
                  ></div>
                  {otherCount > 0 && (
                    <div
                      className="bg-slate-300 transition-all duration-500"
                      style={{ width: `${otherPct}%` }}
                      title={`Other: ${otherCount} (${otherPct}%)`}
                    ></div>
                  )}
                </div>
              </div>

              {/* Legend Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div
                  onClick={() => onFilterGender(selectedGender === 'Female' ? 'All' : 'Female')}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    selectedGender === 'Female'
                      ? 'bg-slate-100 border-slate-400 ring-1 ring-slate-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 shrink-0"></span>
                    <span className="text-xs font-semibold text-slate-700">Female</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className="text-lg font-bold text-slate-900">{femalePct}%</span>
                    <span className="text-xs text-slate-500 font-medium">{femaleCount} students</span>
                  </div>
                </div>

                <div
                  onClick={() => onFilterGender(selectedGender === 'Male' ? 'All' : 'Male')}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    selectedGender === 'Male'
                      ? 'bg-slate-100 border-slate-400 ring-1 ring-slate-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                    <span className="text-xs font-semibold text-slate-700">Male</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className="text-lg font-bold text-slate-900">{malePct}%</span>
                    <span className="text-xs text-slate-500 font-medium">{maleCount} students</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Year-Wise Distribution Breakdown */
            <div className="space-y-2.5 pt-1">
              {yearwiseGender.map(y => (
                <div key={y.year} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="font-bold text-slate-900">Batch {y.year}</span>
                    <span className="text-[11px] text-slate-500">
                      F: {y.femalePct}% &middot; M: {y.malePct}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-slate-800 h-full" style={{ width: `${y.femalePct}%` }}></div>
                    <div className="bg-slate-400 h-full" style={{ width: `${y.malePct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click on any gender pill above to apply as dashboard filter.</span>
          <span className="font-semibold text-slate-700">Total: {totalStudents}</span>
        </div>
      </div>

      {/* Chart 2: School Type Distribution */}
      <div id="chart-school-type-distribution" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                <School className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  School Type Distribution
                </h3>
                <p className="text-[11px] text-slate-500">Prior secondary schooling origin</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Sorted Descending</span>
          </div>

          <div className="space-y-3 pt-1">
            {schoolTypeData.map(item => (
              <div
                key={item.type}
                onClick={() => onFilterSchoolType(selectedSchoolType === item.type ? 'All School Types' : item.type)}
                className={`p-2.5 rounded-lg border transition cursor-pointer group ${
                  item.isSelected
                    ? 'bg-slate-100 border-slate-400 ring-1 ring-slate-400'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 group-hover:text-slate-950">
                    {item.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.count} students</span>
                    <span className="text-[11px] font-semibold text-slate-500">({item.pct}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isSelected ? 'bg-slate-900' : 'bg-slate-600 group-hover:bg-slate-700'
                    }`}
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click any schooling row to filter active dataset.</span>
          <span className="font-semibold text-slate-700">Govt Quota: 7.5% Included</span>
        </div>
      </div>
    </div>
  );
};
