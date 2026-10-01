import React, { useMemo, useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { Student } from '../../types';
import { AdminBarChart, AdminLineChart } from './AdminChart';
import { batchOptions, mean, studentsForBatch } from './adminData';
import { CurriculumCourse, curriculumSemesters } from './courseCurriculum';

const chartPalette = ['#1f5f52', '#c28a35', '#527aa5', '#75679a', '#b65d5d'];

export function AcademicPerformancePage({ students }: { students: Student[] }) {
  const [batch, setBatch] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('I');
  const [selectedCourse, setSelectedCourse] = useState<CurriculumCourse | null>(null);
  const data = useMemo(() => studentsForBatch(students, batch), [students, batch]);
  const semesterCourses = curriculumSemesters.find(item => item.semester === selectedSemester)?.courses ?? [];
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

  return <>
    <div className="admin-page-heading-row"><div><span className="admin-section-label">ACADEMIC PERFORMANCE</span><h2>Academic Performance</h2><p>Review performance across batches, semesters and subjects.</p></div><select className="admin-large-filter" value={batch} onChange={event => setBatch(event.target.value)} aria-label="Academic batch">{batchOptions.map(option => <option key={option} value={option}>{option === 'all' ? 'All Batches' : option}</option>)}</select></div>
    <div className="admin-metric-grid">{cards.map(([label, value, detail]) => <article className="admin-metric-card" key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>)}</div>
    <div className="admin-chart-grid two-columns"><section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">CGPA DISTRIBUTION</span><h3>Academic Distribution</h3></div></div><div className="admin-chart-box"><AdminBarChart data={{ labels: distribution.map(([label]) => String(label)), datasets: [{ label: 'Students', data: distribution.map(([, value]) => Number(value)), backgroundColor: chartPalette[0], borderRadius: 5, maxBarThickness: 40 }] }} /></div></section><section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">SEMESTER PERFORMANCE</span><h3>Semester-wise Average GPA</h3></div></div><div className="admin-chart-box"><AdminLineChart data={{ labels: semesterRows.map(row => row.label), datasets: [{ label: 'Average GPA', data: semesterRows.map(row => row.average), borderColor: chartPalette[2], backgroundColor: `${chartPalette[2]}22`, borderWidth: 2, tension: 0.3, fill: true, pointRadius: 3 }] }} /></div></section></div>
    <section className="admin-curriculum-section">
      <div className="admin-section-title-row"><div><span className="admin-section-label">COURSE CATALOG</span><h3>Semester-wise Courses</h3></div><span className="admin-curriculum-batch">{batch === 'all' ? 'All batches' : `Batch ${batch}`}</span></div>
      <div className="admin-curriculum-semesters" role="tablist" aria-label="Course semester">{curriculumSemesters.map(item => <button type="button" role="tab" aria-selected={selectedSemester === item.semester} className={selectedSemester === item.semester ? 'active' : ''} key={item.semester} onClick={() => setSelectedSemester(item.semester)}>Semester {item.semester}</button>)}</div>
      <div className="admin-course-grid">{semesterCourses.map(course => <button type="button" className="admin-course-card" key={`${course.semester}-${course.code}-${course.title}`} onClick={() => setSelectedCourse(course)}><span className="admin-course-card-top"><strong>{course.code}</strong><span>{course.credits} Credits</span></span><strong className="admin-course-title">{course.title}</strong><span className="admin-course-card-bottom"><span>Pass Rate: <strong>{course.passRate}%</strong></span><span>Dept: <strong>{course.department}</strong></span></span></button>)}</div>
      <section className="admin-panel admin-course-matrix"><div className="admin-panel-header"><div><span className="admin-section-label">SEMESTER {selectedSemester} · {batch === 'all' ? 'ALL BATCHES' : `BATCH ${batch}`}</span><h3>Departmental Subject Performance Matrix</h3></div></div><div className="admin-table-scroll"><table className="admin-data-table"><thead><tr><th>Course Code</th><th>Course Title</th><th>Department</th><th>Credit Hours</th><th>Avg Grade Point</th><th>Pass Rate</th><th>Active Backlogs</th></tr></thead><tbody>{semesterCourses.map(course => <tr key={`${course.semester}-${course.code}-${course.title}`}><td>{course.code}</td><td><button type="button" className="admin-course-table-link" onClick={() => setSelectedCourse(course)}>{course.title}</button></td><td>{course.department}</td><td>{course.credits}</td><td>{course.averageGradePoint}</td><td>{course.passRate}%</td><td>{course.activeBacklogs}</td></tr>)}</tbody></table></div></section>
    </section>
    {selectedCourse && <div className="admin-modal-overlay" role="presentation" onClick={event => { if (event.target === event.currentTarget) setSelectedCourse(null); }}><section className="admin-course-modal" role="dialog" aria-modal="true" aria-label={`${selectedCourse.title} course details`}><button className="admin-modal-close" onClick={() => setSelectedCourse(null)} aria-label="Close course details"><X size={18} /></button><span className="admin-section-label">SAMPLE COURSE DETAILS · SEMESTER {selectedCourse.semester}</span><h2>{selectedCourse.title}</h2><p className="admin-course-modal-code">{selectedCourse.code}</p><div className="admin-course-detail-grid"><div><span>Department</span><strong>{selectedCourse.department}</strong></div><div><span>Credit Load</span><strong>{selectedCourse.credits}</strong></div><div><span>Sample Pass Rate</span><strong>{selectedCourse.passRate}%</strong></div><div><span>Average Grade Point</span><strong>{selectedCourse.averageGradePoint}</strong></div></div><section className="admin-course-syllabus"><h3><BookOpen size={16} /> Sample Syllabus</h3><ol><li>Foundations and core concepts of {selectedCourse.title.toLowerCase()}.</li><li>Principles, methods, and tools used in the subject area.</li><li>Applied field or laboratory practices and case studies.</li><li>Current challenges, sustainable approaches, and a practical project.</li></ol></section></section></div>}
  </>;
}
