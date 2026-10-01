import React, { useMemo, useState } from 'react';
import { Download, Eye, FileText, Printer } from 'lucide-react';
import { Student } from '../../types';
import { batchOptions, downloadCsv, mean, studentsForBatch, studentCsvRow } from './adminData';

const reportTypes = [
  { id: 'student', icon: '♙', title: 'Student Report', detail: 'Complete individual record' },
  { id: 'batch', icon: '▤', title: 'Batch Report', detail: 'Students and academics' },
  { id: 'arrears', icon: '!', title: 'Arrear Report', detail: 'Students with arrears' },
  { id: 'academic', icon: '★', title: 'Academic Report', detail: 'Performance indicators' },
  { id: 'analytics', icon: '◫', title: 'Analytics Report', detail: 'Institutional insights' }
] as const;
type ReportType = typeof reportTypes[number]['id'];

export function ReportsPage({ students }: { students: Student[] }) {
  const [report, setReport] = useState<ReportType>('student');
  const [batch, setBatch] = useState('all');
  const [studentId, setStudentId] = useState(students[0]?.id ?? '');
  const [showPreview, setShowPreview] = useState(false);
  const data = useMemo(() => studentsForBatch(students, batch), [students, batch]);
  const selectedStudent = students.find(student => student.id === studentId);
  const title = reportTypes.find(type => type.id === report)?.title ?? 'Student Report';
  const rows = report === 'student' && selectedStudent ? [studentCsvRow(selectedStudent)] : data.map(studentCsvRow);
  const averageCgpa = mean(data.map(student => student.cgpa)).toFixed(2);

  return <>
    <div className="admin-page-heading-row"><div><span className="admin-section-label">DOCUMENT GENERATION</span><h2>Reports</h2><p>Generate structured reports from the available student data.</p></div></div>
    <div className="admin-report-type-grid">{reportTypes.map(type => <button key={type.id} className={`admin-report-type${report === type.id ? ' active' : ''}`} onClick={() => setReport(type.id)}><span>{type.icon}</span><div><strong>{type.title}</strong><small>{type.detail}</small></div></button>)}</div>
    <section className="admin-report-builder"><div className="admin-report-builder-header"><div><span className="admin-section-label">REPORT BUILDER</span><h3>{title}</h3></div><span className="admin-report-status">Ready to generate</span></div>
      <div className="admin-report-filters">{report === 'student' && <label>Student<select value={studentId} onChange={event => setStudentId(event.target.value)}>{students.map(student => <option key={student.id} value={student.id}>{student.name} ({student.rollNo})</option>)}</select></label>}<label>Batch<select value={batch} onChange={event => setBatch(event.target.value)}>{batchOptions.map(option => <option key={option} value={option}>{option === 'all' ? 'All Batches' : option}</option>)}</select></label></div>
      <div className="admin-report-preview"><div className="admin-preview-header"><div className="admin-preview-logo">K</div><div><strong>KUMARAGURU INSTITUTE OF AGRICULTURE</strong><span>B.Sc. Agriculture</span></div></div><div className="admin-preview-divider" /><h4>{title}</h4><p>{reportTypes.find(type => type.id === report)?.detail}. This report contains selected information from the administration system.</p>
        {showPreview ? <div className="admin-generated-report-grid">{report === 'student' && selectedStudent ? <><div><span>Name</span><strong>{selectedStudent.name}</strong></div><div><span>Register No.</span><strong>{selectedStudent.rollNo}</strong></div><div><span>Batch</span><strong>{selectedStudent.academicYear}</strong></div><div><span>CGPA</span><strong>{selectedStudent.cgpa.toFixed(2)}</strong></div><div><span>Attendance</span><strong>{selectedStudent.attendance.toFixed(1)}%</strong></div><div><span>Arrears</span><strong>{selectedStudent.backlogs}</strong></div></> : <><div><span>Batch</span><strong>{batch === 'all' ? 'All Batches' : batch}</strong></div><div><span>Students</span><strong>{data.length}</strong></div><div><span>Average CGPA</span><strong>{averageCgpa}</strong></div><div><span>Students with arrears</span><strong>{data.filter(student => student.backlogs > 0).length}</strong></div></>}</div> : <div className="admin-preview-lines"><i /><i /><i /><i /></div>}
      </div>
      <div className="admin-report-actions"><button className="admin-secondary-button" onClick={() => setShowPreview(value => !value)}><Eye size={14} />{showPreview ? 'Hide Preview' : 'Preview'}</button><button className="admin-secondary-button" onClick={() => downloadCsv(`kia-${report}-report.csv`, rows)}><Download size={14} /> Excel / CSV</button><button className="admin-secondary-button" onClick={() => window.print()}><Printer size={14} /> Print PDF</button><button className="admin-primary-button" onClick={() => { setShowPreview(true); }}><FileText size={14} /> Generate Report</button></div>
    </section>
  </>;
}
