import React from 'react';
import { IndianRupee, Sprout, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Student, IncomeCategory } from '../../types';

interface SocioeconomicSectionProps {
  students: Student[];
}

export const SocioeconomicSection: React.FC<SocioeconomicSectionProps> = ({
  students
}) => {
  const totalStudents = students.length;

  const incomeTiers: IncomeCategory[] = [
    '< ₹1 Lakh',
    '₹1L – ₹3L',
    '₹3L – ₹6L',
    '₹6L – ₹10L',
    '> ₹10 Lakh'
  ];

  // Income Distribution & Marks Breakdown
  const incomeData = incomeTiers.map(tier => {
    const matched = students.filter(s => s.incomeCategory === tier);
    const count = matched.length;
    const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
    const avgMarks = count > 0
      ? (matched.reduce((acc, s) => acc + s.marksPercentage, 0) / count).toFixed(1)
      : '0.0';
    return {
      tier,
      count,
      pct,
      avgMarks: parseFloat(avgMarks)
    };
  });

  const maxIncomeCount = Math.max(...incomeData.map(i => i.count), 1);

  // Agriculture Background
  const agriYes = students.filter(s => s.agricultureBackground === 'Yes');
  const agriNo = students.filter(s => s.agricultureBackground === 'No');
  
  const agriYesAvg = agriYes.length > 0 
    ? (agriYes.reduce((acc, s) => acc + s.marksPercentage, 0) / agriYes.length).toFixed(1) 
    : '0.0';
  const agriNoAvg = agriNo.length > 0 
    ? (agriNo.reduce((acc, s) => acc + s.marksPercentage, 0) / agriNo.length).toFixed(1) 
    : '0.0';

  const agriYesPct = totalStudents > 0 ? Math.round((agriYes.length / totalStudents) * 100) : 0;
  const agriNoPct = totalStudents > 0 ? Math.round((agriNo.length / totalStudents) * 100) : 0;

  // First Generation Graduate
  const firstGenCount = students.filter(s => s.firstGenerationGraduate).length;
  const firstGenPct = totalStudents > 0 ? Math.round((firstGenCount / totalStudents) * 100) : 0;

  return (
    <div id="socioeconomic-section" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Family Income Distribution & Performance Correlation */}
      <div id="card-income-distribution" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Family Income Distribution
                </h3>
                <p className="text-[11px] text-slate-500">Annual household income brackets & academic average</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Income vs Marks</span>
          </div>

          <div className="space-y-3 pt-1">
            {incomeData.map(item => (
              <div key={item.tier} className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{item.tier}</span>
                    <span className="text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {item.avgMarks}% Avg Marks
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{item.count} students</span>
                    <span className="text-[11px] text-slate-500 font-medium">({item.pct}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-700 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxIncomeCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Fee concessions available for &lt; ₹3 Lakh brackets.</span>
          <span className="font-semibold text-slate-700">Total: {totalStudents}</span>
        </div>
      </div>

      {/* 2. Agriculture & First Generation Graduate Background */}
      <div id="card-agri-background" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Agricultural & First-Gen Background
                </h3>
                <p className="text-[11px] text-slate-500">Rural demographics and affirmative scheme indicators</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Social Equity</span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Agriculture Ratio */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                <span>Agriculture Background Spread</span>
                <span className="text-slate-500 text-[11px]">{agriYes.length} Yes / {agriNo.length} No</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="bg-slate-800 h-full transition-all"
                  style={{ width: `${agriYesPct}%` }}
                  title={`Agri Background: ${agriYesPct}%`}
                ></div>
                <div
                  className="bg-slate-400 h-full transition-all"
                  style={{ width: `${agriNoPct}%` }}
                  title={`Non-Agri: ${agriNoPct}%`}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-medium text-slate-600 mt-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                  Agri Family: {agriYesPct}% ({agriYesAvg}% Avg Marks)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Non-Agri: {agriNoPct}% ({agriNoAvg}% Avg Marks)
                </span>
              </div>
            </div>

            {/* First Generation Graduate Card */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-700" />
                  <span>First Generation Graduates</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Eligible for TN First Graduate Scheme waiver
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{firstGenPct}%</div>
                <div className="text-[10px] text-slate-500 font-medium">{firstGenCount} students</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Equal academic outcomes across background tiers.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
