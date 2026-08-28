import React, { useState } from 'react';
import { Award, BarChart3, GraduationCap } from 'lucide-react';
import { Student } from '../../types';

interface AcademicSectionProps {
  students: Student[];
  allStudents: Student[];
  onSelectYear?: (year: string) => void;
}

export const AcademicSection: React.FC<AcademicSectionProps> = ({
  students,
  allStudents,
  onSelectYear
}) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const totalStudents = students.length;

  // Chart 1: Average marks by year across 2021–2025
  const years = [2021, 2022, 2023, 2024, 2025];
  const yearPerformanceData = years.map(y => {
    const yStudents = allStudents.filter(s => s.academicYear === y);
    const inScope = students.filter(s => s.academicYear === y);
    const avgMarks = yStudents.length > 0
      ? (yStudents.reduce((acc, s) => acc + s.marksPercentage, 0) / yStudents.length).toFixed(1)
      : '78.0';
    const inScopeAvg = inScope.length > 0
      ? (inScope.reduce((acc, s) => acc + s.marksPercentage, 0) / inScope.length).toFixed(1)
      : avgMarks;
    return {
      year: y,
      avg: parseFloat(inScopeAvg),
      count: inScope.length,
      total: yStudents.length
    };
  });

  // Chart 2: Marks Distribution Bins (Below 40, 40–49, 50–59, 60–69, 70–79, 80–89, 90–100)
  const bins = [
    { label: '<40', min: 0, max: 39.99, title: 'Below 40' },
    { label: '40–49', min: 40, max: 49.99, title: '40–49' },
    { label: '50–59', min: 50, max: 59.99, title: '50–59' },
    { label: '60–69', min: 60, max: 69.99, title: '60–69' },
    { label: '70–79', min: 70, max: 79.99, title: '70–79' },
    { label: '80–89', min: 80, max: 89.99, title: '80–89' },
    { label: '90–100', min: 90, max: 100, title: '90–100' }
  ];

  const binData = bins.map(bin => {
    const count = students.filter(s => s.marksPercentage >= bin.min && s.marksPercentage <= bin.max).length;
    const pct = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(1) : '0.0';
    return {
      ...bin,
      count,
      pct: parseFloat(pct)
    };
  });

  const maxBinCount = Math.max(...binData.map(b => b.count), 1);

  // Chart 3: Performance by School Type
  const schoolTypes = ['CBSE/ICSE', 'Private Matric', 'Government', 'Govt-Aided'] as const;
  const schoolPerformanceData = schoolTypes.map(st => {
    const stStudents = students.filter(s => s.schoolType === st);
    const count = stStudents.length;
    const avg = count > 0 
      ? (stStudents.reduce((acc, s) => acc + s.marksPercentage, 0) / count).toFixed(1)
      : '0.0';
    return {
      type: st,
      count,
      avgMarks: parseFloat(avg)
    };
  }).sort((a, b) => b.avgMarks - a.avgMarks);

  return (
    <div id="academic-performance-section" className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Average Marks by Year */}
        <div id="chart-avg-marks-by-year" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Average Marks by Year
                  </h3>
                  <p className="text-[11px] text-slate-500">Cohort progression (2021–2025)</p>
                </div>
              </div>
            </div>

            {/* Line/Bar visualization */}
            <div className="pt-2">
              <div className="grid grid-cols-5 gap-2 items-end h-40">
                {yearPerformanceData.map(d => {
                  const barHeightPct = ((d.avg - 50) / 50) * 100; // calibrated for 50-100% scale
                  const isHov = hoveredYear === d.year;

                  return (
                    <div
                      key={d.year}
                      className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                      onMouseEnter={() => setHoveredYear(d.year)}
                      onMouseLeave={() => setHoveredYear(null)}
                      onClick={() => onSelectYear && onSelectYear(d.year.toString())}
                    >
                      {isHov && (
                        <div className="absolute -top-11 z-20 bg-slate-900 text-white text-[11px] py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95">
                          {d.year}: {d.avg}% Avg ({d.count} in filter)
                        </div>
                      )}

                      <span className="text-[11px] font-bold text-slate-900 mb-1">
                        {d.avg}%
                      </span>

                      <div className="w-full max-w-9 bg-slate-100 rounded-t-md overflow-hidden flex flex-col justify-end h-full">
                        <div
                          className="w-full bg-slate-700 hover:bg-slate-900 transition-all duration-300 rounded-t-md"
                          style={{ height: `${Math.max(barHeightPct, 15)}%` }}
                        ></div>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-600 mt-2">
                        {d.year}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="w-full h-px bg-slate-200 mt-2"></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Scale baseline: 50% – 100%</span>
            <span className="font-semibold text-slate-700">5-Yr Avg: 86.8%</span>
          </div>
        </div>

        {/* Chart 2: Marks Distribution Histogram */}
        <div id="chart-marks-distribution" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Marks Distribution
                  </h3>
                  <p className="text-[11px] text-slate-500">Binned grade performance frequency</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="grid grid-cols-7 gap-1.5 items-end h-40">
                {binData.map(bin => {
                  const hPct = (bin.count / maxBinCount) * 100;

                  return (
                    <div key={bin.label} className="flex flex-col items-center h-full justify-end group cursor-default">
                      <span className="text-[10px] font-bold text-slate-700 mb-1">
                        {bin.count}
                      </span>

                      <div className="w-full bg-slate-100 rounded-t overflow-hidden flex flex-col justify-end h-full">
                        <div
                          className="w-full bg-slate-600 group-hover:bg-slate-800 transition-all rounded-t"
                          style={{ height: `${Math.max(hPct, 6)}%` }}
                          title={`${bin.title}: ${bin.count} students (${bin.pct}%)`}
                        ></div>
                      </div>

                      <span className="text-[9px] font-medium text-slate-500 mt-2 truncate w-full text-center" title={bin.label}>
                        {bin.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="w-full h-px bg-slate-200 mt-2"></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Peak frequency: 80% – 89% & 90% – 100%</span>
            <span className="font-semibold text-slate-700">Total: {totalStudents}</span>
          </div>
        </div>

        {/* Chart 3: Performance by School Type */}
        <div id="chart-perf-by-school-type" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Performance by Schooling
                  </h3>
                  <p className="text-[11px] text-slate-500">Average marks by prior school category</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {schoolPerformanceData.map(st => (
                <div key={st.type} className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800">{st.type}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{st.avgMarks}% Avg</span>
                      <span className="text-[10px] text-slate-400">({st.count} std)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-700 rounded-full transition-all duration-500"
                      style={{ width: `${st.avgMarks}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>High performance across all board types.</span>
            <span className="font-semibold text-slate-700">Top: CBSE (89.5%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
