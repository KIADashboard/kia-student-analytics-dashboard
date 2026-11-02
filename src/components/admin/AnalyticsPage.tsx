import React, { useEffect, useMemo, useState } from 'react';
import { Student } from '../../types';
import { AdminBarChart, AdminDoughnutChart, AdminLineChart } from './AdminChart';
import { batchOptionsFor, chartDataFromCounts, countsFor, mean, residenceLabel, studentsForBatch } from './adminData';
import { BatchProfileReport } from './BatchProfileReport';

const palette = ['#1f5f52', '#c28a35', '#527aa5', '#75679a', '#b65d5d', '#3c8069', '#8a6b45', '#5c8a99'];
export type AnalyticsTab = 'profile' | 'compare' | 'trend';
type DistributionDimension = { key: string; label: string; select: (student: Student) => string; chart: 'bar' | 'doughnut'; color: string };

const dimensions: DistributionDimension[] = [
  { key: 'gender', label: 'Gender', select: student => student.gender, chart: 'doughnut', color: palette[0] },
  { key: 'community', label: 'Community', select: student => student.category, chart: 'bar', color: palette[1] },
  { key: 'residence', label: 'Hostel vs Day Scholar', select: residenceLabel, chart: 'doughnut', color: palette[2] },
  { key: 'quota', label: 'Admission Quota', select: student => student.quota, chart: 'bar', color: palette[3] },
  { key: 'first-generation', label: 'First-Generation Graduates', select: student => student.firstGenerationGraduate ? 'Yes' : 'No', chart: 'doughnut', color: palette[4] },
  { key: 'agriculture', label: 'Agricultural Background', select: student => student.agricultureBackground, chart: 'doughnut', color: palette[5] },
  { key: 'school-type', label: 'School Type', select: student => student.schoolType, chart: 'bar', color: palette[0] },
  { key: 'income', label: 'Family Income Category', select: student => student.incomeCategory, chart: 'bar', color: palette[1] },
  { key: 'district', label: 'District', select: student => student.district, chart: 'bar', color: palette[3] },
  { key: 'cgpa', label: 'CGPA Distribution', select: student => student.cgpa < 6 ? 'Below 6.0' : student.cgpa < 7 ? '6.0-6.9' : student.cgpa < 8 ? '7.0-7.9' : student.cgpa < 9 ? '8.0-8.9' : '9.0+', chart: 'bar', color: palette[4] },
  { key: 'attendance', label: 'Attendance Distribution', select: student => student.attendance < 70 ? 'Below 70%' : student.attendance < 80 ? '70-79.9%' : student.attendance < 90 ? '80-89.9%' : '90%+', chart: 'bar', color: palette[5] },
  { key: 'arrears', label: 'Arrear Count', select: student => student.backlogs >= 3 ? '3+' : String(student.backlogs), chart: 'bar', color: palette[4] },
  { key: 'credits', label: 'Credits Earned', select: student => student.creditsEarned === 0 ? '0' : student.creditsEarned <= 60 ? '1-60' : student.creditsEarned <= 120 ? '61-120' : student.creditsEarned <= 160 ? '121-160' : '161+', chart: 'bar', color: palette[6] },
  { key: 'semester', label: 'Current Semester', select: student => `Semester ${student.currentSemester}`, chart: 'bar', color: palette[1] }
];
const academicAvailability: Record<string, keyof Student> = {
  cgpa: 'cgpaAvailable',
  attendance: 'attendanceAvailable',
  arrears: 'arrearsAvailable',
  credits: 'semesterDataAvailable',
  semester: 'semesterDataAvailable',
};
const academicDimensionKeys = new Set(Object.keys(academicAvailability));
const academicRows = (students: Student[], key: string) => {
  const field = academicAvailability[key];
  if (!field) return students;
  return students.filter(student => Boolean(student[field]));
};

const cutoffBands = [
  { label: '100-119.9', min: 100, max: 120 },
  { label: '120-139.9', min: 120, max: 140 },
  { label: '140-159.9', min: 140, max: 160 },
  { label: '160-179.9', min: 160, max: 180 },
  { label: '180-200', min: 180, max: 201 }
];

