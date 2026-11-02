import { Student, StudentProfile, UserRole } from './types';

const API_BASE = '/api';
const TOKEN_KEY = 'kia-access-token';

type ApiStudent = Record<string, unknown>;

export function saveAccessToken(token: string, remember: boolean) {
  clearAccessToken();
  (remember ? window.localStorage : window.sessionStorage).setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
}

function accessToken() {
  return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = accessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = await response.json() as { detail?: unknown };
      if (typeof body.detail === 'string') message = body.detail;
      else if (body.detail && typeof body.detail === 'object') {
        const detail = body.detail as { message?: string; errors?: { row: number; error: string }[]; columns?: string[] };
        message = detail.message ?? (detail.errors
          ? detail.errors.map(error => `Row ${error.row}: ${error.error}`).join('; ')
          : detail.columns ? `Missing columns: ${detail.columns.join(', ')}` : message);
      }
    } catch {
      // Keep the HTTP status message when a response body is not JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function login(email: string, password: string, remember: boolean) {
  const result = await request<{ access_token: string; role: UserRole }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveAccessToken(result.access_token, remember);
  return result.role;
}

export function logout() {
  clearAccessToken();
}

export function getCurrentUser() {
  return request<{ role: UserRole; profile: ApiStudent | null }>('/auth/me');
}

// ── KPI & Analytics endpoints ─────────────────────────────────────────────────

export function getOverviewKpis() {
  return request<{
    total_students: number;
    male_count: number;
    female_count: number;
    seven_year_strength: number;
    current_year: number | null;
  }>('/kpis/overview');
}

export function getEnrollmentByYear() {
  return request<{ data: { year: string; count: number }[] }>('/charts/enrollment-by-year');
}

export function getCgpaDistribution(batch?: string) {
  const query = batch && batch !== 'all' ? `?batch=${encodeURIComponent(batch)}` : '';
  return request<{ data: { label: string; count: number }[]; data_basis: string }>(
    `/charts/cgpa-distribution${query}`,
  );
}

export function getStudentsNeedingAttention(limit = 5) {
  return request<{ data: { id: number; name: string; roll_no: string; active_arrears: number; batch_year: number }[] }>(
    `/students/needs-attention?limit=${limit}`,
  );
}

export function getAcademicKpis(batch?: string) {
  const query = batch && batch !== 'all' ? `?batch=${encodeURIComponent(batch)}` : '';
  return request<{
    avg_gpa: number | null;
    avg_cutoff: number | null;
    pass_percentage: number | null;
    high_achievers: number | null;
    low_performers: number | null;
    total: number;
    data_basis: string;
  }>(`/kpis/academic${query}`);
}

export function getCutoffByBatch() {
  return request<{ data: { batch_year: number; avg_cutoff: number | null; max_cutoff: number | null; min_cutoff: number | null; count: number }[] }>(
    '/charts/cutoff-by-batch',
  );
}

export function getAnalyticsDistributions(batch?: string) {
  const query = batch && batch !== 'all' ? `?batch=${encodeURIComponent(batch)}` : '';
  return request<Record<string, { label: string; count: number }[]>>(
    `/analytics/distributions${query}`,
  );
}

export function getAnalyticsCompare(batch1: number, batch2: number) {
  return request<{
    batch1: { batch_year: number; count: number; male: number; female: number; hostel_count: number; first_gen_count: number; avg_cutoff: number | null };
    batch2: { batch_year: number; count: number; male: number; female: number; hostel_count: number; first_gen_count: number; avg_cutoff: number | null };
  }>(`/analytics/compare?batch1=${batch1}&batch2=${batch2}`);
}

export function getAnalyticsTrend(metric: string) {
  return request<{ years: string[]; values: (number | null)[]; metric: string }>(
    `/analytics/trend?metric=${encodeURIComponent(metric)}`,
  );
}

export function getMetaBatches() {
  return request<{ batches: number[] }>('/meta/batches');
}

// ── User management endpoints ─────────────────────────────────────────────────

export function listUsers() {
  return request<{ users: { id: number; email: string; role: string; student_id: number | null }[] }>('/users');
}

