import { Student } from '../../types';

export const batchOptions = ['all', '2026', '2025', '2024', '2023', '2022', '2021'];

export function studentsForBatch(students: Student[], batch: string) {
  return batch === 'all' ? students : students.filter(student => String(student.academicYear) === batch);
}

export function mean(values: number[]) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

export function percentage(value: number, total: number) {
  return total ? (value / total) * 100 : 0;
}

export function countsFor(students: Student[], selector: (student: Student) => string) {
  return students.reduce<Record<string, number>>((counts, student) => {
    const key = selector(student);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

export function chartDataFromCounts(counts: Record<string, number>, sort = true) {
  const entries = Object.entries(counts);
  if (sort) entries.sort((left, right) => right[1] - left[1]);
  return {
    labels: entries.map(([label]) => label),
    values: entries.map(([, value]) => value)
  };
}

export function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const contents = [headers.map(quote).join(','), ...rows.map(row => headers.map(header => quote(row[header] ?? '')).join(','))].join('\n');
  const blob = new Blob(['\ufeff', contents], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function studentCsvRow(student: Student) {
  return {
    Name: student.name,
    RegisterNumber: student.rollNo,
    Batch: student.academicYear,
    Gender: student.gender,
    District: student.district,
    Department: student.department,
    CGPA: student.cgpa.toFixed(2),
    Attendance: `${student.attendance.toFixed(1)}%`,
    Arrears: student.backlogs,
    Residence: student.residentialType
  };
}

export function residenceLabel(student: Student) {
  return student.residentialType === 'Day Scholar' ? 'Day Scholar' : 'Hostel';
}
