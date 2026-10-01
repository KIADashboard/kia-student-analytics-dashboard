import React, { useMemo, useState } from 'react';
import { Student } from '../../types';
import { AdminBarChart, AdminLineChart } from './AdminChart';
import { batchOptions, mean, studentsForBatch } from './adminData';

const chartPalette = ['#1f5f52', '#c28a35', '#527aa5', '#75679a', '#b65d5d'];

export function AcademicPerformancePage({ students }: { students: Student[] }) {
  const [batch, setBatch] = useState('all');
  const data = useMemo(() => studentsForBatch(students, batch), [students, batch]);
  const semesterRows = Array.from({ length: 8 }, (_, index) => {
    const values = data.flatMap(student => student.semesterGrades.filter(grade => grade.semester === `Sem ${index + 1}`).map(grade => grade.gpa));
    return { label: `Sem ${index + 1}`, average: mean(values), count: values.length };
  }).filter(row => row.count > 0);
  const distribution = [
    ['Below 6.0', data.filter(student => student.cgpa < 6).length],
    ['6.0–6.9', data.filter(student => student.cgpa >= 6 && student.cgpa < 7).length],
    ['7.0–7.9', data.filter(student => student.cgpa >= 7 && student.cgpa < 8).length],
    ['8.0–8.9', data.filter(student => student.cgpa >= 8 && student.cgpa < 9).length],
    ['9.0+', data.filter(student => student.cgpa >= 9).length]
  ];
  const latestGpas = data.map(student => student.semesterGrades.at(-1)?.gpa ?? 0).filter(Boolean);
  const passRate = data.length ? ((data.length - data.filter(student => student.backlogs > 0).length) / data.length) * 100 : 0;
  const cards = [['Average CGPA', mean(data.map(student => student.cgpa)).toFixed(2), 'Current academic average'], ['Average SGPA', mean(latestGpas).toFixed(2), 'Latest completed semester'], ['Pass Percentage', `${passRate.toFixed(1)}%`, 'Students without active arrears'], ['Multiple Arrears', data.filter(student => student.backlogs >= 2).length.toString(), 'Students with 2+ arrears']];
  const subjects = data.flatMap(student => student.recentSubjects).reduce<Record<string, { total: number; count: number }>>((result, subject) => { result[subject.name] ??= { total: 0, count: 0 }; result[subject.name].total += subject.gradePoint; result[subject.name].count += 1; return result; }, {});
  const topSubjects = Object.entries(subjects).map(([name, value]) => ({ name, average: value.total / value.count })).sort((left, right) => right.average - left.average).slice(0, 6);

  return <>
    <div className="admin-page-heading-row"><div><span className="admin-section-label">ACADEMIC PERFORMANCE</span><h2>Academic Performance</h2><p>Review performance across batches, semesters and subjects.</p></div><select className="admin-large-filter" value={batch} onChange={event => setBatch(event.target.value)} aria-label="Academic batch">{batchOptions.map(option => <option key={option} value={option}>{option === 'all' ? 'All Batches' : option}</option>)}</select></div>
    <div className="admin-metric-grid">{cards.map(([label, value, detail]) => <article className="admin-metric-card" key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>)}</div>
    <div className="admin-chart-grid two-columns"><section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">CGPA DISTRIBUTION</span><h3>Academic Distribution</h3></div></div><div className="admin-chart-box"><AdminBarChart data={{ labels: distribution.map(([label]) => String(label)), datasets: [{ label: 'Students', data: distribution.map(([, value]) => Number(value)), backgroundColor: chartPalette[0], borderRadius: 5, maxBarThickness: 40 }] }} /></div></section><section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">SEMESTER PERFORMANCE</span><h3>Semester-wise Average GPA</h3></div></div><div className="admin-chart-box"><AdminLineChart data={{ labels: semesterRows.map(row => row.label), datasets: [{ label: 'Average GPA', data: semesterRows.map(row => row.average), borderColor: chartPalette[2], backgroundColor: `${chartPalette[2]}22`, borderWidth: 2, tension: 0.3, fill: true, pointRadius: 3 }] }} /></div></section></div>
    <section className="admin-panel admin-subject-panel"><div className="admin-panel-header"><div><span className="admin-section-label">SUBJECT ANALYSIS</span><h3>Subject-wise Performance</h3></div></div><div className="admin-subject-performance-grid">{topSubjects.map(subject => <div className="admin-subject-row" key={subject.name}><span>{subject.name}</span><div className="admin-subject-meter"><i style={{ width: `${subject.average * 10}%` }} /></div><strong>{(subject.average * 10).toFixed(0)}%</strong></div>)}</div></section>
  </>;
}