function DistributionChart({ students, dimension }: { students: Student[]; dimension: DistributionDimension }) {
  const availableStudents = academicRows(students, dimension.key);
  if (availableStudents.length === 0 && academicDimensionKeys.has(dimension.key)) {
    return <div className="admin-empty-state">Academic records are unavailable.</div>;
  }
  const distribution = chartDataFromCounts(countsFor(availableStudents, dimension.select));
  if (dimension.chart === 'doughnut') {
    return <AdminDoughnutChart data={{ labels: distribution.labels, datasets: [{ data: distribution.values, backgroundColor: distribution.labels.map((_, index) => palette[index % palette.length]), borderWidth: 0, hoverOffset: 4 }] }} />;
  }
  return <AdminBarChart horizontal={dimension.key === 'district' || dimension.key === 'quota'} data={{ labels: distribution.labels, datasets: [{ label: 'Students', data: distribution.values, backgroundColor: dimension.color, borderRadius: 4, maxBarThickness: 24 }] }} />;
}

// Professional institutional / agricultural color pairings matching executive dashboards:
// Olive dark greens, warm wheat / ochre, terra cotta / terracotta rose, slate charcoal, muted sage
const comparisonColorPairs: [string, string][] = [
  ['#3e4a2e', '#d8bc88'], // Deep Olive & Warm Wheat (Reference primary combo)
  ['#4a5840', '#cf9b82'], // Moss Forest & Muted Terracotta
  ['#5a738e', '#d8bc88'], // Slate Blue & Warm Wheat
  ['#3e4a2e', '#8fa189'], // Deep Olive & Soft Sage
  ['#734c38', '#d8bc88'], // Warm Umber & Warm Wheat
  ['#405559', '#cf9b82'], // Slate Teal & Terracotta
  ['#3e4a2e', '#b8a67c'], // Forest Olive & Sandstone
  ['#5c6b4e', '#cf9b82'], // Herb Olive & Muted Terracotta
  ['#50697f', '#d8bc88'], // Slate Steel & Warm Wheat
  ['#3e4a2e', '#d8bc88'], // Deep Olive & Warm Wheat
  ['#664639', '#8fa189'], // Earth Cocoa & Soft Sage
  ['#465842', '#d8bc88'], // Forest Sage & Warm Wheat
  ['#a0523e', '#e6c89c'], // Terracotta Rust & Pale Ochre
  ['#3e4a2e', '#cf9b82'], // Deep Olive & Terracotta
  ['#546574', '#d8bc88'], // Muted Slate & Warm Wheat
  ['#4a5840', '#b8a67c'], // Moss & Sandstone
  ['#3e4a2e', '#8fa189'], // Olive & Soft Sage
  ['#6e5445', '#d8bc88']  // Warm Bark & Warm Wheat
];

function ComparisonDistributionChart({ first, second, dimension, firstLabel, secondLabel, colorPair = ['#1f5f52', '#c28a35'] }: { first: Student[]; second: Student[]; dimension: DistributionDimension; firstLabel: string; secondLabel: string; colorPair?: [string, string] }) {
  const firstCounts = countsFor(academicRows(first, dimension.key), dimension.select);
  const secondCounts = countsFor(academicRows(second, dimension.key), dimension.select);
  const labels = [...new Set([...Object.keys(firstCounts), ...Object.keys(secondCounts)])].sort((left, right) => (firstCounts[right] ?? 0) + (secondCounts[right] ?? 0) - (firstCounts[left] ?? 0) - (secondCounts[left] ?? 0));
  const visibleLabels = dimension.key === 'district' ? labels.slice(0, 8) : labels;
  return <AdminBarChart horizontal={dimension.key === 'district' || dimension.key === 'quota'} showLegend data={{ labels: visibleLabels, datasets: [{ label: firstLabel, data: visibleLabels.map(label => firstCounts[label] ?? 0), backgroundColor: colorPair[0], borderRadius: 3 }, { label: secondLabel, data: visibleLabels.map(label => secondCounts[label] ?? 0), backgroundColor: colorPair[1], borderRadius: 3 }] }} />;
}

