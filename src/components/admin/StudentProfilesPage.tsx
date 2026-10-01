import React, { useMemo, useState } from 'react';
import { Download, Eye, Search, X } from 'lucide-react';
import { Student } from '../../types';
import { batchOptions, downloadCsv, studentCsvRow, studentsForBatch } from './adminData';

export function StudentProfilesPage({ students }: { students: Student[] }) {
  const [query, setQuery] = useState('');
  const [batch, setBatch] = useState('all');
  const [gender, setGender] = useState('all');
  const [arrear, setArrear] = useState('all');
  const [residence, setResidence] = useState('all');
  const [sort, setSort] = useState('name');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const rows = studentsForBatch(students, batch).filter(student => {
      const matchesSearch = !search || `${student.name} ${student.rollNo} ${student.id}`.toLowerCase().includes(search);
      return matchesSearch && (gender === 'all' || student.gender === gender) && (arrear === 'all' || (arrear === 'yes' ? student.backlogs > 0 : student.backlogs === 0)) && (residence === 'all' || (residence === 'hostel' ? student.residentialType !== 'Day Scholar' : student.residentialType === 'Day Scholar'));
    });
    return rows.sort((left, right) => sort === 'cgpa' ? right.cgpa - left.cgpa : sort === 'attendance' ? right.attendance - left.attendance : sort === 'arrears' ? right.backlogs - left.backlogs : left.name.localeCompare(right.name));
  }, [students, query, batch, gender, arrear, residence, sort]);

  const reset = () => { setQuery(''); setBatch('all'); setGender('all'); setArrear('all'); setResidence('all'); setSort('name'); };

  return (
    <>
      <div className="admin-page-heading-row"><div><span className="admin-section-label">STUDENT DIRECTORY</span><h2>Student Profiles</h2><p>Search, filter and access complete student records.</p></div><button className="admin-primary-button" onClick={() => downloadCsv('kia-students.csv', filtered.map(studentCsvRow))}><Download size={14} /> Export Student Data</button></div>
      <div className="admin-filter-panel">
        <label className="admin-search-field"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name or register number..." /></label>
        <select aria-label="Batch" value={batch} onChange={event => setBatch(event.target.value)}>{batchOptions.map(option => <option key={option} value={option}>{option === 'all' ? 'All Batches' : option}</option>)}</select>
        <select aria-label="Gender" value={gender} onChange={event => setGender(event.target.value)}><option value="all">Gender</option><option>Male</option><option>Female</option><option>Other</option></select>
        <select aria-label="Arrear status" value={arrear} onChange={event => setArrear(event.target.value)}><option value="all">Arrear Status</option><option value="yes">With Arrears</option><option value="no">No Arrears</option></select>
        <select aria-label="Residence" value={residence} onChange={event => setResidence(event.target.value)}><option value="all">Residence</option><option value="hostel">Hostel</option><option value="day">Day Scholar</option></select>
        <button className="admin-reset-button" onClick={reset}>Reset</button>
      </div>
      <div className="admin-list-toolbar"><div><strong>{filtered.length.toLocaleString()}</strong><span>students</span></div><select aria-label="Sort students" value={sort} onChange={event => setSort(event.target.value)}><option value="name">Sort by Name</option><option value="cgpa">Highest CGPA</option><option value="attendance">Highest Attendance</option><option value="arrears">Most Arrears</option></select></div>
      <div className="admin-panel admin-table-panel"><div className="admin-table-scroll"><table className="admin-data-table"><thead><tr><th>Student</th><th>Register No.</th><th>Batch</th><th>Gender</th><th>District</th><th>CGPA</th><th>Attendance</th><th>Arrears</th><th aria-label="Actions" /></tr></thead><tbody>{filtered.map(student => <tr key={student.id}><td><strong>{student.name}</strong><small>{student.department}</small></td><td>{student.rollNo}</td><td>{student.academicYear}</td><td>{student.gender}</td><td>{student.district}</td><td>{student.cgpa.toFixed(2)}</td><td>{student.attendance.toFixed(1)}%</td><td><span className={`admin-status-pill ${student.backlogs > 0 ? 'arrear' : 'clear'}`}>{student.backlogs > 0 ? `${student.backlogs} Arrear${student.backlogs > 1 ? 's' : ''}` : 'Clear'}</span></td><td><button className="admin-row-action" onClick={() => setSelectedStudent(student)} aria-label={`View ${student.name}`} title="View profile"><Eye size={14} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="admin-empty-state">No students match these filters.</div>}</div></div>
      {selectedStudent && <div className="admin-modal-overlay" role="presentation" onClick={event => { if (event.target === event.currentTarget) setSelectedStudent(null); }}><section className="admin-student-modal" role="dialog" aria-modal="true" aria-label={`${selectedStudent.name} profile`}><button className="admin-modal-close" onClick={() => setSelectedStudent(null)} aria-label="Close profile"><X size={18} /></button><div className="admin-student-profile-header"><div className="admin-profile-avatar">{selectedStudent.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</div><div className="admin-profile-main"><span className="admin-section-label">STUDENT PROFILE</span><h2>{selectedStudent.name}</h2><p>{selectedStudent.rollNo} · {selectedStudent.degree} · Batch {selectedStudent.academicYear}</p><div className="admin-profile-tags"><span className="green">{selectedStudent.status}</span><span>{selectedStudent.residentialType}</span><span>{selectedStudent.backlogs ? `${selectedStudent.backlogs} Arrears` : 'No Arrears'}</span></div></div><div className="admin-profile-summary"><div><span>CGPA</span><strong>{selectedStudent.cgpa.toFixed(2)}</strong></div><div><span>Attendance</span><strong>{selectedStudent.attendance.toFixed(1)}%</strong></div><div><span>Cut-off</span><strong>{selectedStudent.cutoffScore.toFixed(1)}</strong></div><div><span>Arrears</span><strong>{selectedStudent.backlogs}</strong></div></div></div><div className="admin-profile-section-grid">{[
        ['Personal Information', [['Full Name', selectedStudent.name], ['Register Number', selectedStudent.rollNo], ['Date of Birth', selectedStudent.dob], ['Gender', selectedStudent.gender], ['Blood Group', selectedStudent.bloodGroup], ['Phone', selectedStudent.phone], ['Email', selectedStudent.email], ['District', selectedStudent.district]]],
        ['Family Information', [["Guardian's Name", selectedStudent.guardianName], ['Relation', selectedStudent.guardianRelation], ['Contact', selectedStudent.guardianPhone], ['Annual Income', selectedStudent.annualIncome], ['First Graduate', selectedStudent.firstGenerationGraduate ? 'Yes' : 'No'], ['Agriculture Background', selectedStudent.agricultureBackground]]],
        ['School & Admission', [['School Type', selectedStudent.schoolType], ['Quota', selectedStudent.quota], ['Category', selectedStudent.category], ['Admission Date', selectedStudent.admissionDate], ['HSC Marks', `${selectedStudent.hscMarks}%`], ['Cut-off Mark', selectedStudent.cutoffScore.toFixed(1)]]],
        ['College Information', [['Programme', selectedStudent.degree], ['Department', selectedStudent.department], ['Batch', selectedStudent.batch], ['Current Semester', selectedStudent.currentSemester], ['Credits Earned', `${selectedStudent.creditsEarned} / ${selectedStudent.totalCredits}`], ['Mentor', selectedStudent.mentorName]]]
      ].map(([title, fields]) => <article className="admin-profile-info-card" key={String(title)}><h3>{String(title)}</h3><div>{(fields as string[][]).map(([label, value]) => <div className="admin-info-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></article>)}</div><section className="admin-panel admin-semester-panel"><div className="admin-panel-header"><div><span className="admin-section-label">ACADEMIC RECORD</span><h3>Semester Performance</h3></div></div><div className="admin-table-scroll"><table className="admin-data-table"><thead><tr><th>Semester</th><th>GPA</th><th>Credits</th><th>Status</th></tr></thead><tbody>{selectedStudent.semesterGrades.map(semester => <tr key={semester.semester}><td>{semester.semester}</td><td>{semester.gpa.toFixed(2)}</td><td>{semester.credits}</td><td>{semester.status}</td></tr>)}</tbody></table></div></section></section></div>}
    </>
  );
}
