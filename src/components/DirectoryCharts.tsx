import React from 'react';
import { BarChart3, MapPin, Users } from 'lucide-react';
import { GlobalFilterState, Student } from '../types';

interface DirectoryChartsProps {
  students: Student[];
  filters: GlobalFilterState;
  onFilterChange: (filters: GlobalFilterState) => void;
}

const years = [2021, 2022, 2023, 2024, 2025];

const ChartShell = ({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon: React.ElementType; children: React.ReactNode }) => (
  <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
      <div className="p-1.5 rounded-md bg-slate-100 text-slate-700"><Icon className="w-4 h-4" /></div>
      <div><h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{title}</h3><p className="text-[11px] text-slate-500">{subtitle}</p></div>
    </div>
    {children}
  </section>
);

export const DirectoryCharts: React.FC<DirectoryChartsProps> = ({ students, filters, onFilterChange }) => {
  const genderGroups = ['Female', 'Male'].map(label => ({ label, count: students.filter(student => student.gender === label).length }));
  const batchGroups = years.map(year => ({ year, count: students.filter(student => student.academicYear === year).length }));
  const districtGroups = Array.from(new Set(students.map(student => student.district)))
    .map(district => ({ district, count: students.filter(student => student.district === district).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxGender = Math.max(...genderGroups.map(group => group.count), 1);
  const maxBatch = Math.max(...batchGroups.map(group => group.count), 1);
  const maxDistrict = Math.max(...districtGroups.map(group => group.count), 1);
  const noData = students.length === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <ChartShell title="Gender distribution" subtitle="Click a group to filter the table." icon={Users}>
        {noData ? <NoChartData /> : <div className="space-y-3">{genderGroups.map(group => <button type="button" key={group.label} onClick={() => onFilterChange({ ...filters, gender: filters.gender === group.label ? 'All' : group.label })} className="w-full text-left group"><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-700">{group.label}</span><span className="font-bold text-slate-900">{group.count}</span></div><div className="h-2 bg-slate-100 overflow-hidden"><div className={`h-full transition-all ${filters.gender === group.label ? 'bg-slate-900' : 'bg-slate-600 group-hover:bg-slate-800'}`} style={{ width: `${group.count / maxGender * 100}%` }} /></div></button>)}</div>}
      </ChartShell>
      <ChartShell title="Batch distribution" subtitle="Student records by admission year." icon={BarChart3}>
        {noData ? <NoChartData /> : <div className="flex items-end gap-2 h-32">{batchGroups.map(group => <button type="button" key={group.year} onClick={() => onFilterChange({ ...filters, academicYear: filters.academicYear === String(group.year) ? 'All Years' : String(group.year) })} className="h-full flex-1 flex flex-col items-center justify-end gap-1 group"><span className="text-[10px] font-bold text-slate-700">{group.count}</span><div className="w-full bg-slate-100 h-24 flex items-end"><div className={`w-full transition-all ${filters.academicYear === String(group.year) ? 'bg-slate-900' : 'bg-slate-600 group-hover:bg-slate-800'}`} style={{ height: `${group.count / maxBatch * 100}%` }} /></div><span className="text-[10px] text-slate-500">{group.year}</span></button>)}</div>}
      </ChartShell>
      <ChartShell title="Top districts" subtitle="Leading districts in the current population." icon={MapPin}>
        {noData || districtGroups.length === 0 ? <NoChartData /> : <div className="space-y-2.5">{districtGroups.map(group => <button type="button" key={group.district} onClick={() => onFilterChange({ ...filters, district: filters.district === group.district ? 'All Districts' : group.district })} className="w-full text-left group"><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-700 truncate pr-2">{group.district}</span><span className="font-bold text-slate-900">{group.count}</span></div><div className="h-2 bg-slate-100 overflow-hidden"><div className={`h-full transition-all ${filters.district === group.district ? 'bg-slate-900' : 'bg-slate-600 group-hover:bg-slate-800'}`} style={{ width: `${group.count / maxDistrict * 100}%` }} /></div></button>)}</div>}
      </ChartShell>
    </div>
  );
};

const NoChartData = () => <div className="h-32 flex items-center justify-center text-xs text-slate-400">No matching student data</div>;
