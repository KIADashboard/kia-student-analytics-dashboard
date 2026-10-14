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
        copy="Review your official secondary school examination history, subject breakdown, and institutional cut-off score."
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
    </div>
  );
};
