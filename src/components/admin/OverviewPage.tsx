import React, { useMemo, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Student } from '../../types';
import { AdminPage } from './AdminSidebar';
import { curriculumSemesters } from './courseCurriculum';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

const deepTeal = '#0B2F31';
const teal = '#14736E';
const oliveGreen = '#5A6B3D';
const orange = '#F28C18';
const goldenYellow = '#F6B23D';
const warmCream = '#F2E9D8';
const labelFont = '600 12px Inter, system-ui, sans-serif';
const romanSemesters = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

// Splits a long subject name into at most two short lines so it never gets cut off
function wrapLabel(text: string, max = 26): string[] {
  const lines: string[] = [];
  let line = '';
  text.split(' ').forEach(word => {
    if (line && `${line} ${word}`.length > max) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  });
  if (line) lines.push(line);
  const out = lines.slice(0, 2);
  if (lines.length > 2) out[1] = `${out[1]}…`;
  return out;
}

// Shares a total across weights so the parts add up exactly to the total
function allocate(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map(weight => (weight / sum) * total);
  const parts = raw.map(Math.floor);
  let left = total - parts.reduce((a, b) => a + b, 0);
  raw.map((value, index) => ({ index, fraction: value - Math.floor(value) })).sort((a, b) => b.fraction - a.fraction).forEach(({ index }) => { if (left > 0) { parts[index] += 1; left -= 1; } });
  return parts;
}

// Draws the value above each column
const makeColumnLabels = (suffix: string) => ({
  id: `columnLabels${suffix}`,
  afterDatasetsDraw(chart: ChartJS) {
    const { ctx } = chart;
    ctx.save();
    ctx.font = labelFont;
    ctx.fillStyle = '#1f2926';
    ctx.textAlign = 'center';
    chart.getDatasetMeta(0).data.forEach((bar, index) => ctx.fillText(`${chart.data.datasets[0].data[index]}${suffix}`, bar.x, bar.y - 8));
    ctx.restore();
  }
});
const countLabels = makeColumnLabels('');

// Draws the value at the end of each horizontal bar
const barEndLabels = {
  id: 'barEndLabels',
  afterDatasetsDraw(chart: ChartJS) {
    const { ctx } = chart;
    ctx.save();
    ctx.font = labelFont;
    ctx.fillStyle = '#1f2926';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    chart.getDatasetMeta(0).data.forEach((bar, index) => ctx.fillText(String(chart.data.datasets[0].data[index]), bar.x + 8, bar.y));
    ctx.restore();
  }
};

