import React, { useState } from 'react';
import { Building2, Layers } from 'lucide-react';
import { Student } from '../../types';
import { QUOTA_LIST } from '../../data/mockStudents';

interface AdmissionSectionProps {
  students: Student[];
  allStudents: Student[];
  selectedQuota: string;
  onFilterQuota: (quota: string) => void;
}

export const AdmissionSection: React.FC<AdmissionSectionProps> = ({
  students,
  allStudents,
  selectedQuota,
  onFilterQuota
}) => {
  const totalStudents = students.length;

  const quotas = [
    'Merit (Govt Quota)',
    'First Graduate Quota',
    '7.5% Govt School Quota',
    'Management Quota',
    'Sports Quota',
    'Lateral Entry'
  ];

  const quotaColorMap: Record<string, string> = {
    'Merit (Govt Quota)': 'bg-slate-800',
    'First Graduate Quota': 'bg-slate-600',
    '7.5% Govt School Quota': 'bg-slate-500',
    'Management Quota': 'bg-slate-400',
    'Sports Quota': 'bg-slate-300',
    'Lateral Entry': 'bg-slate-200'
  };

  // Quota breakdown for current selection
  const quotaData = quotas.map(quotaName => {
    const count = students.filter(s => s.quota === quotaName).length;
    const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
    return {
      name: quotaName,
      count,
      pct,
      isSelected: selectedQuota === quotaName
    };
  }).sort((a, b) => b.count - a.count);

  // Stacked Quota Trend across years 2021–2025
  const years = [2021, 2022, 2023, 2024, 2025];
  const stackedYearData = years.map(y => {
    const yStudents = allStudents.filter(s => s.academicYear === y);
    const yTot = yStudents.length || 1;
    const breakdown = quotas.map(q => {
      const qCount = yStudents.filter(s => s.quota === q).length;
      const qPct = Math.round((qCount / yTot) * 100);
      return { quota: q, count: qCount, pct: qPct };
    });
    return {
      year: y,
      total: yTot,
      breakdown
    };
  });

  return (
    <div id="admission-section" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Chart 1: Admission by Quota */}
      <div id="chart-admission-by-quota" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Admission by Quota Stream
                </h3>
                <p className="text-[11px] text-slate-500">Intake stream breakdown for current filter</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Quota Matrix</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {quotaData.map(q => (
              <div
                key={q.name}
                onClick={() => onFilterQuota(selectedQuota === q.name ? 'All Quotas' : q.name)}
                className={`p-2.5 rounded-lg border transition cursor-pointer group ${
                  q.isSelected
                    ? 'bg-slate-100 border-slate-400 ring-1 ring-slate-400'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-xs ${quotaColorMap[q.name] || 'bg-slate-600'}`}></span>
                    <span className="font-semibold text-slate-800 group-hover:text-slate-950">
                      {q.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{q.count} seats</span>
                    <span className="text-[11px] font-semibold text-slate-500">({q.pct}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      q.isSelected ? 'bg-slate-900' : 'bg-slate-700 group-hover:bg-slate-800'
                    }`}
                    style={{ width: `${q.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click any quota stream to isolate that cohort.</span>
          <span className="font-semibold text-slate-700">Total: {totalStudents}</span>
        </div>
      </div>

      {/* Chart 2: Quota Trend Across Years (Stacked Bar) */}
      <div id="chart-quota-trend-years" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Quota Trend Across Years (2021–2025)
                </h3>
                <p className="text-[11px] text-slate-500">Stacked admission distribution cohorts</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Longitudinal</span>
          </div>

          {/* Stacked Bars */}
          <div className="space-y-4 pt-2">
            {stackedYearData.map(y => (
              <div key={y.year} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="font-bold text-slate-900">Batch {y.year}</span>
                  <span className="text-[11px] text-slate-500">{y.total} total sample</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-md overflow-hidden flex shadow-inner">
                  {y.breakdown.map((item, i) => (
                    <div
                      key={i}
                      className={`${quotaColorMap[item.quota] || 'bg-slate-400'} h-full transition-all duration-300 hover:opacity-90 cursor-pointer`}
                      style={{ width: `${item.pct}%` }}
                      title={`${item.quota}: ${item.pct}%`}
                      onClick={() => onFilterQuota(selectedQuota === item.quota ? 'All Quotas' : item.quota)}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Legend */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-2.5">
            {quotas.map(q => (
              <button
                key={q}
                onClick={() => onFilterQuota(selectedQuota === q ? 'All Quotas' : q)}
                className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded transition ${
                  selectedQuota === q
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-xs ${quotaColorMap[q]}`}></span>
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Legend items are interactive click filters.</span>
          <span className="font-semibold text-slate-700">Govt Scheme: 100% Verified</span>
        </div>
      </div>
    </div>
  );
};
