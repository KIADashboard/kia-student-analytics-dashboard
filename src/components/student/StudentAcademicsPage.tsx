import React from 'react';
import { Student, StudentProfile } from '../../types';
import { InfoGrid, PageIntro, Section } from './StudentPortalComponents';

interface StudentAcademicsPageProps {
  student: Student;
  profile: StudentProfile;
}

export const StudentAcademicsPage: React.FC<StudentAcademicsPageProps> = ({ student, profile }) => {
  return (
    <div className="space-y-6">
      <PageIntro
        kicker="Academic Record"
        title="My Academics"
        copy="Review your admission examination details and, when available, imported college academic records."
      />

      <Section title="X Standard (Secondary Examination)">
        <InfoGrid fields={[
          ["Board of Examination", profile.tenthBoard],
          ["School Name", profile.tenthSchool],
          ["Passing Year", profile.tenthPassingDate],
          ["Medium of Instruction", profile.tenthMedium],
          ["Total Marks", profile.tenthMarks]
        ]} />
      </Section>

      <Section title="XII Standard (Higher Secondary Examination)">
        <InfoGrid fields={[
          ["Board of Examination", profile.twelfthBoard],
          ["School Name", profile.twelfthSchool],
          ["Passing Year", profile.twelfthPassingDate],
          ["Medium of Instruction", profile.twelfthMedium],
          ["Total Marks", profile.twelfthMarks],
          ["Cut-off Score", `${student.cutoffScore} / 200`]
        ]} />
      </Section>

      {profile.subjectMarks.length > 0 && (
        <Section title="Subject-wise Marks Breakdown">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.subjectMarks.map(mark => (
              <div
                key={mark.name}
                className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl hover:border-[#076653]/30 transition"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">
                  {mark.name}
                </span>
                <strong className="block text-2xl font-serif text-[#0C342C] mt-1">
                  {mark.mark}
                </strong>
                <span className="text-[10px] text-[#06231D]/60 mt-1 block">Max: 100</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="College Academic Records">
        {!student.academicDataAvailable ? (
          <p className="text-sm text-[#06231D]/70">
            Semester results, attendance, arrears, and placement records are not available yet.
          </p>
        ) : (
          <div className="space-y-6">
            {student.semesterGrades.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="font-semibold text-[#0C342C] mb-2">Semester results</h3>
                <table className="w-full text-sm text-left">
                  <thead><tr><th>Semester</th><th>GPA</th><th>Credits earned</th><th>Status</th></tr></thead>
                  <tbody>{student.semesterGrades.map(record => (
                    <tr key={record.semester}>
                      <td>{record.semester}</td>
                      <td>{record.gpa.toFixed(2)}</td>
                      <td>{record.credits}</td>
                      <td>{record.status}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {student.attendanceRecords.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="font-semibold text-[#0C342C] mb-2">Attendance</h3>
                <table className="w-full text-sm text-left">
                  <thead><tr><th>Semester</th><th>Attendance</th></tr></thead>
                  <tbody>{student.attendanceRecords.map(record => (
                    <tr key={record.semester}><td>Semester {record.semester}</td><td>{record.percentage.toFixed(1)}%</td></tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {student.arrearRecords.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="font-semibold text-[#0C342C] mb-2">Arrears</h3>
                <table className="w-full text-sm text-left">
                  <thead><tr><th>Semester</th><th>Course</th><th>Status</th></tr></thead>
                  <tbody>{student.arrearRecords.map(record => (
                    <tr key={`${record.semester}:${record.courseCode}`}>
                      <td>Semester {record.semester}</td>
                      <td>{record.courseName || record.courseCode}</td>
                      <td>{record.cleared ? 'Cleared' : 'Outstanding'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {student.placementRecords.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="font-semibold text-[#0C342C] mb-2">Placement records</h3>
                <table className="w-full text-sm text-left">
                  <thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Package (LPA)</th></tr></thead>
                  <tbody>{student.placementRecords.map((record, index) => (
                    <tr key={`${record.company}:${record.jobTitle}:${index}`}>
                      <td>{record.company}</td>
                      <td>{record.jobTitle}</td>
                      <td>{record.status}</td>
                      <td>{record.packageLpa == null ? 'Not recorded' : record.packageLpa.toFixed(2)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Section>
    </div>
  );
};