export function OverviewPage({ students, onNavigate }: { students: Student[]; onNavigate: (page: AdminPage) => void }) {
  // The current batch is always the newest batch in the data, so this keeps working as new years are added
  const currentYear = useMemo(() => students.reduce((latest, student) => Math.max(latest, student.academicYear), 0), [students]);
  const data = useMemo(() => students.filter(student => student.academicYear === currentYear), [students, currentYear]);
  const batchLabel = data[0]?.batch ?? String(currentYear);
  const semester = data.reduce((latest, student) => Math.max(latest, student.currentSemester), 1);

  useEffect(() => {
    document.documentElement.style.setProperty('--admin-bg', warmCream);
    document.body.classList.add('admin-overview-active');
    return () => {
      document.documentElement.style.removeProperty('--admin-bg');
      document.body.classList.remove('admin-overview-active');
    };
  }, []);

  // KPI cards
  const totalStudentsAll = data.length;
  const maleStudentsAll = data.filter(student => student.gender === 'Male').length;
  const femaleStudentsAll = data.filter(student => student.gender === 'Female').length;
  const past6YearsStudents = students.filter(student => student.academicYear >= currentYear - 6 && student.academicYear <= currentYear).length;

  // Student Enrollment by Academic Year
  const enrollmentByYear = useMemo(() => {
    const years = Array.from(new Set(students.map(s => s.academicYear))).sort((a, b) => a - b);
    return years.map(year => ({
      year: String(year),
      count: students.filter(s => s.academicYear === year).length
    }));
  }, [students]);

  // Batch-wise Student Distribution
  const distributionByBatch = useMemo(() => {
    const batches = Array.from(new Set(students.map(s => s.batch))).sort((a, b) => a.localeCompare(b));
    return batches.map(batch => ({
      batch,
      count: students.filter(s => s.batch === batch).length
    }));
  }, [students]);

  // CGPA distribution
  const bands = [
    ['Below 6', data.filter(student => student.cgpa < 6).length],
    ['6 – 6.9', data.filter(student => student.cgpa >= 6 && student.cgpa < 7).length],
    ['7 – 7.9', data.filter(student => student.cgpa >= 7 && student.cgpa < 8).length],
    ['8 – 8.9', data.filter(student => student.cgpa >= 8 && student.cgpa < 9).length],
    ['9 and above', data.filter(student => student.cgpa >= 9).length]
  ] as const;

  // Students needing attention (current batch only)
  const withArrears = useMemo(() => data.filter(student => student.backlogs > 0), [data]);
  const attention = useMemo(() => [...withArrears].sort((left, right) => right.backlogs - left.backlogs || left.cgpa - right.cgpa).slice(0, 5), [withArrears]);
  const hasStudentData = students.length > 0;

  return (
    <div className="admin-overview-page-wrapper">
      <div className="admin-ov-kpis">
        <article className="admin-ov-card">
          <span className="admin-ov-label">Total Students</span>
          <strong className="admin-ov-value">{hasStudentData ? totalStudentsAll.toLocaleString() : '—'}</strong>
          <span className="admin-ov-note">{hasStudentData ? 'Current academic year' : 'No student records available'}</span>
        </article>

        <article className="admin-ov-card">
          <span className="admin-ov-label">Male Students</span>
          <strong className="admin-ov-value">{hasStudentData ? maleStudentsAll.toLocaleString() : '—'}</strong>
          <span className="admin-ov-note">{hasStudentData ? 'Male students in current year' : 'No student records available'}</span>
        </article>

        <article className="admin-ov-card">
          <span className="admin-ov-label">Female Students</span>
          <strong className="admin-ov-value">{hasStudentData ? femaleStudentsAll.toLocaleString() : '—'}</strong>
          <span className="admin-ov-note">{hasStudentData ? 'Female students in current year' : 'No student records available'}</span>
        </article>

        <article className="admin-ov-card">
          <span className="admin-ov-label">Seven-Year Student Strength</span>
          <strong className="admin-ov-value">{hasStudentData ? past6YearsStudents.toLocaleString() : '—'}</strong>
          <span className="admin-ov-note">{hasStudentData ? 'Total students over 7 years' : 'No student records available'}</span>
        </article>
      </div>

      <div className="admin-ov-row">
        <section className="admin-panel">
          <div className="admin-panel-header"><div><h3>Student Enrollment by Academic Year</h3></div></div>
          <div className="admin-chart-box large">
            {!hasStudentData ? <div className="admin-empty-state">No student data available.</div> :
            <Bar
              plugins={[countLabels]}
              data={{ labels: enrollmentByYear.map(item => item.year), datasets: [{ label: 'Students', data: enrollmentByYear.map(item => item.count), backgroundColor: teal, borderRadius: 5, maxBarThickness: 40 }] }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { top: 24 } },
                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2926', padding: 10, callbacks: { label: item => ` ${item.parsed.y} students` } } },
                scales: {
                  x: { grid: { display: false }, border: { display: false }, ticks: { color: '#78817d', font: { size: 12 } } },
                  y: { beginAtZero: true, grid: { color: '#edf0ee' }, border: { display: false }, ticks: { precision: 0, color: '#78817d', font: { size: 12 } } }
                }
              }}
            />}
          </div>
          <p className="admin-ov-caption">Enrollment trends across available academic years.</p>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header"><div><h3>Batch-wise Student Distribution</h3></div></div>
          <div className="admin-chart-box large">
            {!hasStudentData ? <div className="admin-empty-state">No student data available.</div> :
            <Bar
              plugins={[barEndLabels]}
              data={{ labels: distributionByBatch.map(item => item.batch), datasets: [{ label: 'Students', data: distributionByBatch.map(item => item.count), backgroundColor: oliveGreen, borderRadius: 5, maxBarThickness: 24 }] }}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { right: 28 } },
                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2926', padding: 10, callbacks: { title: items => distributionByBatch[items[0].dataIndex].batch, label: item => ` ${item.parsed.x} students` } } },
                scales: {
                  x: { beginAtZero: true, grid: { color: '#edf0ee' }, border: { display: false }, ticks: { precision: 0, color: '#78817d', font: { size: 12 } } },
                  y: { grid: { display: false }, border: { display: false }, ticks: { autoSkip: false, color: '#3d4944', font: { size: 12 } } }
                }
              }}
            />}
          </div>
          <p className="admin-ov-caption">Comparison of student counts across batches.</p>
        </section>
      </div>

      <div className="admin-ov-row">
        <section className="admin-panel">
          <div className="admin-panel-header"><div><h3>CGPA Distribution</h3></div></div>
          <div className="admin-chart-box">
            {!hasStudentData ? <div className="admin-empty-state">No student data available.</div> :
            <Bar
              plugins={[countLabels]}
              data={{ labels: bands.map(([label]) => label), datasets: [{ label: 'Students', data: bands.map(([, count]) => count), backgroundColor: deepTeal, borderRadius: 6, maxBarThickness: 54 }] }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { top: 24 } },
                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2926', padding: 10, callbacks: { label: item => ` ${item.parsed.y} students` } } },
                scales: {
                  x: { grid: { display: false }, border: { display: false }, ticks: { color: '#78817d', font: { size: 12 } } },
                  y: { beginAtZero: true, grid: { color: '#edf0ee' }, border: { display: false }, ticks: { precision: 0, color: '#78817d', font: { size: 12 } } }
                }
              }}
            />}
          </div>
          <p className="admin-ov-caption">Number of students in each CGPA band.</p>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header"><div><h3>Students Needing Attention</h3></div><button className="admin-text-button" onClick={() => onNavigate('students')}>View all <ArrowRight size={13} /></button></div>
          <ul className="admin-ov-list">{attention.length === 0 ? <li className="admin-ov-empty">{hasStudentData ? 'No students have arrears.' : 'No student records available.'}</li> : attention.map(student => <li key={student.id}><div><strong>{student.name}</strong><small>{student.rollNo}</small></div><span className="admin-ov-chip warn">{student.backlogs} {student.backlogs === 1 ? 'arrear' : 'arrears'}</span></li>)}</ul>
        </section>
      </div>
    </div>
  );
}