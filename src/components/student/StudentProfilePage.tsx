import React, { useState } from 'react';
import { Pencil, Save, ShieldCheck, X } from 'lucide-react';
import { Student, StudentProfile } from '../../types';
import { Field, InfoGrid, PageIntro, Section } from './StudentPortalComponents';
import {
  EditableProfileData,
  loadEditableProfileData
} from './studentProfileData';

interface StudentProfilePageProps {
  student: Student;
  profile: StudentProfile;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ student, profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => loadEditableProfileData(student, profile));
  const [draftProfile, setDraftProfile] = useState(() => loadEditableProfileData(student, profile));
  const [profileSaveError, setProfileSaveError] = useState('');

  const beginEditing = () => {
    setDraftProfile(profileData);
    setProfileSaveError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftProfile(profileData);
    setProfileSaveError('');
    setIsEditing(false);
  };

  const saveProfile = () => {
    try {
      window.localStorage.setItem(`kia-student-profile:${student.id}`, JSON.stringify(draftProfile));
    } catch (error) {
      console.error(`Could not save student profile data for ${student.id}.`, error);
      setProfileSaveError('Your changes could not be saved in this browser. Please try again.');
      return;
    }

    setProfileData(draftProfile);
    setProfileSaveError('');
    setIsEditing(false);
  };

  const updateDraft = (field: keyof EditableProfileData, value: string) => {
    setDraftProfile(current => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <PageIntro
        kicker="Personal Record"
        title="My Profile"
        copy="Review your institutional registration details, residential standing, and update contact information."
        action={
          <button
            className="portal-primary"
            onClick={isEditing ? cancelEditing : beginEditing}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        }
      />

      {profileSaveError && (
        <div className="portal-notice" role="alert">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{profileSaveError}</span>
        </div>
      )}

      <Section title="Personal Information">
        {isEditing ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Student Name" value={draftProfile.studentName} onChange={v => updateDraft('studentName', v)} />
            <Field label="Student ID" value={draftProfile.studentId} onChange={v => updateDraft('studentId', v)} />
            <Field label="Registration Number" value={draftProfile.registrationNumber} onChange={v => updateDraft('registrationNumber', v)} />
            <Field label="Date of Birth" value={draftProfile.dateOfBirth} onChange={v => updateDraft('dateOfBirth', v)} />
            <Field label="Gender" value={draftProfile.gender} onChange={v => updateDraft('gender', v)} />
            <Field label="Blood Group" value={draftProfile.bloodGroup} onChange={v => updateDraft('bloodGroup', v)} />
            <Field label="Nationality" value={draftProfile.nationality} onChange={v => updateDraft('nationality', v)} />
            <Field label="Religion" value={draftProfile.religion} onChange={v => updateDraft('religion', v)} />
            <Field label="Community" value={draftProfile.community} onChange={v => updateDraft('community', v)} />
            <Field label="Caste" value={draftProfile.caste} onChange={v => updateDraft('caste', v)} />
            <Field label="Mother Tongue" value={draftProfile.motherTongue} onChange={v => updateDraft('motherTongue', v)} />
            <Field label="Residential Status" value={draftProfile.residentialStatus} onChange={v => updateDraft('residentialStatus', v)} />
          </div>
        ) : (
          <InfoGrid fields={[
            ["Student Name", profileData.studentName],
            ["Student ID", profileData.studentId],
            ["Registration Number", profileData.registrationNumber],
            ["Date of Birth", profileData.dateOfBirth],
            ["Gender", profileData.gender],
            ["Blood Group", profileData.bloodGroup],
            ["Nationality", profileData.nationality],
            ["Religion", profileData.religion],
            ["Community", profileData.community],
            ["Caste", profileData.caste],
            ["Mother Tongue", profileData.motherTongue],
            ["Residential Status", profileData.residentialStatus]
          ]} />
        )}
      </Section>

      <Section title="Academic & Institutional Status">
        {isEditing ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Status" value={draftProfile.studentStatus} onChange={v => updateDraft('studentStatus', v)} />
            <Field label="Residential Type" value={draftProfile.residentialStatus} onChange={v => updateDraft('residentialStatus', v)} />
            <Field label="Batch Year" value={draftProfile.batch} onChange={v => updateDraft('batch', v)} />
            <Field label="Academic Year" value={draftProfile.academicYear} onChange={v => updateDraft('academicYear', v)} />
            <Field label="Admission Type" value={draftProfile.admissionType} onChange={v => updateDraft('admissionType', v)} />
            <Field label="Admission Quota" value={draftProfile.admissionQuota} onChange={v => updateDraft('admissionQuota', v)} />
            <Field label="First Graduate Status" value={draftProfile.firstGraduate} onChange={v => updateDraft('firstGraduate', v)} />
            <Field label="Department" value={draftProfile.department} onChange={v => updateDraft('department', v)} />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Status</span>
                <span className="portal-badge green mt-2">{profileData.studentStatus}</span>
              </div>
              <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Residential Type</span>
                <span className="portal-badge mt-2 font-semibold text-[#0C342C]">{profileData.residentialStatus}</span>
              </div>
              <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Batch Year</span>
                <span className="font-serif text-lg font-bold text-[#0C342C] mt-1 block">{profileData.batch}</span>
              </div>
              <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Academic Year</span>
                <span className="font-serif text-lg font-bold text-[#0C342C] mt-1 block">{profileData.academicYear}</span>
              </div>
            </div>
            <InfoGrid fields={[
              ["Admission Type", profileData.admissionType],
              ["Admission Quota", profileData.admissionQuota],
              ["First Graduate Status", profileData.firstGraduate],
              ["Department", profileData.department]
            ]} />
          </>
        )}
      </Section>

      <Section title="Contact Information">
        <div className="grid sm:grid-cols-2 gap-5">
          {isEditing ? (
            <>
              <Field
                label="Mobile Number"
                value={draftProfile.phone}
                onChange={v => updateDraft('phone', v)}
              />
              <Field
                label="WhatsApp Number"
                value={draftProfile.whatsapp}
                onChange={v => updateDraft('whatsapp', v)}
              />
              <Field
                label="Email Address"
                value={draftProfile.email}
                onChange={v => updateDraft('email', v)}
              />
              <Field
                label="Address for Communication"
                value={draftProfile.address}
                onChange={v => updateDraft('address', v)}
                multiline
              />
            </>
          ) : (
            <>
              <Field label="Mobile Number" value={profileData.phone} badge="neutral" />
              <Field label="WhatsApp Number" value={profileData.whatsapp} badge="neutral" />
              <Field label="Official Email" value={profileData.email} badge="neutral" />
              <Field label="Address for Communication" value={profileData.address} />
            </>
          )}
        </div>
      </Section>

      <Section title="Family & Background Information">
        {isEditing ? (
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Father / Guardian" value={draftProfile.guardianName} onChange={v => updateDraft('guardianName', v)} />
            <Field label="Father's Contact" value={draftProfile.guardianPhone} onChange={v => updateDraft('guardianPhone', v)} />
            <Field label="Father's Qualification" value={draftProfile.fatherQualification} onChange={v => updateDraft('fatherQualification', v)} />
            <Field label="Father's Occupation" value={draftProfile.fatherOccupation} onChange={v => updateDraft('fatherOccupation', v)} />
            <Field label="Mother's Name" value={draftProfile.motherName} onChange={v => updateDraft('motherName', v)} />
            <Field label="Annual Family Income" value={draftProfile.annualIncome} onChange={v => updateDraft('annualIncome', v)} />
            <Field label="Board of Study" value={draftProfile.boardOfStudy} onChange={v => updateDraft('boardOfStudy', v)} />
            <Field label="Medium of Study" value={draftProfile.mediumOfStudy} onChange={v => updateDraft('mediumOfStudy', v)} />
            <Field label="School Type" value={draftProfile.schoolType} onChange={v => updateDraft('schoolType', v)} />
            <Field label="Family Background" value={draftProfile.familyBackground} onChange={v => updateDraft('familyBackground', v)} />
            <Field label="Agricultural Land Availability" value={draftProfile.agriculturalLandAvailability} onChange={v => updateDraft('agriculturalLandAvailability', v)} />
            <Field label="Area of Residence" value={draftProfile.areaOfResidence} onChange={v => updateDraft('areaOfResidence', v)} />
          </div>
        ) : (
          <InfoGrid fields={[
            ["Father / Guardian", profileData.guardianName],
            ["Father's Contact", profileData.guardianPhone],
            ["Father's Qualification", profileData.fatherQualification],
            ["Father's Occupation", profileData.fatherOccupation],
            ["Mother's Name", profileData.motherName],
            ["Annual Family Income", profileData.annualIncome],
            ["Board of Study", profileData.boardOfStudy],
            ["Medium of Study", profileData.mediumOfStudy],
            ["School Type", profileData.schoolType],
            ["Family Background", profileData.familyBackground],
            ["Agricultural Land Availability", profileData.agriculturalLandAvailability],
            ["Area of Residence", profileData.areaOfResidence]
          ]} />
        )}
      </Section>

      {isEditing && (
        <button className="portal-primary" onClick={saveProfile}>
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      )}

      <p className="text-xs text-[#06231D]/50 italic">
        Restricted banking, Aadhaar, and identity verification credentials are protected and handled securely via institutional compliance.
      </p>
    </div>
  );
};
