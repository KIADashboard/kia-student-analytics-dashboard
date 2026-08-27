import React, { useState } from 'react';
import { TrendingUp, Users, UserPlus } from 'lucide-react';
import { Student } from '../../types';

interface EnrollmentTrendChartProps {
  students: Student[];
  allStudents: Student[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
}

export const EnrollmentTrendChart: React.FC<EnrollmentTrendChartProps> = ({
  students,
  allStudents,
  selectedYear,
  onSelectYear
}) => {
  const [metricMode, setMetricMode] = useState<'students' | 'admissions'>('students');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const years = [2021, 2022, 2023, 2024, 2025];

  const trendData = years.map((year, idx) => {
    const yearStudents = allStudents.filter(s => s.academicYear === year);
    const inScopeCount = students.filter(s => s.academicYear === year).length;
    const count = yearStudents.length;
    const prevCount = idx > 0 ? allStudents.filter(s => s.academicYear === years[idx - 1]).length : null;

    const growthPct = prevCount
      ? (((count - prevCount) / prevCount) * 100).toFixed(1)
      : null;

    return {
      year,
      count,
      sampleCount: inScopeCount,
      totalSample: yearStudents.length,
      growthPct,
      isSelected: selectedYear === year.toString()
    };
  });

  const maxVal = Math.max(...trendData.map(d => d.count), 1) * 1.15;

  return (
    <div id="enrollment-trend-card" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
      {/* Header with Title and Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student Enrollment Trend
              </h3>
              <p className="text-[11px] text-slate-500">
                Student population across academic years (2021–2025)
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 self-start sm:self-auto">
          <button
            id="toggle-metric-students"
            onClick={() => setMetricMode('students')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
              metricMode === 'students'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Students</span>
          </button>
          <button
            id="toggle-metric-admissions"
            onClick={() => setMetricMode('admissions')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
              metricMode === 'admissions'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3 h-3" />
            <span>Admissions</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas / Bar Area */}
      <div className="relative pt-6 pb-2">
        <div className="grid grid-cols-5 gap-3 sm:gap-6 items-end h-52">
          {trendData.map((d, index) => {
            const heightPct = (d.count / maxVal) * 100;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={d.year}
                className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectYear(selectedYear === d.year.toString() ? 'All Years' : d.year.toString())}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="font-bold flex items-center gap-1">
                      <span>Batch {d.year}</span>
                      {d.growthPct && (
                        <span className="text-emerald-300 text-[10px]">
                          (+{d.growthPct}%)
                        </span>
                      )}
                    </div>
                    <div className="text-slate-300 text-[10px]">
                      {d.count} students in dataset &middot; {d.sampleCount} in active filter
                    </div>
                  </div>
                )}

                {/* Bar Value on Top */}
                <span className={`text-[11px] font-bold mb-1.5 transition ${
                  d.isSelected ? 'text-slate-950 font-extrabold' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {d.count}
                </span>

                {/* Animated Interactive Bar */}
                <div className="w-full max-w-14 bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      d.isSelected
                        ? 'bg-slate-900 shadow-md ring-2 ring-slate-400'
                        : isHovered
                        ? 'bg-slate-700'
                        : 'bg-slate-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  ></div>
                </div>

                {/* Year Label */}
                <div className="mt-3 text-center">
                  <span className={`text-xs font-bold transition ${
                    d.isSelected
                      ? 'text-slate-950 px-2 py-0.5 bg-slate-200 rounded'
                      : 'text-slate-600 group-hover:text-slate-900'
                  }`}>
                    {d.year}
                  </span>
                  {d.growthPct && (
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                      +{d.growthPct}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Base Guideline */}
        <div className="w-full h-px bg-slate-200 mt-2"></div>
      </div>

      {/* Footer Helper Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1">
        <span>Click any batch column above to filter the entire dashboard by that academic year.</span>
        <span className="font-semibold text-slate-700">Source records: {allStudents.length}</span>
      </div>
    </div>
  );
};
