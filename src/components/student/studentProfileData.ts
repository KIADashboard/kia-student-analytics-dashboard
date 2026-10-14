import { Student, StudentProfile } from '../../types';

export type EditableProfileData = {
  studentName: string;
  studentId: string;
  registrationNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  community: string;
  caste: string;
  motherTongue: string;
  residentialStatus: string;
  studentStatus: string;
  batch: string;
  academicYear: string;
  admissionType: string;
  admissionQuota: string;
  firstGraduate: string;
  department: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  fatherQualification: string;
  fatherOccupation: string;
  motherName: string;
  annualIncome: string;
  boardOfStudy: string;
  mediumOfStudy: string;
  schoolType: string;
  familyBackground: string;
  agriculturalLandAvailability: string;
  areaOfResidence: string;
};

export const createEditableProfileData = (student: Student, profile: StudentProfile): EditableProfileData => ({
  studentName: student.name,
  studentId: student.id,
  registrationNumber: profile.registrationNumber,
  dateOfBirth: student.dob,
  gender: student.gender,
  bloodGroup: student.bloodGroup,
  nationality: profile.nationality,
  religion: profile.religion,
  community: profile.community,
  caste: profile.caste,
  motherTongue: profile.motherTongue,
  residentialStatus: student.residentialType,
  studentStatus: student.status,
  batch: student.batch,
  academicYear: String(student.academicYear),
  admissionType: profile.admissionType,
  admissionQuota: profile.admissionQuota,
  firstGraduate: profile.firstGraduate,
  department: student.department,
  phone: student.phone,
  email: student.email,
  whatsapp: profile.whatsappNumber || student.phone,
  address: profile.communicationAddress,
  guardianName: student.guardianName,
  guardianPhone: student.guardianPhone,
  fatherQualification: profile.fatherQualification,
  fatherOccupation: profile.fatherOccupation,
  motherName: profile.motherName,
  annualIncome: student.annualIncome,
  boardOfStudy: profile.boardOfStudy,
  mediumOfStudy: profile.mediumOfStudy,
  schoolType: student.schoolType,
  familyBackground: profile.familyBackground,
  agriculturalLandAvailability: profile.agriculturalLandAvailability,
  areaOfResidence: profile.areaOfResidence
});

export const isEditableProfileData = (value: unknown, initialData: EditableProfileData): value is EditableProfileData => (
  typeof value === 'object'
  && value !== null
  && Object.keys(initialData).every(key => typeof (value as Record<string, unknown>)[key] === 'string')
);

export const loadEditableProfileData = (student: Student, profile: StudentProfile): EditableProfileData => {
  const initialData = createEditableProfileData(student, profile);
  try {
    const savedData = window.localStorage.getItem(`kia-student-profile:${student.id}`);
    if (!savedData) return initialData;

    const parsedData: unknown = JSON.parse(savedData);
    if (!isEditableProfileData(parsedData, initialData)) {
      console.error(`Saved student profile data for ${student.id} has an invalid format.`);
      return initialData;
    }

    return parsedData;
  } catch (error) {
    console.error(`Could not load saved student profile data for ${student.id}.`, error);
    return initialData;
  }
};
