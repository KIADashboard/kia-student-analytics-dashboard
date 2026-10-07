import React, { useMemo, useState } from 'react';
import { ArrowRight, Award, BookOpen, CircleAlert, GraduationCap, UsersRound } from 'lucide-react';
import { Student } from '../../types';
import { AdminBarChart, AdminLineChart } from './AdminChart';
import { batchOptions, countsFor, mean, studentsForBatch } from './adminData';
import { AdminPage } from './AdminSidebar';

const colors = ['#0f766e', '#d97706', '#2563eb', '#7c3aed'];

export function OverviewPage({
  students,
  onNavigate
}: {
  students: Student[];
  onNavigate: (page: AdminPage) => void;
}) {
  const [batch, setBatch] = useState('all');
  const data = useMemo(() => studentsForBatch(students, batch), [students, batch]);
  const arrears = data.filter(student => student.backlogs > 0);
  const cgpa = mean(data.map(student => student.cgpa));
  const attendance = mean(data.map(student => student.attendance));
  const genderCounts = countsFor(data, student => student.gender);
  const trendYears = ['2021', '2022', '2023', '2024', '2025'];
  const trend = trendYears.map(year => mean(studentsForBatch(students, year).map(student => student.cgpa)));
  const batchCounts = trendYears.map(year => studentsForBatch(students, year).length);

  const kpis = [
    { label: 'Total Students', value: data.length.toLocaleString(), icon: UsersRound, tone: 'teal' },
    { label: 'Average CGPA', value: cgpa.toFixed(2), icon: Award, tone: 'blue' },
    { label: 'Average Attendance', value: `${attendance.toFixed(1)}%`, icon: BookOpen, tone: 'purple' },
    { label: 'Students With Arrears', value: arrears.length.toLocaleString(), icon: CircleAlert, tone: 'amber' }
  ];

  return (
    <>
      <div className="admin-page-heading-row">
        <div>
          <h2>College Overview</h2>
        </div>
        <div className="admin-page-actions">
          <select
            className="admin-select-input"
            value={batch}
            onChange={event => setBatch(event.target.value)}
            aria-label="Filter by batch"
          >
            {batchOptions.map(option => (
              <option key={option} value={option}>
                {option === 'all' ? 'All Batches' : `Batch ${option}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-kpi-grid">
        {kpis.map(({ label, value, icon: Icon, tone }) => (
          <article className="admin-kpi-card" key={label}>
            <div className="admin-kpi-top">
              <span>{label}</span>
              <span className={`admin-kpi-icon ${tone}`}>
                <Icon size={18} strokeWidth={2} />
              </span>
            </div>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="admin-mini-stat-grid">
        <div>
          <span>Male Students</span>
          <strong>{genderCounts.Male ?? 0}</strong>
        </div>
        <div>
          <span>Female Students</span>
          <strong>{genderCounts.Female ?? 0}</strong>
        </div>
        <div>
          <span>Hostel Students</span>
          <strong>{data.filter(student => student.residentialType !== 'Day Scholar').length}</strong>
        </div>
        <div>
          <span>Day Scholars</span>
          <strong>{data.filter(student => student.residentialType === 'Day Scholar').length}</strong>
        </div>
        <div>
          <span>No Arrears</span>
          <strong>{data.length - arrears.length}</strong>
        </div>
        <div>
          <span>Graduation Eligible</span>
          <strong>{data.filter(student => student.creditsEarned >= student.totalCredits - 8).length}</strong>
        </div>
      </div>

      <div className="admin-section-title-row">
        <div>
          <h3>Institutional Performance</h3>
        </div>
        <button className="admin-text-button" onClick={() => onNavigate('academic')}>
          View detailed performance <ArrowRight size={14} />
        </button>
      </div>

      <div className="admin-performance-grid">
        {[
          ['Average CGPA', cgpa.toFixed(2), cgpa * 10],
          ['Pass Percentage', `${(100 - (arrears.length / Math.max(1, data.length)) * 100).toFixed(1)}%`, 100 - (arrears.length / Math.max(1, data.length)) * 100],
          ['Average Attendance', `${attendance.toFixed(1)}%`, attendance],
          ['Arrear Percentage', `${((arrears.length / Math.max(1, data.length)) * 100).toFixed(1)}%`, (arrears.length / Math.max(1, data.length)) * 100]
        ].map(([label, value, width]) => (
          <div className="admin-performance-card" key={String(label)}>
            <span>{label}</span>
            <strong>{value}</strong>
            <div className="admin-meter">
              <i style={{ width: `${Math.max(0, Math.min(100, Number(width)))}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-chart-grid two-columns">
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h3>Academic Progress</h3>
            </div>
          </div>
          <div className="admin-chart-box large">
            <AdminLineChart
              data={{
                labels: trendYears,
                datasets: [
                  {
                    label: 'Average CGPA',
                    data: trend,
                    borderColor: colors[0],
                    backgroundColor: `${colors[0]}18`,
                    borderWidth: 2.5,
                    tension: 0.35,
                    pointRadius: 3,
                    fill: true
                  }
                ]
              }}
            />
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h3>Students by Batch</h3>
            </div>
          </div>
          <div className="admin-chart-box large">
            <AdminBarChart
              data={{
                labels: trendYears,
                datasets: [
                  {
                    label: 'Students',
                    data: batchCounts,
                    backgroundColor: colors[0],
                    borderRadius: 6,
                    maxBarThickness: 32
                  }
                ]
              }}
            />
          </div>
        </section>
      </div>

      <div className="admin-overview-bottom-grid">
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h3>Arrear Overview</h3>
            </div>
          </div>
          <div className="admin-arrear-overview">
            <div>
              <span>Active Students</span>
              <strong>{arrears.length}</strong>
            </div>
            <div>
              <span>Total Arrears</span>
              <strong>{data.reduce((total, student) => total + student.backlogs, 0)}</strong>
            </div>
            <div>
              <span>Cleared</span>
              <strong>{data.reduce((total, student) => total + Math.max(0, student.semesterGrades.filter(grade => grade.status !== 'Passed').length), 0)}</strong>
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h3>Administration</h3>
            </div>
          </div>
          <div className="admin-quick-actions">
            <button onClick={() => onNavigate('students')}>
              <UsersRound size={16} />
              <span>Student Directory</span>
            </button>
            <button onClick={() => onNavigate('analytics')}>
              <GraduationCap size={16} />
              <span>Batch Analytics</span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}