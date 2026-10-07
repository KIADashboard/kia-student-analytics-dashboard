import React, { useMemo, useState } from 'react';
import { ArrowRight, Award, BookOpen, CircleAlert, GraduationCap, UsersRound } from 'lucide-react';
import { Student } from '../../types';
import { AdminBarChart, AdminLineChart } from './AdminChart';
import { batchOptions, countsFor, mean, studentsForBatch } from './adminData';
import { AdminPage } from './AdminSidebar';

const colors = ['#1f5f52', '#c28a35', '#527aa5', '#75679a'];

export function OverviewPage({ students, onNavigate }: { students: Student[]; onNavigate: (page: AdminPage) => void }) {
  const [batch, setBatch] = useState('all');
  const data = useMemo(() => studentsForBatch(students, batch), [students, batch]);
  const arrears = data.filter(student => student.backlogs > 0);
  const cgpa = mean(data.map(student => student.cgpa));
  const attendance = mean(data.map(student => student.attendance));
  const genderCounts = countsFor(data, student => student.gender);
  const trendYears = ['2021', '2022', '2023', '2024', '2025'];
  const trend = trendYears.map(year => mean(studentsForBatch(students, year).map(student => student.cgpa)));
  const batchCounts = trendYears.map(year => studentsForBatch(students, year).length);
  const kpis = [
    { label: 'Total Students', value: data.length.toLocaleString(), foot: 'Active student records', icon: UsersRound, tone: 'green' },
    { label: 'Average CGPA', value: cgpa.toFixed(2), foot: 'Institutional average', icon: Award, tone: 'blue' },
    { label: 'Average Attendance', value: `${attendance.toFixed(1)}%`, foot: 'Across selected students', icon: BookOpen, tone: 'purple' },
    { label: 'Students With Arrears', value: arrears.length.toLocaleString(), foot: 'Requires monitoring', icon: CircleAlert, tone: 'amber' }
  ];

  return (
    <>
      <div className="admin-page-heading-row">
        <div><span className="admin-section-label">COLLEGE ADMINISTRATION</span><h2>College Overview</h2><p>A consolidated view of student strength, academic performance and institutional indicators.</p></div>
        <label className="admin-batch-selector"><span>View Batch</span><select value={batch} onChange={event => setBatch(event.target.value)}>{batchOptions.map(option => <option key={option} value={option}>{option === 'all' ? 'All Batches' : option}</option>)}</select></label>
      </div>
      <div className="admin-kpi-grid">{kpis.map(({ label, value, foot, icon: Icon, tone }) => <article className="admin-kpi-card" key={label}><div className="admin-kpi-top"><span>{label}</span><span className={`admin-kpi-icon ${tone}`}><Icon size={16} /></span></div><strong>{value}</strong><div className="admin-kpi-foot">{foot}</div></article>)}</div>
      <div className="admin-mini-stat-grid">
        <div><span>Male Students</span><strong>{genderCounts.Male ?? 0}</strong></div><div><span>Female Students</span><strong>{genderCounts.Female ?? 0}</strong></div>
        <div><span>Hostel Students</span><strong>{data.filter(student => student.residentialType !== 'Day Scholar').length}</strong></div><div><span>Day Scholars</span><strong>{data.filter(student => student.residentialType === 'Day Scholar').length}</strong></div>
        <div><span>No Arrears</span><strong>{data.length - arrears.length}</strong></div><div><span>Graduation Eligible</span><strong>{data.filter(student => student.creditsEarned >= student.totalCredits - 8).length}</strong></div>
      </div>
      <div className="admin-section-title-row"><div><span className="admin-section-label">ACADEMIC SNAPSHOT</span><h3>Institutional Performance</h3></div><button className="admin-text-button" onClick={() => onNavigate('academic')}>View detailed performance <ArrowRight size={13} /></button></div>
      <div className="admin-performance-grid">{[
        ['Average CGPA', cgpa.toFixed(2), cgpa * 10, 'Out of 10.00'],
        ['Pass Percentage', `${(100 - (arrears.length / Math.max(1, data.length)) * 100).toFixed(1)}%`, 100 - (arrears.length / Math.max(1, data.length)) * 100, 'Overall pass rate'],
        ['Average Attendance', `${attendance.toFixed(1)}%`, attendance, 'Across active students'],
        ['Arrear Percentage', `${((arrears.length / Math.max(1, data.length)) * 100).toFixed(1)}%`, (arrears.length / Math.max(1, data.length)) * 100, 'Students with active arrears']
      ].map(([label, value, width, foot]) => <div className="admin-performance-card" key={String(label)}><span>{label}</span><strong>{value}</strong><div className="admin-meter"><i style={{ width: `${Math.max(0, Math.min(100, Number(width)))}%` }} /></div><small>{foot}</small></div>)}</div>
      <div className="admin-chart-grid two-columns">
        <section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">SIX-YEAR TREND</span><h3>Academic Progress</h3></div></div><div className="admin-chart-box large"><AdminLineChart data={{ labels: trendYears, datasets: [{ label: 'Average CGPA', data: trend, borderColor: colors[0], backgroundColor: `${colors[0]}22`, borderWidth: 2, tension: 0.35, pointRadius: 3, fill: true }] }} /></div></section>
        <section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">STUDENT STRENGTH</span><h3>Students by Batch</h3></div></div><div className="admin-chart-box large"><AdminBarChart data={{ labels: trendYears, datasets: [{ label: 'Students', data: batchCounts, backgroundColor: colors[0], borderRadius: 5, maxBarThickness: 30 }] }} /></div></section>
      </div>
      <div className="admin-overview-bottom-grid">
        <section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">ARREARS</span><h3>Arrear Overview</h3></div></div><div className="admin-arrear-overview"><div><span>Active Students</span><strong>{arrears.length}</strong></div><div><span>Total Arrears</span><strong>{data.reduce((total, student) => total + student.backlogs, 0)}</strong></div><div><span>Cleared</span><strong>{data.reduce((total, student) => total + Math.max(0, student.semesterGrades.filter(grade => grade.status !== 'Passed').length), 0)}</strong></div></div></section>
        <section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">QUICK ACCESS</span><h3>Administration</h3></div></div><div className="admin-quick-actions"><button onClick={() => onNavigate('students')}><UsersRound size={16} />Student Directory</button><button onClick={() => onNavigate('analytics')}><GraduationCap size={16} />Batch Analytics</button></div></section>
      </div>
    </>
  );
}