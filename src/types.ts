export type Gender = 'Male' | 'Female' | 'Other';

export type Category = 'General' | 'OBC/BC' | 'MBC' | 'SC/ST' | 'Management/NRI';

export type SchoolType = 'Government' | 'Govt-Aided' | 'Private Matric' | 'CBSE/ICSE';

export type QuotaType = 
  | 'Merit (Govt Quota)' 
  | 'First Graduate Quota' 
  | '7.5% Govt School Quota'
  | 'Sports Quota' 
  | 'Management Quota' 
  | 'Lateral Entry';

export type IncomeCategory = 
  | '< ₹1 Lakh' 
  | '₹1L – ₹3L' 
  | '₹3L – ₹6L' 
  | '₹6L – ₹10L' 
  | '> ₹10 Lakh';

export type AgricultureBackground = 'Yes' | 'No' | 'Unknown';

export type StudentStatus = 'Active - Regular' | 'Fee Pending' | 'On Leave' | 'Graduated';

export interface SemesterGrade {
  semester: string;
  gpa: number;
  credits: number;
  status: 'Passed' | 'Cleared with Distinction' | 'Arrears Cleared';
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
  rollNo: string; // e.g. "7178211CS101"
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  gender: Gender;
  academicYear: number; // 2021 to 2025
  batch: string; // e.g. "2021–2025"
  admissionDate: string;
  currentSemester: number;
  degree: string;
  department: string;
  departmentCode: 'CSE' | 'ECE' | 'AI-DS' | 'MECH' | 'CIVIL' | 'IT';
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
  residentialType: 'Day Scholar' | 'Hosteler (Block A)' | 'Hosteler (Block B)' | 'Hosteler (Block C)';
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  firstGenerationGraduate: boolean;
  scholarship: string;
  backlogs: number;
  creditsEarned: number;
  totalCredits: number;
  semesterGrades: SemesterGrade[];
  recentSubjects: SubjectCourse[];
  activities: string[];
  skills: string[];
  placementReadiness: number;
  mentorName: string;
}

export interface GlobalFilterState {
  academicYear: string;
  gender: string;
  admissionType?: string;
  district: string;
  quota: string;
  schoolType: string;
  board?: string;
  category: string;
  department: string;
  searchQuery: string;
  marksRange: string;
  incomeCategory?: string;
  agricultureBackground?: string;
  firstGenerationGraduate?: string;
  hostellerDayscholar?: string;
  residenceArea?: string;
  familyBackground?: string;
}

export type ActiveTab = 'analytics' | 'directory' | 'reports';

export type UserRole = 'admin' | 'student';

export type StudentPortalTab = 'home' | 'profile' | 'academics' | 'achievements' | 'survey';

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

export interface ReportConfig {
  reportType: string;
  batch: string;
  district: string;
  quota: string;
  schoolType: string;
  department: string;
  minMarks: number;
}

export interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  batch: string;
  department: string;
  recordCount: number;
  generatedAt: string;
  fileSize: string;
  format: 'CSV' | 'PDF';
}

