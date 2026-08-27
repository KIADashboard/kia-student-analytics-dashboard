import React from 'react';
import { Lightbulb, BarChart3, Users, MapPin, Award, GraduationCap, School } from 'lucide-react';
import { Student } from '../../types';

interface KeyInsightsSectionProps {
  students: Student[];
  allStudents: Student[];
}

export const KeyInsightsSection: React.FC<KeyInsightsSectionProps> = ({
  students,
  allStudents
}) => {
  const total = students.length;
  const percentage = (count: number) => total > 0 ? `${Math.round((count / total) * 100)}%` : 'No data available';
  const batchCounts = [2021, 2022, 2023, 2024, 2025].map(year => ({ year, count: allStudents.filter(student => student.academicYear === year).length }));
  const largestBatch = batchCounts.reduce((largest, current) => current.count > largest.count ? current : largest, batchCounts[0]);
  const firstYear = allStudents.filter(student => student.academicYear === 2021);
  const lastYear = allStudents.filter(student => student.academicYear === 2025);
  const firstAverage = firstYear.length > 0 ? firstYear.reduce((sum, student) => sum + student.hscMarks, 0) / firstYear.length : null;
  const lastAverage = lastYear.length > 0 ? lastYear.reduce((sum, student) => sum + student.hscMarks, 0) / lastYear.length : null;
  const districtCounts = Array.from(new Set(students.map(student => student.district))).map(district => ({ district, count: students.filter(student => student.district === district).length }));
  const topDistrict = districtCounts.sort((a, b) => b.count - a.count)[0];
  const insights = [
    { label: 'Batch size', icon: BarChart3, text: `${largestBatch.year} has the largest student cohort across the five-year dataset (${largestBatch.count} records).` },
    { label: 'Gender composition', icon: Users, text: total > 0 ? `Female students represent ${percentage(students.filter(student => student.gender === 'Female').length)} of the selected population.` : 'No gender data is available for the selected population.' },
    { label: 'Academic trend', icon: Award, text: firstAverage !== null && lastAverage !== null ? `Average XII marks ${lastAverage >= firstAverage ? 'increased' : 'decreased'} from ${firstAverage.toFixed(1)} in 2021 to ${lastAverage.toFixed(1)} in 2025.` : 'XII mark trend data is incomplete for 2021 or 2025.' },
    { label: 'First-generation representation', icon: GraduationCap, text: total > 0 ? `${percentage(students.filter(student => student.firstGenerationGraduate).length)} of students in the selected population are first-generation graduates.` : 'No first-generation data is available for the selected population.' },
    { label: 'Geographic concentration', icon: MapPin, text: topDistrict ? `The largest student representation comes from ${topDistrict.district} (${topDistrict.count} records).` : 'No district data is available for the selected population.' },
    { label: 'School & agriculture', icon: School, text: total > 0 ? `Government-school students represent ${percentage(students.filter(student => student.schoolType === 'Government').length)} and students reporting a farming family background represent ${percentage(students.filter(student => student.agricultureBackground === 'Yes').length)} of the selected population.` : 'No school or agricultural background data is available for the selected population.' },
  ];

  return (
    <section id="key-insights-section" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4"><div className="p-1.5 rounded-md bg-slate-100 text-slate-700"><Lightbulb className="w-4 h-4" /></div><div><h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Insights</h3><p className="text-[11px] text-slate-500">Observed patterns calculated from the selected student records.</p></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{insights.map(({ label, icon: Icon, text }) => <div key={label} className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 flex gap-3"><Icon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" /><div><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span><p className="text-[11px] text-slate-700 leading-relaxed mt-1">{text}</p></div></div>)}</div>
    </section>
  );
};
