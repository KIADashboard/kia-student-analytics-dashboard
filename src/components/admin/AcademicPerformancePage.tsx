import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, FileUp, Search, Users, X } from 'lucide-react';
import { Student } from '../../types';
import { AdminBarChart, AdminLineChart } from './AdminChart';
import { AdminHeaderAction } from './AdminHeaderAction';
import { batchOptions, mean, studentsForBatch } from './adminData';
import { CurriculumCourse, curriculumSemesters } from './courseCurriculum';
import { getCourseSyllabus, listCourseSyllabi, saveCourseSyllabus } from './courseSyllabusStorage';

const chartPalette = ['#1f5f52', '#c28a35', '#527aa5', '#75679a', '#b65d5d'];
const courseKey = (course: CurriculumCourse) => `${course.semester}:${course.code}:${course.title}`;
const normalizeCourseValue = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'An unexpected error occurred.';

export function AcademicPerformancePage({ students }: { students: Student[] }) {
  const [batch, setBatch] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('I');
  const [selectedCourse, setSelectedCourse] = useState<CurriculumCourse | null>(null);
  const [selectedArrearCourse, setSelectedArrearCourse] = useState<CurriculumCourse | null>(null);
  const [courseSearch, setCourseSearch] = useState('');
  const [syllabusFiles, setSyllabusFiles] = useState<Record<string, string>>({});
  const [syllabusErrors, setSyllabusErrors] = useState<Record<string, string>>({});
  const [syllabusStorageError, setSyllabusStorageError] = useState('');
  const [syllabusRevision, setSyllabusRevision] = useState(0);
  const [loadedSyllabus, setLoadedSyllabus] = useState<Awaited<ReturnType<typeof getCourseSyllabus>>>(null);
  const [syllabusUrl, setSyllabusUrl] = useState('');
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const syllabusInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<CurriculumCourse | null>(null);
  const data = useMemo(() => studentsForBatch(students, batch), [students, batch]);
  const semesterCourses = curriculumSemesters.find(item => item.semester === selectedSemester)?.courses ?? [];
  const filteredSemesterCourses = useMemo(() => {
    const query = courseSearch.trim().toLowerCase();
    return semesterCourses.filter(course => course.title.toLowerCase().includes(query));
  }, [courseSearch, semesterCourses]);
  const arrearStudentsForCourse = (course: CurriculumCourse) => {
    const subjectCode = normalizeCourseValue(course.code);
    const subjectName = normalizeCourseValue(course.title);
    return data.filter(student => student.recentSubjects.some(subject =>
      subject.grade === 'RA' &&
      normalizeCourseValue(subject.code) === subjectCode &&
      normalizeCourseValue(subject.name) === subjectName
    ));
  };

  useEffect(() => {
    let active = true;
    listCourseSyllabi()
      .then(files => {
        if (active) setSyllabusFiles(Object.fromEntries(files.map(file => [file.courseKey, file.fileName])));
      })
      .catch(error => {
        if (active) setSyllabusStorageError(errorMessage(error));
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      setLoadedSyllabus(null);
      setSyllabusUrl('');
      setSyllabusLoading(false);
      return;
    }

    let active = true;
    let objectUrl = '';
    setLoadedSyllabus(null);
    setSyllabusUrl('');
    setSyllabusLoading(true);
    getCourseSyllabus(courseKey(selectedCourse))
      .then(file => {
        if (!active) return;
        setLoadedSyllabus(file);
        if (file) {
          objectUrl = URL.createObjectURL(file.file);
          setSyllabusUrl(objectUrl);
        }
      })
      .catch(error => {
        if (active) setSyllabusErrors(previous => ({ ...previous, [courseKey(selectedCourse)]: errorMessage(error) }));
      })
      .finally(() => {
        if (active) setSyllabusLoading(false);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selectedCourse, syllabusRevision]);

  const startSyllabusUpload = (course: CurriculumCourse) => {
    uploadTargetRef.current = course;
    syllabusInputRef.current?.click();
  };

  const handleSyllabusUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    const course = uploadTargetRef.current;
    event.currentTarget.value = '';
    uploadTargetRef.current = null;
    if (!file || !course) return;

    const key = courseKey(course);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setSyllabusErrors(previous => ({ ...previous, [key]: 'Choose a PDF file to upload.' }));
      return;
    }

    try {
      await saveCourseSyllabus(key, file);
      setSyllabusFiles(previous => ({ ...previous, [key]: file.name }));
      setSyllabusErrors(previous => {
        const next = { ...previous };
        delete next[key];
        return next;
      });
      setSyllabusStorageError('');
      setSyllabusRevision(revision => revision + 1);
    } catch (error) {
      setSyllabusErrors(previous => ({ ...previous, [key]: errorMessage(error) }));
    }
  };

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
    <AdminHeaderAction><select className="admin-large-filter" value={batch} onChange={event => setBatch(event.target.value)} aria-label="Academic batch">{batchOptions.map(option => <option key={option} value={option}>{option === 'all' ? 'All Batches' : option}</option>)}</select></AdminHeaderAction>
    <div className="admin-metric-grid">{cards.map(([label, value, detail]) => <article className="admin-metric-card" key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>)}</div>
    <div className="admin-chart-grid two-columns"><section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">CGPA DISTRIBUTION</span><h3>Academic Distribution</h3></div></div><div className="admin-chart-box"><AdminBarChart data={{ labels: distribution.map(([label]) => String(label)), datasets: [{ label: 'Students', data: distribution.map(([, value]) => Number(value)), backgroundColor: chartPalette[0], borderRadius: 5, maxBarThickness: 40 }] }} /></div></section><section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">SEMESTER PERFORMANCE</span><h3>Semester-wise Average GPA</h3></div></div><div className="admin-chart-box"><AdminLineChart data={{ labels: semesterRows.map(row => row.label), datasets: [{ label: 'Average GPA', data: semesterRows.map(row => row.average), borderColor: chartPalette[2], backgroundColor: `${chartPalette[2]}22`, borderWidth: 2, tension: 0.3, fill: true, pointRadius: 3 }] }} /></div></section></div>
    <section className="admin-curriculum-section">
      <div className="admin-section-title-row admin-course-section-heading"><div className="admin-course-title-search"><div><span className="admin-section-label">COURSE CATALOG</span><h3>Semester-wise Courses</h3></div><label className="admin-course-search"><Search size={16} aria-hidden="true" /><span className="admin-visually-hidden">Search courses by subject name</span><input type="search" value={courseSearch} onChange={event => setCourseSearch(event.target.value)} placeholder="Search subjects" aria-label="Search courses by subject name" /></label></div><span className="admin-curriculum-batch">{batch === 'all' ? 'All batches' : `Batch ${batch}`}</span></div>
      {syllabusStorageError && <p className="admin-course-storage-error" role="alert">Saved syllabus files could not be loaded: {syllabusStorageError}</p>}
      <div className="admin-curriculum-semesters" role="tablist" aria-label="Course semester">{curriculumSemesters.map(item => <button type="button" role="tab" aria-selected={selectedSemester === item.semester} className={selectedSemester === item.semester ? 'active' : ''} key={item.semester} onClick={() => setSelectedSemester(item.semester)}>Semester {item.semester}</button>)}</div>
      <div className="admin-course-grid">{filteredSemesterCourses.map(course => {
        const key = courseKey(course);
        const arrearStudents = arrearStudentsForCourse(course);
        return <article className="admin-course-card" key={key}>
          <button type="button" className="admin-course-card-main" onClick={() => setSelectedCourse(course)}>
            <span className="admin-course-card-top"><strong>{course.code}</strong><span>{course.credits} Credits</span></span>
            <strong className="admin-course-title">{course.title}</strong>
            <span className="admin-course-card-bottom"><span>Pass Rate: <strong>{course.passRate}%</strong></span><span>Dept: <strong>{course.department}</strong></span></span>
          </button>
          <div className="admin-course-card-actions">
            <span className="admin-course-arrear-count">{arrearStudents.length} students with arrears</span>
            <button type="button" className="admin-course-action" onClick={() => setSelectedArrearCourse(course)} aria-label={`View ${arrearStudents.length} students with arrears in ${course.title}`}><Users size={14} /> View students</button>
            <button type="button" className="admin-course-action" onClick={() => startSyllabusUpload(course)}><FileUp size={14} /> {syllabusFiles[key] ? 'Replace syllabus' : 'Upload syllabus'}</button>
            {syllabusFiles[key] && <button type="button" className="admin-course-action" onClick={() => setSelectedCourse(course)}>View syllabus</button>}
          </div>
          {syllabusErrors[key] && <p className="admin-course-inline-error" role="alert">{syllabusErrors[key]}</p>}
        </article>;
      })}
      {filteredSemesterCourses.length === 0 && <div className="admin-empty-state">{semesterCourses.length ? 'No subjects match your search.' : 'No subjects are listed for this semester.'}</div>}</div>
      <input ref={syllabusInputRef} className="admin-visually-hidden" type="file" accept="application/pdf,.pdf" onChange={handleSyllabusUpload} aria-label="Upload subject syllabus PDF" />
    </section>
    {selectedCourse && <div className="admin-modal-overlay" role="presentation" onClick={event => { if (event.target === event.currentTarget) setSelectedCourse(null); }}><section className="admin-course-modal" role="dialog" aria-modal="true" aria-label={`${selectedCourse.title} course details`}><button className="admin-modal-close" onClick={() => setSelectedCourse(null)} aria-label="Close course details"><X size={18} /></button><span className="admin-section-label">COURSE DETAILS · SEMESTER {selectedCourse.semester}</span><h2>{selectedCourse.title}</h2><p className="admin-course-modal-code">{selectedCourse.code}</p><div className="admin-course-detail-grid"><div><span>Department</span><strong>{selectedCourse.department}</strong></div><div><span>Credit Load</span><strong>{selectedCourse.credits}</strong></div><div><span>Pass Rate</span><strong>{selectedCourse.passRate}%</strong></div><div><span>Average Grade Point</span><strong>{selectedCourse.averageGradePoint}</strong></div></div><section className="admin-course-syllabus"><div className="admin-course-syllabus-heading"><h3><BookOpen size={16} /> Subject Syllabus</h3><button type="button" className="admin-secondary-button" onClick={() => startSyllabusUpload(selectedCourse)}><FileUp size={14} /> {syllabusFiles[courseKey(selectedCourse)] ? 'Replace PDF' : 'Upload PDF'}</button></div>{syllabusLoading ? <p className="admin-course-syllabus-empty">Loading syllabus...</p> : loadedSyllabus && syllabusUrl ? <><p className="admin-course-syllabus-file">{loadedSyllabus.fileName}</p><iframe className="admin-course-syllabus-viewer" src={syllabusUrl} title={`${selectedCourse.title} syllabus`} /></> : <p className="admin-course-syllabus-empty">No syllabus has been uploaded for this subject.</p>}{syllabusErrors[courseKey(selectedCourse)] && <p className="admin-course-inline-error" role="alert">{syllabusErrors[courseKey(selectedCourse)]}</p>}</section></section></div>}
    {selectedArrearCourse && <div className="admin-modal-overlay" role="presentation" onClick={event => { if (event.target === event.currentTarget) setSelectedArrearCourse(null); }}><section className="admin-course-modal" role="dialog" aria-modal="true" aria-label={`Students with arrears in ${selectedArrearCourse.title}`}><button className="admin-modal-close" onClick={() => setSelectedArrearCourse(null)} aria-label="Close arrear student list"><X size={18} /></button><span className="admin-section-label">SUBJECT ARREARS · SEMESTER {selectedArrearCourse.semester}</span><h2>{selectedArrearCourse.title}</h2><p className="admin-course-modal-code">{arrearStudentsForCourse(selectedArrearCourse).length} students with arrears</p><div className="admin-course-arrear-list">{arrearStudentsForCourse(selectedArrearCourse).map(student => <article key={student.id}><div><strong>{student.name}</strong><span>{student.rollNo}</span></div><span>Batch {student.academicYear}</span></article>)}{arrearStudentsForCourse(selectedArrearCourse).length === 0 && <p className="admin-course-syllabus-empty">No matching student subject records currently show an arrear in this subject.</p>}</div></section></div>}
  </>;
}
