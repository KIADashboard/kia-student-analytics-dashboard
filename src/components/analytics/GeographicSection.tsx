import React, { useState } from 'react';
import { MapPin, Globe } from 'lucide-react';
import { Student } from '../../types';
import { DISTRICT_LIST } from '../../data/mockStudents';

interface GeographicSectionProps {
  students: Student[];
  selectedDistrict: string;
  onFilterDistrict: (district: string) => void;
}

export const GeographicSection: React.FC<GeographicSectionProps> = ({
  students,
  selectedDistrict,
  onFilterDistrict
}) => {
  const [viewScope, setViewScope] = useState<'top10' | 'all'>('top10');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const totalStudents = students.length;

  const districtData = DISTRICT_LIST
    .filter(d => d !== 'All Districts')
    .map(name => {
      const count = students.filter(s => s.district === name).length;
      const pct = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(1) : '0.0';
      const avgMarks = count > 0 
        ? (students.filter(s => s.district === name).reduce((acc, s) => acc + s.marksPercentage, 0) / count).toFixed(1)
        : '0.0';
      return {
        name,
        count,
        pct: parseFloat(pct),
        avgMarks: parseFloat(avgMarks),
        isSelected: selectedDistrict === name
      };
    })
    .sort((a, b) => b.count - a.count);

  const displayDistricts = viewScope === 'top10' ? districtData.slice(0, 10) : districtData;
  const maxCount = Math.max(...displayDistricts.map(d => d.count), 1);

  return (
    <div id="geographic-section" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Geographic Distribution — Students by District
            </h3>
            <p className="text-[11px] text-slate-500">
              Feeder regional demographics and origin distribution across Tamil Nadu
            </p>
          </div>
        </div>

        {/* View Scope Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewScope('top10')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition ${
              viewScope === 'top10'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Top 10 Districts
          </button>
          <button
            onClick={() => setViewScope('all')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition ${
              viewScope === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Districts ({districtData.length})
          </button>
        </div>
      </div>

      {/* Horizontal Bar Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 pt-1">
        {displayDistricts.map((dist, idx) => {
          const widthPct = (dist.count / maxCount) * 100;
          const isHovered = hoveredDistrict === dist.name;

          return (
            <div
              key={dist.name}
              onMouseEnter={() => setHoveredDistrict(dist.name)}
              onMouseLeave={() => setHoveredDistrict(null)}
              onClick={() => onFilterDistrict(selectedDistrict === dist.name ? 'All Districts' : dist.name)}
              className={`p-2.5 rounded-lg border transition cursor-pointer relative group ${
                dist.isSelected
                  ? 'bg-slate-100 border-slate-400 ring-1 ring-slate-400'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/60'
              }`}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-11 right-3 z-20 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-md shadow-md pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  <span>{dist.name}: {dist.count} students &middot; {dist.avgMarks}% Avg Marks</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 group-hover:text-slate-950">
                  <span className="text-[10px] text-slate-400 font-mono w-4">#{idx + 1}</span>
                  <span>{dist.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{dist.count} students</span>
                  <span className="text-[11px] text-slate-500 font-medium">({dist.pct}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dist.isSelected ? 'bg-slate-900' : 'bg-slate-600 group-hover:bg-slate-700'
                  }`}
                  style={{ width: `${Math.max(widthPct, 2)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1">
        <span>Click any district above to filter students by their home geographic location.</span>
        <span className="font-semibold text-slate-700">
          Leading Region: {districtData[0]?.name || 'Coimbatore'} ({districtData[0]?.pct || 0}%)
        </span>
      </div>
    </div>
  );
};