function TrendDistributionChart({ batches, years, dimension }: { batches: Student[][]; years: string[]; dimension: DistributionDimension }) {
  const counts = batches.map(batch => countsFor(academicRows(batch, dimension.key), dimension.select));
  const totals = counts.reduce<Record<string, number>>((result, yearCounts) => {
    Object.entries(yearCounts).forEach(([label, count]) => { result[label] = (result[label] ?? 0) + count; });
    return result;
  }, {});
  const labels = Object.keys(totals).sort((left, right) => totals[right] - totals[left]);
  const visibleLabels = dimension.key === 'district' ? labels.slice(0, 6) : labels;
  return <AdminBarChart showLegend data={{ labels: years, datasets: visibleLabels.map((label, index) => ({ label, data: counts.map(yearCounts => yearCounts[label] ?? 0), backgroundColor: palette[index % palette.length], borderRadius: 2 })) }} />;
}

function CutoffHistogram({ students }: { students: Student[] }) {
  return <AdminBarChart data={{ labels: cutoffBands.map(band => band.label), datasets: [{ label: 'Students', data: cutoffBands.map(band => students.filter(student => student.cutoffScore >= band.min && student.cutoffScore < band.max).length), backgroundColor: palette[5], borderRadius: 4 }] }} />;
}

function CutoffComparisonChart({ first, second, firstLabel, secondLabel, colorPair = ['#d97706', '#fcd34d'] }: { first: Student[]; second: Student[]; firstLabel: string; secondLabel: string; colorPair?: [string, string] }) {
  const stats = (data: Student[]) => ({
    maximum: Math.max(0, ...data.map(student => student.cutoffScore)),
    average: mean(data.map(student => student.cutoffScore)),
    minimum: data.length ? Math.min(...data.map(student => student.cutoffScore)) : 0
  });
  const firstStats = stats(first);
  const secondStats = stats(second);
  return <AdminBarChart showLegend data={{ labels: ['Maximum', 'Average', 'Minimum'], datasets: [{ label: firstLabel, data: [firstStats.maximum, firstStats.average, firstStats.minimum], backgroundColor: colorPair[0], borderRadius: 3 }, { label: secondLabel, data: [secondStats.maximum, secondStats.average, secondStats.minimum], backgroundColor: colorPair[1], borderRadius: 3 }] }} />;
}

function CutoffTrendChart({ batches, years }: { batches: Student[][]; years: string[] }) {
  const statistics = batches.map(data => ({
    maximum: Math.max(0, ...data.map(student => student.cutoffScore)),
    average: mean(data.map(student => student.cutoffScore)),
    minimum: data.length ? Math.min(...data.map(student => student.cutoffScore)) : 0
  }));
  return <AdminLineChart showLegend data={{ labels: years, datasets: [
    { label: 'Maximum', data: statistics.map(stat => stat.maximum), borderColor: palette[0], backgroundColor: palette[0], tension: 0.3 },
    { label: 'Average', data: statistics.map(stat => stat.average), borderColor: palette[1], backgroundColor: palette[1], tension: 0.3 },
    { label: 'Minimum', data: statistics.map(stat => stat.minimum), borderColor: palette[2], backgroundColor: palette[2], tension: 0.3 }
  ] }} />;
}

function ChartPanel({ eyebrow, title, children, size = '' }: { eyebrow: string; title: string; children: React.ReactNode; size?: string }) {
  return <section className="admin-panel"><div className="admin-panel-header"><div><span className="admin-section-label">{eyebrow}</span><h3>{title}</h3></div></div><div className={`admin-chart-box ${size}`}>{children}</div></section>;
}

