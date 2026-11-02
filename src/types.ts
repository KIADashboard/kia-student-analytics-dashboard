export type Gender = 'Male' | 'Female' | 'Other';

export type ThemeMode = 'light' | 'dark';

export type Category = string;

export type SchoolType = string;

export type QuotaType = string;

export type IncomeCategory = string;

export type AgricultureBackground = string;

export type StudentStatus = string;

export interface SemesterGrade {
  semester: string;
  gpa: number;
  credits: number;
  status: 'Passed' | 'Cleared with Distinction' | 'Arrears Cleared' | 'Arrears Pending' | 'Status unavailable';
}

export interface AttendanceRecord {
  semester: number;
  percentage: number;
}

export interface ArrearRecord {
  semester: number;
  courseCode: string;
  courseName: string;
  cleared: boolean;
}

export interface PlacementRecord {
  company: string;
  jobTitle: string;
  status: string;
  packageLpa: number | null;
}

export interface SubjectCourse {
  code: string;
  name: string;
  credits: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA';
  gradePoint: number;
}

export interface Student {
  id: string; // e.g. "21BCS042"
  databaseId?: number;
  rollNo: string; // e.g. "7178211CS101"
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  gender: Gender;
  academicYear: number; // 2021 to 2026
  batch: string; // e.g. "2021–2025"
  admissionDate: string;
  currentSemester: number;
  degree: string;
  department: string;
  departmentCode: string;
  district: string;
  state: string;
  category: Category;
  quota: QuotaType;
  schoolType: SchoolType;
  annualIncome: string;
  incomeCategory: IncomeCategory;
  agricultureBackground: AgricultureBackground;
  hscMarks: number;
  cutoffScore: number;
  cgpa: number;
  marksPercentage: number;
  attendance: number;
  status: StudentStatus;
  dob: string;
  bloodGroup: string;
  residentialType: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  firstGenerationGraduate: boolean;
  scholarship: string;
  backlogs: number;
  creditsEarned: number;
  totalCredits: number;
  semesterGrades: SemesterGrade[];
  attendanceRecords: AttendanceRecord[];
  arrearRecords: ArrearRecord[];
  placementRecords: PlacementRecord[];
  recentSubjects: SubjectCourse[];
  activities: string[];
  skills: string[];
  placementReadiness: number;
  mentorName: string;
  academicDataAvailable?: boolean;
  semesterDataAvailable: boolean;
  cgpaAvailable: boolean;
  attendanceAvailable: boolean;
  arrearsAvailable: boolean;
}

export type StudentPortalTab = 'profile' | 'academics';

export type UserRole = 'admin' | 'student';

export interface StudentProfile {
  student: Student;
  registrationNumber: string;
  nationality: string;
  religion: string;
  community: string;
  caste: string;
  motherTongue: string;
  communicationAddress: string;
  permanentAddress: string;
  pinCode: string;
  whatsappNumber: string;
  admissionType: string;
  admissionQuota: string;
  firstGraduate: string;
  tenthBoard: string;
  tenthSchool: string;
  tenthPassingDate: string;
  tenthMedium: string;
  tenthMarks: string;
  twelfthBoard: string;
  twelfthSchool: string;
  twelfthPassingDate: string;
  twelfthMedium: string;
  twelfthMarks: string;
  subjectMarks: { name: string; mark: string }[];
  fatherQualification: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherQualification: string;
  motherOccupation: string;
  motherContact: string;
  parentsOccupation: string;
  boardOfStudy: string;
  mediumOfStudy: string;
  familyBackground: string;
  agriculturalLandAvailability: string;
  cropsPlanted: string;
  agriculturalLandLocality: string;
  areaOfResidence: string;
  studiedTamilInXii: string;
}

export interface Achievement {
  id: string;
  name: string;
  category: string;
  level: string;
  type: string;
  description: string;
  date: string;
  documentName?: string;
}

export interface SurveyResponse {
  careerGoal: string;
  careerDomain: string;
  higherStudiesInterest: string;
  higherStudyArea: string;
  preferredIndustry: string;
  preferredJobRole: string;
  entrepreneurshipInterest: string;
  governmentJobInterest: string;
  skills: string[];
  shortTermGoal: string;
  longTermGoal: string;
  workLocation: string;
  expectedCareerPath: string;
  additionalComments: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending review';
}
