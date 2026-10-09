import React, { useEffect, useState } from 'react';
import { Student } from '../../types';
import { AdminBarChart, AdminDoughnutChart, AdminLineChart } from './AdminChart';
import { batchOptions, chartDataFromCounts, countsFor, mean, residenceLabel, studentsForBatch } from './adminData';
import { BatchProfileReport } from './BatchProfileReport';

const palette = ['#1f5f52', '#c28a35', '#527aa5', '#75679a', '#b65d5d', '#3c8069', '#8a6b45', '#5c8a99'];
type AnalyticsTab = 'profile' | 'compare' | 'trend';
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
  { key: 'department', label: 'Department', select: student => student.departmentCode, chart: 'bar', color: palette[2] },
  { key: 'district', label: 'District', select: student => student.district, chart: 'bar', color: palette[3] },
  { key: 'cgpa', label: 'CGPA Distribution', select: student => student.cgpa < 6 ? 'Below 6.0' : student.cgpa < 7 ? '6.0-6.9' : student.cgpa < 8 ? '7.0-7.9' : student.cgpa < 9 ? '8.0-8.9' : '9.0+', chart: 'bar', color: palette[4] },
  { key: 'attendance', label: 'Attendance Distribution', select: student => student.attendance < 70 ? 'Below 70%' : student.attendance < 80 ? '70-79.9%' : student.attendance < 90 ? '80-89.9%' : '90%+', chart: 'bar', color: palette[5] },
  { key: 'arrears', label: 'Arrear Count', select: student => student.backlogs >= 3 ? '3+' : String(student.backlogs), chart: 'bar', color: palette[4] },
  { key: 'marks', label: 'Marks Distribution', select: student => student.marksPercentage < 60 ? 'Below 60%' : student.marksPercentage < 70 ? '60-69.9%' : student.marksPercentage < 80 ? '70-79.9%' : student.marksPercentage < 90 ? '80-89.9%' : '90%+', chart: 'bar', color: palette[5] },
  { key: 'credits', label: 'Credits Earned', select: student => student.creditsEarned === 0 ? '0' : student.creditsEarned <= 60 ? '1-60' : student.creditsEarned <= 120 ? '61-120' : student.creditsEarned <= 160 ? '121-160' : '161+', chart: 'bar', color: palette[6] },
  { key: 'placement', label: 'Placement Readiness', select: student => student.placementReadiness < 50 ? 'Below 50%' : student.placementReadiness < 60 ? '50-59.9%' : student.placementReadiness < 70 ? '60-69.9%' : student.placementReadiness < 80 ? '70-79.9%' : student.placementReadiness < 90 ? '80-89.9%' : '90%+', chart: 'bar', color: palette[7] },
  { key: 'status', label: 'Student Status', select: student => student.status, chart: 'doughnut', color: palette[0] },
  { key: 'semester', label: 'Current Semester', select: student => `Semester ${student.currentSemester}`, chart: 'bar', color: palette[1] }
];

const cutoffBands = [
  { label: '100-119.9', min: 100, max: 120 },
  { label: '120-139.9', min: 120, max: 140 },
  { label: '140-159.9', min: 140, max: 160 },
  { label: '160-179.9', min: 160, max: 180 },
  { label: '180-200', min: 180, max: 201 }
];

function DistributionChart({ students, dimension }: { students: Student[]; dimension: DistributionDimension }) {
  const distribution = chartDataFromCounts(countsFor(students, dimension.select));
  if (dimension.chart === 'doughnut') {
    return <AdminDoughnutChart data={{ labels: distribution.labels, datasets: [{ data: distribution.values, backgroundColor: distribution.labels.map((_, index) => palette[index % palette.length]), borderWidth: 0, hoverOffset: 4 }] }} />;
  }
  return <AdminBarChart horizontal={dimension.key === 'district' || dimension.key === 'quota'} data={{ labels: distribution.labels, datasets: [{ label: 'Students', data: distribution.values, backgroundColor: dimension.color, borderRadius: 4, maxBarThickness: 24 }] }} />;
}

