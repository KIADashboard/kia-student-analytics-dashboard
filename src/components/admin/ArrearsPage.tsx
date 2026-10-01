import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Student } from '../../types';
import { AdminBarChart } from './AdminChart';
import { batchOptions, downloadCsv, studentsForBatch } from './adminData';

const palette = ['#1f5f52', '#c28a35', '#527aa5'];

export function ArrearsPage({ students }: { students: Student[] }) {
  const [batch, setBatch] = useState('all');
  const [department, setDepartment] = useState('all');
  const data = useMemo(() => studentsForBatch(students, batch).filter(student => student.backlogs > 0 && (department === 'all' || student.departmentCode === department)), [students, batch, department]);
  const arrearsByBatch = batchOptions.slice(1).reverse().map(year => studentsForBatch(students, year).filter(student => student.backlogs > 0).length);
  const subjectCounts = data.flatMap(student => student.recentSubjects.slice(0, Math.min(student.backlogs, student.recentSubjects.length))).reduce<Record<string, number>>((counts, subject) => { counts[subject.name] = (counts[subject.name] ?? 0) + 1; return counts; }, {});
  const subjects = Object.entries(subjectCounts).sort((left, right) => right[1] - left[1]).slice(0, 6);
  const metrics = [['Students With Arrears', data.length, 'Across selected batch'], ['Total Active Arrears', data.reduce((total, student) => total + student.backlogs, 0), 'Current pending attempts'], ['Cleared Arrears', students.reduce((total, student) => total + student.semesterGrades.filter(grade => grade.status === 'Arrears Cleared').length, 0), 'Successfully cleared'], ['Multiple Arrears', data.filter(student => student.backlogs >= 2).length, '2 or more arrears']];

  return <>
    <div className="admin-page-heading-row"><div><span className="admin-section-label">ACADEMIC MONITORING</span><h2>Arrears Management</h2><p>Identify students, subjects and batches requiring attention.</p></div><button className="admin-primary-button" onClick={() => downloadCsv('kia-arrears-report.csv', data.map(student => ({ Student: student.name, RegisterNumber: student.rollNo, Batch: student.academicYear, Department: student.department, Arrears: student.backlogs, CGPA: student.cgpa.toFixed(2), Attendance: `${student.attendance.toFixed(1)}%` })))}><Download size={14} /> Generate Arrear Report</button></div>
    <div className="admin-metric-grid arrear-metrics">{metrics.map(([label, value, detail]) => <article className="admin-metric-card" key={String(label)}><span>{label}</span><strong>{Number(value).toLocaleString()}</strong><small>{detail}</small></article>)}</div>
    <div className="admin-filter-panel"><select aria-label="Arrear batch" value={batch} onChange={event => setBatch(event.target.value)}>{batchOptions.map(option => <option key={option} value={option}>{option === 'all' ? 'All Batches' : option}</option>)}</select><select aria-label="Department" value={department} onChange={event => setDepartment(event.target.value)}><option value="all">All Departments</option>{Array.from(new Set(students.map(student => student.departmentCode))).sort().map(code => <option key={code}>{code}</option>)}</select></div>
    <div className="admin-chart-grid two-columns"><section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">BATCH ANALYSIS</span><h3>Arrears by Batch</h3></div></div><div className="admin-chart-box"><AdminBarChart data={{ labels: batchOptions.slice(1).reverse(), datasets: [{ label: 'Students with arrears', data: arrearsByBatch, backgroundColor: palette[2], borderRadius: 5, maxBarThickness: 36 }] }} /></div></section><section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">SUBJECT ANALYSIS</span><h3>Most Affected Subjects</h3></div></div><div className="admin-chart-box"><AdminBarChart horizontal data={{ labels: subjects.map(([label]) => label), datasets: [{ label: 'Arrear records', data: subjects.map(([, value]) => value), backgroundColor: palette[1], borderRadius: 4, maxBarThickness: 18 }] }} /></div></section></div>
    <div className="admin-section-title-row"><div><span className="admin-section-label">STUDENT RECORDS</span><h3>Students With Arrears</h3></div><span className="admin-result-count">{data.length} records</span></div>
    <div className="admin-panel admin-table-panel"><div className="admin-table-scroll"><table className="admin-data-table"><thead><tr><th>Student</th><th>Register No.</th><th>Batch</th><th>Department</th><th>Arrears</th><th>Primary Subject</th><th>Status</th></tr></thead><tbody>{data.map(student => <tr key={student.id}><td><strong>{student.name}</strong><small>{student.email}</small></td><td>{student.rollNo}</td><td>{student.academicYear}</td><td>{student.departmentCode}</td><td>{student.backlogs}</td><td>{student.recentSubjects[0]?.name ?? 'Academic record pending'}</td><td><span className="admin-status-pill arrear">Active</span></td></tr>)}</tbody></table>{data.length === 0 && <div className="admin-empty-state">No arrear records match these filters.</div>}</div></div>
  </>;
}