export function createUser(data: { email: string; password: string; role: string; student_id?: number | null }) {
  return request<{ id: number; email: string; role: string; student_id: number | null }>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteUser(userId: number) {
  return request<void>(`/users/${userId}`, { method: 'DELETE' });
}

export function resetUserPassword(userId: number, password: string) {
  return request<{ message: string }>(`/users/${userId}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ password }),
  });
}

export async function getAllStudents(): Promise<Student[]> {
  const pageSize = 200;
  const results: ApiStudent[] = [];
  let page = 1;
  let total = 0;
  do {
    const result = await request<{ total: number; students: ApiStudent[] }>(
      `/students?page=${page}&page_size=${pageSize}`,
    );
    total = result.total;
    results.push(...result.students);
    page += 1;
  } while (results.length < total);
  return results.map(mapStudent);
}

export async function getStudentDetails(id: number): Promise<ApiStudent> {
  return request<ApiStudent>(`/students/${encodeURIComponent(id)}`);
}

export async function importStudentsCsv(file: File) {
  const form = new FormData();
  form.append('file', file);
  return request<{ inserted: number; updated: number; total: number }>('/import/students.csv', {
    method: 'POST',
    body: form,
  });
}

export type AcademicCsvKind = 'semester' | 'attendance' | 'arrears' | 'placements';

export async function importAcademicCsv(kind: AcademicCsvKind, file: File) {
  const form = new FormData();
  form.append('file', file);
  return request<{ inserted: number; updated: number; total: number }>(`/academic/import/${kind}.csv`, {
    method: 'POST',
    body: form,
  });
}

export async function exportAcademicCsv(kind: AcademicCsvKind) {
  const token = accessToken();
  const response = await fetch(`${API_BASE}/academic/export/${kind}.csv`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error(`Academic CSV export failed (${response.status}).`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kia-${kind}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportStudentsCsv(filters: Record<string, string>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') params.set(key, value);
  });
  const token = accessToken();
  const response = await fetch(`${API_BASE}/export/students.csv?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error(`CSV export failed (${response.status}).`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kia-students-${filters.batch || 'all'}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function mapStudent(data: ApiStudent): Student {
  const year = numberValue(data.batch_year);
  const rawGender = stringValue(data.gender).toLowerCase();
  const semesterRecords = Array.isArray(data.semester_records)
    ? data.semester_records as Record<string, unknown>[]
    : [];
  const attendanceRecords = Array.isArray(data.attendance_records)
    ? data.attendance_records as Record<string, unknown>[]
    : [];
  const arrears = Array.isArray(data.arrears) ? data.arrears as Record<string, unknown>[] : [];
  const placements = Array.isArray(data.placements) ? data.placements as Record<string, unknown>[] : [];
  const semesterGrades = semesterRecords
    .filter(record => record.gpa != null)
    .map(record => {
      const semester = numberValue(record.semester);
      const hasArrear = arrears.some(arrear => numberValue(arrear.semester) === semester && !booleanValue(arrear.cleared));
      const hasArrearRecords = arrears.some(arrear => numberValue(arrear.semester) === semester);
      return {
        semester: `Sem ${semester}`,
        gpa: numberValue(record.gpa),
        credits: numberValue(record.credits_earned),
        status: hasArrear ? 'Arrears Pending' : hasArrearRecords ? 'Arrears Cleared' : 'Status unavailable',
      } as const;
    });
  const actualGpas = semesterGrades.map(record => record.gpa);
  const attendanceValues = attendanceRecords.map(record => numberValue(record.attendance_percentage));
  const activeArrears = arrears.filter(record => !booleanValue(record.cleared));
  const academicDataAvailable = booleanValue(data.academic_data_available)
    || semesterRecords.length > 0
    || attendanceRecords.length > 0
    || arrears.length > 0
    || placements.length > 0;
  const activities = Array.isArray(data.activities)
    ? data.activities as Record<string, unknown>[]
    : [];
  return {
    id: stringValue(data.id_number) || String(data.id ?? ''),
    databaseId: numberValue(data.id) || undefined,
    rollNo: stringValue(data.reg_no) || stringValue(data.id_number),
    name: stringValue(data.name) || stringValue(data.student_name) || 'Unknown',
    email: stringValue(data.email),
    phone: stringValue(data.mobile) || stringValue(data.mobile_number),
    gender: rawGender === 'male' ? 'Male' : rawGender === 'female' ? 'Female' : 'Other',
    academicYear: year,
    batch: String(year),
    admissionDate: '',
    currentSemester: numberValue(data.current_semester) || Math.max(0, ...semesterRecords.map(record => numberValue(record.semester))),
    degree: 'Not recorded',
    department: 'Not recorded',
    departmentCode: 'Not recorded',
    district: stringValue(data.district),
    state: stringValue(data.state),
    category: stringValue(data.community) || 'Not recorded',
    quota: stringValue(data.admission_quota) || 'Not recorded',
    schoolType: stringValue(data.school_type) || 'Not recorded',
    annualIncome: stringValue(data.annual_income),
    incomeCategory: stringValue(data.income_category) || 'Unknown',
    agricultureBackground: stringValue(data.agri_background) || 'Unknown',
    hscMarks: numberValue(data.xii_marks ?? data.xii_mark_scored),
    cutoffScore: numberValue(data.cutoff),
    cgpa: data.cgpa != null
      ? numberValue(data.cgpa)
      : actualGpas.length ? actualGpas.reduce((sum, value) => sum + value, 0) / actualGpas.length : 0,
    marksPercentage: 0,
    attendance: data.attendance != null
      ? numberValue(data.attendance)
      : attendanceValues.length ? attendanceValues.reduce((sum, value) => sum + value, 0) / attendanceValues.length : 0,
    status: academicDataAvailable ? activeArrears.length ? 'Active arrears' : 'Academic records available' : 'Not recorded',
    dob: stringValue(data.dob),
    bloodGroup: stringValue(data.blood_group),
    residentialType: stringValue(data.residence) === 'Hosteller' ? 'Hosteler (Block A)' : 'Day Scholar',
    guardianName: stringValue(data.father_name) || stringValue(data.father_guardian_name),
    guardianPhone: stringValue(data.father_mobile),
    guardianRelation: 'Guardian',
    firstGenerationGraduate: booleanValue(data.first_graduate),
    scholarship: '',
    backlogs: data.backlogs != null ? numberValue(data.backlogs) : activeArrears.length,
    creditsEarned: data.credits_earned != null
      ? numberValue(data.credits_earned)
      : semesterRecords.reduce((sum, record) => sum + numberValue(record.credits_earned), 0),
    totalCredits: data.total_credits != null
      ? numberValue(data.total_credits)
      : semesterRecords.reduce((sum, record) => sum + numberValue(record.total_credits), 0),
    semesterGrades,
    recentSubjects: arrears.map(record => ({
      code: stringValue(record.course_code),
      name: stringValue(record.course_name) || stringValue(record.course_code),
      credits: 0,
      grade: booleanValue(record.cleared) ? 'B' : 'RA',
      gradePoint: 0,
    })),
    activities: activities.map(record => stringValue(record.name)).filter(Boolean),
    skills: [],
    placementReadiness: 0,
    mentorName: '',
    placementRecords: placements.map(record => ({
      company: stringValue(record.company),
      jobTitle: stringValue(record.job_title),
      status: stringValue(record.status),
      packageLpa: record.package_lpa == null ? null : numberValue(record.package_lpa),
    })),
    attendanceRecords: attendanceRecords.map(record => ({
      semester: numberValue(record.semester),
      percentage: numberValue(record.attendance_percentage),
    })),
    arrearRecords: arrears.map(record => ({
      semester: numberValue(record.semester),
      courseCode: stringValue(record.course_code),
      courseName: stringValue(record.course_name),
      cleared: booleanValue(record.cleared),
    })),
    academicDataAvailable,
    semesterDataAvailable: semesterRecords.length > 0 || numberValue(data.current_semester) > 0,
    cgpaAvailable: semesterGrades.length > 0 || booleanValue(data.gpa_data_available),
    attendanceAvailable: attendanceRecords.length > 0 || booleanValue(data.attendance_data_available),
    arrearsAvailable: arrears.length > 0 || booleanValue(data.arrear_data_available),
  };
}

export function mapStudentProfile(data: ApiStudent, student: Student): StudentProfile {
  const marks = (data.marks ?? {}) as Record<string, unknown>;
  const markLabels: Record<string, string> = {
    language: 'Language', english: 'English', maths: 'Mathematics',
    physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology',
    botany: 'Botany', zoology: 'Zoology', computer_science: 'Computer Science',
  };
  const value = (key: string) => stringValue(data[key]);
  return {
    student,
    registrationNumber: value('reg_no') || value('id_number'),
    nationality: value('nationality'),
    religion: value('religion'),
    community: value('community'),
    caste: value('caste'),
    motherTongue: value('mother_tongue'),
    communicationAddress: value('address_comm'),
    permanentAddress: value('permanent_address'),
    pinCode: value('pin_code'),
    whatsappNumber: value('whatsapp'),
    admissionType: value('admission_type'),
    admissionQuota: value('admission_quota'),
    firstGraduate: data.first_graduate == null ? '' : booleanValue(data.first_graduate) ? 'Yes' : 'No',
    tenthBoard: value('x_board'),
    tenthSchool: value('x_school'),
    tenthPassingDate: value('x_year'),
    tenthMedium: value('x_medium'),
    tenthMarks: value('x_marks'),
    twelfthBoard: value('xii_board'),
    twelfthSchool: value('xii_school'),
    twelfthPassingDate: value('xii_year'),
    twelfthMedium: value('xii_medium'),
    twelfthMarks: value('xii_marks'),
    subjectMarks: Object.entries(markLabels)
      .filter(([key]) => marks[key] != null)
      .map(([key, name]) => ({ name, mark: String(marks[key]) })),
    fatherQualification: value('father_qualification'),
    fatherOccupation: value('father_occupation'),
    fatherContact: value('father_mobile'),
    motherName: value('mother_name'),
    motherQualification: value('mother_qualification'),
    motherOccupation: value('mother_occupation'),
    motherContact: value('mother_mobile'),
    parentsOccupation: value('parents_occupation'),
    boardOfStudy: value('board_of_study'),
    mediumOfStudy: value('medium_of_study'),
    familyBackground: value('family_background'),
    agriculturalLandAvailability: value('agri_land_acres'),
    cropsPlanted: value('crops_planted'),
    agriculturalLandLocality: value('agri_land_locality'),
    areaOfResidence: value('area_type'),
    studiedTamilInXii: data.studied_tamil_xii == null ? '' : booleanValue(data.studied_tamil_xii) ? 'Yes' : 'No',
  };
}

function stringValue(value: unknown): string {
  return value == null ? '' : String(value);
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function booleanValue(value: unknown): boolean {
  return value === true || value === 1 || String(value).toLowerCase() === 'true';
}