export function AnalyticsPage({
  students,
  activeTab = 'profile'
}: {
  students: Student[];
  activeTab?: AnalyticsTab;
}) {
  const [firstBatch, setFirstBatch] = useState('2026');
  const [secondBatch, setSecondBatch] = useState('2025');
  const [metric, setMetric] = useState<'strength' | 'cgpa' | 'attendance' | 'pass' | 'arrears' | 'hostel'>('strength');
  const availableBatches = useMemo(
    () => batchOptionsFor(students).slice(1),
    [students],
  );
  useEffect(() => {
    if (!availableBatches.includes(firstBatch)) setFirstBatch(availableBatches[0] ?? '');
    if (!availableBatches.includes(secondBatch) || firstBatch === secondBatch) {
      setSecondBatch(availableBatches.find(year => year !== firstBatch) ?? availableBatches[0] ?? '');
    }
  }, [availableBatches, firstBatch, secondBatch]);
  const years = [...availableBatches].reverse();
  const getMetric = (data: Student[]): number | null => {
    if (metric === 'strength') return data.length;
    if (metric === 'hostel') return (data.filter(student => student.residentialType !== 'Day Scholar').length / Math.max(1, data.length)) * 100;
    if (metric === 'pass') return null;
    if (metric === 'arrears') {
      const recorded = data.filter(student => student.arrearsAvailable);
      return recorded.length ? recorded.reduce((total, student) => total + student.backlogs, 0) : null;
    }
    const academic = data.filter(student => metric === 'cgpa' ? student.cgpaAvailable : student.attendanceAvailable);
    if (academic.length === 0) return null;
    if (metric === 'cgpa') return mean(academic.map(student => student.cgpa));
    return mean(academic.map(student => student.attendance));
  };
  const compareFirst = studentsForBatch(students, firstBatch);
  const compareSecond = studentsForBatch(students, secondBatch);
  const trendBatches = years.map(year => studentsForBatch(students, year));
  const trendMetric = years.map(year => getMetric(studentsForBatch(students, year)));
  const compareAcademicMetric = (data: Student[], metricType: 'cgpa' | 'attendance' | 'pass' | 'arrears') => {
    if (metricType === 'pass') return null;
    if (metricType === 'arrears') {
      const recorded = data.filter(student => student.arrearsAvailable);
      return recorded.length ? recorded.reduce((total, student) => total + student.backlogs, 0) : null;
    }
    const academic = data.filter(student => metricType === 'cgpa' ? student.cgpaAvailable : student.attendanceAvailable);
    if (!academic.length) return null;
    if (metricType === 'cgpa') return mean(academic.map(student => student.cgpa));
    const withAttendance = academic.filter(student => student.attendanceAvailable);
    return withAttendance.length ? mean(withAttendance.map(student => student.attendance)) : null;
  };
  const comparePassRate = (data: Student[]) => compareAcademicMetric(data, 'pass');
  const compareArrearRate = (data: Student[]) => compareAcademicMetric(data, 'arrears');
  const firstAcademic = compareFirst.filter(student => student.cgpaAvailable || student.attendanceAvailable || student.arrearsAvailable);
  const secondAcademic = compareSecond.filter(student => student.cgpaAvailable || student.attendanceAvailable || student.arrearsAvailable);
  const academicLabel = (value: number | null, digits = 1, suffix = '') =>
    value == null ? 'Unavailable' : value.toFixed(digits) + suffix;
  const metricLabels = { strength: 'Student Strength', cgpa: 'Average CGPA', attendance: 'Attendance', pass: 'Pass Percentage', arrears: 'Recorded Active Arrears', hostel: 'Hostel Residents' };

  if (students.length === 0 && activeTab !== 'profile') {
    return <div className="admin-empty-state">No student records available.</div>;
  }

  return <>
    {activeTab === 'profile' && <BatchProfileReport students={students} />}
    {activeTab === 'compare' && <>
    <div className="admin-comparison-controls"><label>First Batch<select value={firstBatch} onChange={event => setFirstBatch(event.target.value)}>{availableBatches.map(year => <option key={year} value={year}>{year}</option>)}</select></label><span className="admin-versus">VS</span><label>Second Batch<select value={secondBatch} onChange={event => setSecondBatch(event.target.value)}>{availableBatches.filter(year => year !== firstBatch).map(year => <option key={year} value={year}>{year}</option>)}</select></label></div>
    <div className="admin-comparison-grid">{[
      ['Student Strength', compareFirst.length, compareSecond.length],
      ['Average CGPA', academicLabel(compareAcademicMetric(compareFirst, 'cgpa'), 2), academicLabel(compareAcademicMetric(compareSecond, 'cgpa'), 2)],
      ['Attendance', academicLabel(compareAcademicMetric(compareFirst, 'attendance'), 1, '%'), academicLabel(compareAcademicMetric(compareSecond, 'attendance'), 1, '%')],
      ['Pass Percentage', 'Unavailable', 'Unavailable'],
      ['Recorded Active Arrears', academicLabel(compareArrearRate(compareFirst), 0, ''), academicLabel(compareArrearRate(compareSecond), 0, '')],
    ].map(([label, left, right]) => <article className="admin-comparison-card" key={String(label)}><span>{label}</span><div><strong>{left}</strong><strong>{right}</strong></div></article>)}</div>
    <div className="admin-section-title-row"><div><span className="admin-section-label">BATCH COMPARISON</span><h3>Academic and Student Profile Comparisons</h3></div></div>
    <div className="admin-analytics-chart-grid">{dimensions.map((dimension, index) => <ChartPanel key={dimension.key} eyebrow="BATCH COMPARISON" title={dimension.label}><ComparisonDistributionChart first={compareFirst} second={compareSecond} dimension={dimension} firstLabel={firstBatch} secondLabel={secondBatch} colorPair={comparisonColorPairs[index % comparisonColorPairs.length]} /></ChartPanel>)}<ChartPanel eyebrow="ADMISSION PERFORMANCE" title="Cut-off Score Comparison"><CutoffComparisonChart first={compareFirst} second={compareSecond} firstLabel={firstBatch} secondLabel={secondBatch} colorPair={['#3e4a2e', '#d8bc88']} /></ChartPanel><ChartPanel eyebrow="ACADEMIC PERFORMANCE" title="Academic Indicators">{firstAcademic.length || secondAcademic.length ? <AdminBarChart showLegend data={{ labels: ['Average CGPA (x10)', 'Attendance %', 'Pass % (unavailable)', 'Recorded Active Arrears'], datasets: [{ label: firstBatch, data: [compareAcademicMetric(compareFirst, 'cgpa') == null ? null : compareAcademicMetric(compareFirst, 'cgpa')! * 10, compareAcademicMetric(compareFirst, 'attendance'), comparePassRate(compareFirst), compareArrearRate(compareFirst)], backgroundColor: '#5a738e', borderRadius: 4 }, { label: secondBatch, data: [compareAcademicMetric(compareSecond, 'cgpa') == null ? null : compareAcademicMetric(compareSecond, 'cgpa')! * 10, compareAcademicMetric(compareSecond, 'attendance'), comparePassRate(compareSecond), compareArrearRate(compareSecond)], backgroundColor: '#d8bc88', borderRadius: 4 }] }} /> : <div className="admin-empty-state">Academic records are unavailable.</div>}</ChartPanel></div>
    </>}
    {activeTab === 'trend' && <>
    <div className="admin-trend-header"><div><span className="admin-section-label">{years[0]} – {years[years.length - 1]}</span><h3>Six-Year Institutional Trend</h3></div><select aria-label="Trend metric" value={metric} onChange={event => setMetric(event.target.value as typeof metric)}><option value="strength">Student Strength</option><option value="cgpa">Average CGPA</option><option value="pass">Pass Percentage (unavailable)</option><option value="attendance">Attendance</option><option value="arrears">Recorded Active Arrears</option><option value="hostel">Hostel Residents</option></select></div>
    <ChartPanel eyebrow="INSTITUTIONAL TREND" title={metricLabels[metric]} size="huge"><AdminLineChart data={{ labels: years, datasets: [{ label: metricLabels[metric], data: trendMetric, borderColor: palette[0], backgroundColor: `${palette[0]}20`, borderWidth: 2, fill: true, tension: 0.32, pointRadius: 3 }] }} /></ChartPanel>
    <div className="admin-section-title-row"><div><span className="admin-section-label">PROFILE TRENDS</span><h3>Distributions Across Available Batches</h3></div></div>
    <div className="admin-analytics-chart-grid">{dimensions.map(dimension => <ChartPanel key={dimension.key} eyebrow="BATCH TREND" title={dimension.label}><TrendDistributionChart batches={trendBatches} years={years} dimension={dimension} /></ChartPanel>)}<ChartPanel eyebrow="ADMISSION PERFORMANCE" title="Cut-off Score Trend"><CutoffTrendChart batches={trendBatches} years={years} /></ChartPanel></div>
    </>}
  </>;
}