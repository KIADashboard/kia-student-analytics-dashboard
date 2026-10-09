import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Student } from '../../types';
import { AdminPage } from './AdminSidebar';
import { curriculumSemesters } from './courseCurriculum';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

const green = '#1f5f52';
const lightGreen = '#a9cabd';
const amber = '#c28a35';
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

  // KPI cards
  const male = data.filter(student => student.gender === 'Male').length;
  const female = data.filter(student => student.gender === 'Female').length;
  const dayScholars = data.filter(student => student.residentialType === 'Day Scholar').length;
  const hostellers = data.length - dayScholars;

  // Pass percentage (students with no arrears) and how arrears are spread
  const withArrears = data.filter(student => student.backlogs > 0);
  const totalPapers = withArrears.reduce((total, student) => total + student.backlogs, 0);
  const pass = data.length ? ((data.length - withArrears.length) / data.length) * 100 : 0;
  const passSplit = [
    { label: 'No arrears', count: data.length - withArrears.length, color: green },
    { label: '1 arrear paper', count: withArrears.filter(student => student.backlogs === 1).length, color: '#e6c48f' },
    { label: '2 arrear papers', count: withArrears.filter(student => student.backlogs === 2).length, color: amber },
    { label: '3 or more papers', count: withArrears.filter(student => student.backlogs >= 3).length, color: '#8a5a14' }
  ];
  const passCenter = {
    id: 'passCenter',
    afterDraw(chart: ChartJS) {
      const { ctx, chartArea } = chart;
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1f2926';
      ctx.font = "600 28px Outfit, Inter, system-ui, sans-serif";
      ctx.fillText(`${pass.toFixed(1)}%`, x, y + 4);
      ctx.fillStyle = '#78817d';
      ctx.font = "500 12px Inter, system-ui, sans-serif";
      ctx.fillText('passed', x, y + 24);
      ctx.restore();
    }
  };

  // Subjects with most arrears: the subjects this batch has studied so far, with the batch's arrear papers shared across them
  const topSubjects = useMemo(() => {
    const studied = new Map<string, { code: string; weight: number }>();
    curriculumSemesters.filter(item => romanSemesters.slice(0, semester).includes(item.semester)).forEach(item => item.courses.forEach(course => {
      if (!studied.has(course.title)) studied.set(course.title, { code: course.code, weight: course.activeBacklogs });
    }));
    const titles = [...studied.keys()];
    const counts = allocate(titles.map(title => studied.get(title)?.weight ?? 0), totalPapers);
    return titles.map((title, index) => ({ title, code: studied.get(title)?.code ?? '', count: counts[index] })).filter(item => item.count > 0).sort((left, right) => right.count - left.count).slice(0, 5);
  }, [semester, totalPapers]);

  // CGPA distribution
  const bands = [
    ['Below 6', data.filter(student => student.cgpa < 6).length],
    ['6 – 6.9', data.filter(student => student.cgpa >= 6 && student.cgpa < 7).length],
    ['7 – 7.9', data.filter(student => student.cgpa >= 7 && student.cgpa < 8).length],
    ['8 – 8.9', data.filter(student => student.cgpa >= 8 && student.cgpa < 9).length],
    ['9 and above', data.filter(student => student.cgpa >= 9).length]
  ] as const;

  // Students needing attention (current batch only)
  const attention = useMemo(() => [...withArrears].sort((left, right) => right.backlogs - left.backlogs || left.cgpa - right.cgpa).slice(0, 5), [withArrears]);

  return (
    <>
      <div className="admin-ov-kpis">
        <article className="admin-ov-card" style={{ ['--i' as string]: 0 }}>
          <span className="admin-ov-label">Total students</span>
          <strong className="admin-ov-value">{data.length.toLocaleString()}</strong>
          <span className="admin-ov-sub">Batch {batchLabel}</span>
          <span className="admin-ov-note">Currently in semester {semester}</span>
        </article>

        <article className="admin-ov-card" style={{ ['--i' as string]: 1 }}>
          <span className="admin-ov-label">Gender ratio</span>
          <div className="admin-ov-pair">
            <div><span>Male</span><strong>{male}</strong></div>
            <div><span>Female</span><strong>{female}</strong></div>
          </div>
          <span className="admin-ov-note">{female > 0 ? `${(male / female).toFixed(2)} male for every 1 female` : 'No female students on record'}</span>
        </article>

        <article className="admin-ov-card" style={{ ['--i' as string]: 2 }}>
          <span className="admin-ov-label">Residence</span>
          <div className="admin-ov-pair">
            <div><span>Hostellers</span><strong>{hostellers}</strong></div>
            <div><span>Day scholars</span><strong>{dayScholars}</strong></div>
          </div>
          <span className="admin-ov-note">Hostel and day scholar strength of the batch</span>
        </article>
      </div>

      <div className="admin-ov-row">
        <section className="admin-panel">
          <div className="admin-panel-header"><div><h3>Pass Percentage</h3></div></div>
          <div className="admin-ov-donut">
            <div className="admin-ov-donut-chart">
              <Doughnut
                plugins={[passCenter]}
                data={{ labels: passSplit.map(item => item.label), datasets: [{ data: passSplit.map(item => item.count), backgroundColor: passSplit.map(item => item.color), borderWidth: 2, borderColor: '#fff' }] }}
                options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2926', padding: 10, callbacks: { label: item => ` ${item.parsed} students` } } } }}
              />
            </div>
            <ul className="admin-ov-donut-legend">{passSplit.map(item => <li key={item.label}><i style={{ background: item.color }} /><span>{item.label}</span><strong>{item.count}</strong></li>)}</ul>
          </div>
          <p className="admin-ov-caption">Students of batch {batchLabel} who have cleared every paper, and how many have arrears.</p>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header"><div><h3>Subjects with Most Arrears</h3></div></div>
          <div className="admin-chart-box large">
            {topSubjects.length === 0 ? <p className="admin-ov-empty">No arrears in this batch.</p> : (
              <Bar
                plugins={[barEndLabels]}
                data={{ labels: topSubjects.map(item => wrapLabel(item.title)), datasets: [{ label: 'Arrear papers', data: topSubjects.map(item => item.count), backgroundColor: amber, borderRadius: 5, maxBarThickness: 24 }] }}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  layout: { padding: { right: 28 } },
                  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2926', padding: 10, callbacks: { title: items => topSubjects[items[0].dataIndex].title, label: item => ` ${item.parsed.x} arrear papers` } } },
                  scales: {
                    x: { beginAtZero: true, grid: { color: '#edf0ee' }, border: { display: false }, ticks: { precision: 0, color: '#78817d', font: { size: 12 } } },
                    y: { grid: { display: false }, border: { display: false }, ticks: { autoSkip: false, color: '#3d4944', font: { size: 12 } } }
                  }
                }}
              />
            )}
          </div>
          <p className="admin-ov-caption">Arrear papers in the subjects this batch has studied so far.</p>
        </section>
      </div>

      <div className="admin-ov-row">
        <section className="admin-panel">
          <div className="admin-panel-header"><div><h3>CGPA Distribution</h3></div></div>
          <div className="admin-chart-box">
            <Bar
              plugins={[countLabels]}
              data={{ labels: bands.map(([label]) => label), datasets: [{ label: 'Students', data: bands.map(([, count]) => count), backgroundColor: lightGreen, borderRadius: 6, maxBarThickness: 54 }] }}
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
            />
          </div>
          <p className="admin-ov-caption">Number of students in each CGPA band.</p>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header"><div><h3>Students Needing Attention</h3></div><button className="admin-text-button" onClick={() => onNavigate('students')}>View all <ArrowRight size={13} /></button></div>
          <ul className="admin-ov-list">{attention.length === 0 ? <li className="admin-ov-empty">No students have arrears.</li> : attention.map(student => <li key={student.id}><div><strong>{student.name}</strong><small>{student.rollNo}</small></div><span className="admin-ov-chip warn">{student.backlogs} {student.backlogs === 1 ? 'arrear' : 'arrears'}</span></li>)}</ul>
        </section>
      </div>
    </>
  );
}