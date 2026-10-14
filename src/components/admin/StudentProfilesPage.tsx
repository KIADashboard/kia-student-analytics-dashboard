import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight as ChevronRightIcon, Download, Search, X } from 'lucide-react';
import { Student } from '../../types';
import { AdminHeaderAction } from './AdminHeaderAction';
import { batchOptions, downloadCsv, studentCsvRow, studentsForBatch } from './adminData';
import { getStudentProfile } from '../../studentData';

const INITIAL_VISIBLE_COUNT = 8;

export function StudentProfilesPage({ students }: { students: Student[] }) {
  const [query, setQuery] = useState('');
  const [batch, setBatch] = useState('all');
  const [gender, setGender] = useState('all');
  const [arrear, setArrear] = useState('all');
  const [residence, setResidence] = useState('all');
  const [sort, setSort] = useState('name');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfExportError, setPdfExportError] = useState('');

  useEffect(() => {
    if (!selectedStudent) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedStudent]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const rows = studentsForBatch(students, batch).filter(student => {
      const matchesSearch = !search || `${student.name} ${student.rollNo} ${student.id} ${student.phone} ${student.district}`.toLowerCase().includes(search);
      return matchesSearch && (gender === 'all' || student.gender === gender) && (arrear === 'all' || (arrear === 'yes' ? student.backlogs > 0 : student.backlogs === 0)) && (residence === 'all' || (residence === 'hostel' ? student.residentialType !== 'Day Scholar' : student.residentialType === 'Day Scholar'));
    });
    return rows.sort((left, right) => sort === 'cgpa' ? right.cgpa - left.cgpa : sort === 'attendance' ? right.attendance - left.attendance : sort === 'arrears' ? right.backlogs - left.backlogs : left.name.localeCompare(right.name));
  }, [students, query, batch, gender, arrear, residence, sort]);

  const displayedStudents = useMemo(() => {
    if (isExpanded) return filtered;
    return filtered.slice(0, INITIAL_VISIBLE_COUNT);
  }, [filtered, isExpanded]);

  const reset = () => {
    setQuery('');
    setBatch('all');
    setGender('all');
    setArrear('all');
    setResidence('all');
    setSort('name');
    setIsExpanded(false);
  };

  const exportStudentPdf = async () => {
    if (!selectedStudent) return;
    setIsExportingPdf(true);
    setPdfExportError('');
    try {
      const { downloadStudentProfilePdf } = await import('./studentProfilePdf');
      downloadStudentProfilePdf(selectedStudent, profileSections);
    } catch (error) {
      console.error('Failed to export student profile PDF.', error);
      setPdfExportError(error instanceof Error ? error.message : 'Unable to generate the PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const profile = selectedStudent ? getStudentProfile(selectedStudent) : null;
  const profileSections: [string, [string, string][]][] = selectedStudent && profile ? [
    ['Personal', [['Full Name', selectedStudent.name], ['Register Number', selectedStudent.rollNo], ['Date of Birth', selectedStudent.dob], ['Gender', selectedStudent.gender], ['Blood Group', selectedStudent.bloodGroup], ['Nationality', profile.nationality], ['Religion', profile.religion], ['Community', profile.community], ['Caste', profile.caste], ['Mother Tongue', profile.motherTongue], ['Address', profile.communicationAddress], ['District', selectedStudent.district], ['State', selectedStudent.state], ['PIN Code', profile.pinCode], ['Mobile Number', selectedStudent.phone], ['Email', selectedStudent.email]]],
    ['Admission', [['Residence', selectedStudent.residentialType], ['Batch', selectedStudent.batch], ['Admission Type', profile.admissionType], ['Quota', profile.admissionQuota], ['TNEA Number', 'Not provided'], ['Cut-off', `${selectedStudent.cutoffScore.toFixed(1)} / 200`], ['First Graduate', profile.firstGraduate]]],
    ['School', [['Board of Study', profile.boardOfStudy], ['X Standard Board', profile.tenthBoard], ['X Standard Percentage', profile.tenthMarks], ['X Standard Pass-out Year', profile.tenthPassingDate], ['XII Standard Board', profile.twelfthBoard], ['XII Standard Percentage', profile.twelfthMarks], ['XII Standard Pass-out Year', profile.twelfthPassingDate], ['School Type', selectedStudent.schoolType], ['Cut-off', `${selectedStudent.cutoffScore.toFixed(1)} / 200`]]],
    ['Contact', [['Parent / Guardian Name', selectedStudent.guardianName], ['Relation', selectedStudent.guardianRelation], ['Occupation', profile.parentsOccupation], ['Mobile Number', selectedStudent.guardianPhone], ['Email', 'Not provided']]],
    ['Bank Details', [['Account Number', 'Not provided'], ['Account Holder', 'Not provided'], ['Bank Name', 'Not provided'], ['Branch', 'Not provided'], ['IFSC Code', 'Not provided']]],
    ['College Academics', [['Programme', selectedStudent.degree], ['Department', selectedStudent.department], ['Current Semester', String(selectedStudent.currentSemester)], ['Credits Earned', `${selectedStudent.creditsEarned} / ${selectedStudent.totalCredits}`], ['Mentor', selectedStudent.mentorName]]]
  ] : [];

  return (
    <>
      <AdminHeaderAction>
        <button className="admin-primary-button" onClick={() => downloadCsv('kia-students.csv', filtered.map(studentCsvRow))}>
          <Download size={14} /> Export Student Data
        </button>
      </AdminHeaderAction>

      <div className="admin-filter-panel">
        <label className="admin-search-field">
          <Search size={16} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search by name or register number..."
          />
        </label>
        <select
          aria-label="Batch"
          value={batch}
          onChange={event => setBatch(event.target.value)}
        >
          {batchOptions.map(option => (
            <option key={option} value={option}>
              {option === 'all' ? 'All Batches' : option}
            </option>
          ))}
        </select>
        <select
          aria-label="Gender"
          value={gender}
          onChange={event => setGender(event.target.value)}
        >
          <option value="all">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <select
          aria-label="Arrear status"
          value={arrear}
          onChange={event => setArrear(event.target.value)}
        >
          <option value="all">Arrear Status</option>
          <option value="yes">With Arrears</option>
          <option value="no">No Arrears</option>
        </select>
        <select
          aria-label="Residence"
          value={residence}
          onChange={event => setResidence(event.target.value)}
        >
          <option value="all">Residence</option>
          <option value="hostel">Hostel</option>
          <option value="day">Day Scholar</option>
        </select>
        <button className="admin-reset-button" onClick={reset}>Reset</button>
      </div>

      <div className="admin-list-toolbar">
        <div>
          <strong>{filtered.length.toLocaleString()}</strong>
          <span>students</span>
        </div>
      </div>

      <div className="admin-profiles-table-card">
        <div className="admin-table-scroll">
          <table className="admin-profiles-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>REGISTER NUMBER</th>
                <th style={{ width: '42%' }}>NAME</th>
                <th style={{ width: '20%' }}>BATCH</th>
                <th className="admin-profiles-action-cell" style={{ width: '10%' }} />
              </tr>
            </thead>
            <tbody>
              {displayedStudents.map(student => (
                <tr
                  key={student.id}
                  className="admin-profiles-row"
                  onClick={() => setSelectedStudent(student)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedStudent(student);
                    }
                  }}
                  title="Click to view full student details"
                >
                  <td className="admin-profiles-roll">{student.rollNo || student.id}</td>
                  <td className="admin-profiles-name">{student.name}</td>
                  <td className="admin-profiles-batch">{student.batch || student.academicYear}</td>
                  <td className="admin-profiles-action-cell">
                    <span className="admin-profiles-view-link">
                      View <ChevronRightIcon size={14} />
                    </span>
                  </td>
                </tr>
              ))}
              {displayedStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-empty-state">
                    No students match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="admin-profiles-pagination-bar">
            <div className="admin-profiles-pagination-info">
              <span>
                Showing {displayedStudents.length} of {filtered.length} records
              </span>
              {filtered.length > INITIAL_VISIBLE_COUNT && (
                <button
                  type="button"
                  className="admin-profiles-view-all"
                  onClick={() => setIsExpanded(prev => !prev)}
                >
                  {isExpanded ? 'Show Less' : 'View All'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedStudent && (
        <div
          className="admin-modal-overlay"
          role="presentation"
          onClick={event => {
            if (event.target === event.currentTarget) setSelectedStudent(null);
          }}
        >
          <section
            className="admin-student-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedStudent.name} profile`}
          >
            <button
              className="admin-modal-close"
              onClick={() => setSelectedStudent(null)}
              aria-label="Close profile"
            >
              <X size={18} />
            </button>
            <div className="admin-profile-actions">
              <button
                className="admin-primary-button"
                onClick={exportStudentPdf}
                disabled={isExportingPdf}
              >
                <Download size={14} /> {isExportingPdf ? 'Preparing PDF...' : 'Export PDF'}
              </button>
            </div>
            {pdfExportError && (
              <p className="admin-profile-export-error" role="alert">
                PDF export failed: {pdfExportError}
              </p>
            )}
            <div className="admin-student-profile-header">
              <div className="admin-profile-avatar">
                {selectedStudent.name
                  .split(' ')
                  .map(part => part[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="admin-profile-main">
                <span className="admin-section-label">STUDENT PROFILE</span>
                <h2>{selectedStudent.name}</h2>
                <p>
                  {selectedStudent.rollNo} · {selectedStudent.degree} · Batch {selectedStudent.academicYear}
                </p>
                <div className="admin-profile-tags">
                  <span className="green">{selectedStudent.status}</span>
                  <span>{selectedStudent.residentialType}</span>
                  <span>
                    {selectedStudent.backlogs ? `${selectedStudent.backlogs} Arrears` : 'No Arrears'}
                  </span>
                </div>
              </div>
              <div className="admin-profile-summary">
                <div>
                  <span>CGPA</span>
                  <strong>{selectedStudent.cgpa.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Arrears</span>
                  <strong>{selectedStudent.backlogs}</strong>
                </div>
              </div>
            </div>

            <div className="admin-profile-section-grid">
              {profileSections.map(([title, fields]) => (
                <article className="admin-profile-info-card" key={title}>
                  <h3>{title}</h3>
                  <div>
                    {fields.map(([label, value]) => (
                      <div className="admin-info-item" key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <section className="admin-panel admin-semester-panel">
              <div className="admin-panel-header">
                <div>
                  <span className="admin-section-label">ACADEMIC RECORD</span>
                  <h3>Semester Performance</h3>
                </div>
              </div>
              <div className="admin-table-scroll">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>GPA</th>
                      <th>Credits</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.semesterGrades.map(semester => (
                      <tr key={semester.semester}>
                        <td>{semester.semester}</td>
                        <td>{semester.gpa.toFixed(2)}</td>
                        <td>{semester.credits}</td>
                        <td>{semester.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="admin-panel admin-semester-panel">
              <div className="admin-panel-header">
                <div>
                  <span className="admin-section-label">SUBJECT RESULTS</span>
                  <h3>Recent Subject Grades</h3>
                </div>
              </div>
              <div className="admin-table-scroll">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Subject Code</th>
                      <th>Subject</th>
                      <th>Credits</th>
                      <th>Grade</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.recentSubjects.map(subject => (
                      <tr key={subject.code}>
                        <td>{subject.code}</td>
                        <td>{subject.name}</td>
                        <td>{subject.credits}</td>
                        <td>{subject.grade}</td>
                        <td>{subject.grade === 'RA' ? 'Fail' : 'Pass'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selectedStudent.recentSubjects.length === 0 && (
                  <div className="admin-empty-state">No subject results available.</div>
                )}
              </div>
            </section>
          </section>
        </div>
      )}
    </>
  );
}