function ComparisonDistributionChart({ first, second, dimension, firstLabel, secondLabel }: { first: Student[]; second: Student[]; dimension: DistributionDimension; firstLabel: string; secondLabel: string }) {
  const firstCounts = countsFor(first, dimension.select);
  const secondCounts = countsFor(second, dimension.select);
  const labels = [...new Set([...Object.keys(firstCounts), ...Object.keys(secondCounts)])].sort((left, right) => (firstCounts[right] ?? 0) + (secondCounts[right] ?? 0) - (firstCounts[left] ?? 0) - (secondCounts[left] ?? 0));
  const visibleLabels = dimension.key === 'district' ? labels.slice(0, 8) : labels;
  return <AdminBarChart horizontal={dimension.key === 'district' || dimension.key === 'quota'} showLegend data={{ labels: visibleLabels, datasets: [{ label: firstLabel, data: visibleLabels.map(label => firstCounts[label] ?? 0), backgroundColor: palette[0], borderRadius: 3 }, { label: secondLabel, data: visibleLabels.map(label => secondCounts[label] ?? 0), backgroundColor: palette[1], borderRadius: 3 }] }} />;
}

function TrendDistributionChart({ batches, years, dimension }: { batches: Student[][]; years: string[]; dimension: DistributionDimension }) {
  const counts = batches.map(batch => countsFor(batch, dimension.select));
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

function CutoffComparisonChart({ first, second, firstLabel, secondLabel }: { first: Student[]; second: Student[]; firstLabel: string; secondLabel: string }) {
  const stats = (data: Student[]) => ({
    maximum: Math.max(0, ...data.map(student => student.cutoffScore)),
    average: mean(data.map(student => student.cutoffScore)),
    minimum: data.length ? Math.min(...data.map(student => student.cutoffScore)) : 0
  });
  const firstStats = stats(first);
  const secondStats = stats(second);
  return <AdminBarChart showLegend data={{ labels: ['Maximum', 'Average', 'Minimum'], datasets: [{ label: firstLabel, data: [firstStats.maximum, firstStats.average, firstStats.minimum], backgroundColor: palette[0], borderRadius: 3 }, { label: secondLabel, data: [secondStats.maximum, secondStats.average, secondStats.minimum], backgroundColor: palette[1], borderRadius: 3 }] }} />;
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

export function AnalyticsPage({ students }: { students: Student[] }) {
  const [tab, setTab] = useState<AnalyticsTab>('profile');
  const [firstBatch, setFirstBatch] = useState('2026');
  const [secondBatch, setSecondBatch] = useState('2025');
  const [metric, setMetric] = useState<'strength' | 'cgpa' | 'attendance' | 'pass' | 'arrears' | 'hostel'>('strength');
  const availableBatches = batchOptions.slice(1).filter(year => studentsForBatch(students, year).length > 0);
  useEffect(() => {
    if (firstBatch === secondBatch) {
      const replacement = availableBatches.find(year => year !== firstBatch);
      if (replacement) setSecondBatch(replacement);
    }
  }, [firstBatch, secondBatch, students]);
  const years = [...availableBatches].reverse();
  const getMetric = (data: Student[]) => {
    const arrearRate = data.filter(student => student.backlogs > 0).length / Math.max(1, data.length) * 100;
    if (metric === 'strength') return data.length;
    if (metric === 'cgpa') return mean(data.map(student => student.cgpa));
    if (metric === 'attendance') return mean(data.map(student => student.attendance));
    if (metric === 'pass') return 100 - arrearRate;
    if (metric === 'hostel') return (data.filter(student => student.residentialType !== 'Day Scholar').length / Math.max(1, data.length)) * 100;
    return arrearRate;
  };
  const compareFirst = studentsForBatch(students, firstBatch);
  const compareSecond = studentsForBatch(students, secondBatch);
  const trendBatches = years.map(year => studentsForBatch(students, year));
  const trendMetric = years.map(year => getMetric(studentsForBatch(students, year)));
  const comparePassRate = (data: Student[]) => 100 - data.filter(student => student.backlogs > 0).length / Math.max(1, data.length) * 100;
  const compareArrearRate = (data: Student[]) => data.filter(student => student.backlogs > 0).length / Math.max(1, data.length) * 100;
  const metricLabels = { strength: 'Student Strength', cgpa: 'Average CGPA', attendance: 'Attendance', pass: 'Pass Percentage', arrears: 'Arrear Percentage', hostel: 'Hostel Residents' };

  return <>
    <div className="admin-analytics-tabs" role="tablist" aria-label="Analytics views">{([['profile', 'Batch Profile'], ['compare', 'Compare Two Batches'], ['trend', 'Six-Year Trends']] as [AnalyticsTab, string][]).map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}</div>
    {tab === 'profile' && <BatchProfileReport />}
    {tab === 'compare' && <>
    <div className="admin-comparison-controls"><label>First Batch<select value={firstBatch} onChange={event => { if (event.target.value !== secondBatch) setFirstBatch(event.target.value); }}>{availableBatches.map(year => <option key={year} value={year} disabled={year === secondBatch}>{year}</option>)}</select></label><span className="admin-versus">VS</span><label>Second Batch<select value={secondBatch} onChange={event => { if (event.target.value !== firstBatch) setSecondBatch(event.target.value); }}>{availableBatches.map(year => <option key={year} value={year} disabled={year === firstBatch}>{year}</option>)}</select></label></div>
    <div className="admin-comparison-grid">{[['Student Strength', compareFirst.length, compareSecond.length], ['Average CGPA', mean(compareFirst.map(student => student.cgpa)).toFixed(2), mean(compareSecond.map(student => student.cgpa)).toFixed(2)], ['Attendance', `${mean(compareFirst.map(student => student.attendance)).toFixed(1)}%`, `${mean(compareSecond.map(student => student.attendance)).toFixed(1)}%`], ['Pass Percentage', `${comparePassRate(compareFirst).toFixed(1)}%`, `${comparePassRate(compareSecond).toFixed(1)}%`]].map(([label, left, right]) => <article className="admin-comparison-card" key={String(label)}><span>{label}</span><div><strong>{left}</strong><strong>{right}</strong></div></article>)}</div>
    <div className="admin-section-title-row"><div><span className="admin-section-label">BATCH COMPARISON</span><h3>Academic and Student Profile Comparisons</h3></div></div>
    <div className="admin-analytics-chart-grid">{dimensions.map(dimension => <ChartPanel key={dimension.key} eyebrow="BATCH COMPARISON" title={dimension.label}><ComparisonDistributionChart first={compareFirst} second={compareSecond} dimension={dimension} firstLabel={firstBatch} secondLabel={secondBatch} /></ChartPanel>)}<ChartPanel eyebrow="ADMISSION PERFORMANCE" title="Cut-off Score Comparison"><CutoffComparisonChart first={compareFirst} second={compareSecond} firstLabel={firstBatch} secondLabel={secondBatch} /></ChartPanel><ChartPanel eyebrow="ACADEMIC PERFORMANCE" title="Academic Indicators"><AdminBarChart showLegend data={{ labels: ['Average CGPA (x10)', 'Attendance %', 'Pass %', 'Arrear %'], datasets: [{ label: firstBatch, data: [mean(compareFirst.map(student => student.cgpa)) * 10, mean(compareFirst.map(student => student.attendance)), comparePassRate(compareFirst), compareArrearRate(compareFirst)], backgroundColor: palette[0], borderRadius: 4 }, { label: secondBatch, data: [mean(compareSecond.map(student => student.cgpa)) * 10, mean(compareSecond.map(student => student.attendance)), comparePassRate(compareSecond), compareArrearRate(compareSecond)], backgroundColor: palette[1], borderRadius: 4 }] }} /></ChartPanel></div>
    </>}
    {tab === 'trend' && <>
    <div className="admin-trend-header"><div><span className="admin-section-label">{years[0]} – {years[years.length - 1]}</span><h3>Six-Year Institutional Trend</h3></div><select aria-label="Trend metric" value={metric} onChange={event => setMetric(event.target.value as typeof metric)}><option value="strength">Student Strength</option><option value="cgpa">Average CGPA</option><option value="pass">Pass Percentage</option><option value="attendance">Attendance</option><option value="arrears">Arrear Percentage</option><option value="hostel">Hostel Residents</option></select></div>
    <ChartPanel eyebrow="INSTITUTIONAL TREND" title={metricLabels[metric]} size="huge"><AdminLineChart data={{ labels: years, datasets: [{ label: metricLabels[metric], data: trendMetric, borderColor: palette[0], backgroundColor: `${palette[0]}20`, borderWidth: 2, fill: true, tension: 0.32, pointRadius: 3 }] }} /></ChartPanel>
    <div className="admin-section-title-row"><div><span className="admin-section-label">PROFILE TRENDS</span><h3>Distributions Across Available Batches</h3></div></div>
    <div className="admin-analytics-chart-grid">{dimensions.map(dimension => <ChartPanel key={dimension.key} eyebrow="BATCH TREND" title={dimension.label}><TrendDistributionChart batches={trendBatches} years={years} dimension={dimension} /></ChartPanel>)}<ChartPanel eyebrow="ADMISSION PERFORMANCE" title="Cut-off Score Trend"><CutoffTrendChart batches={trendBatches} years={years} /></ChartPanel></div>
    </>}
  </>;
}