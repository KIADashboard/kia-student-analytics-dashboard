import React, { useEffect, useMemo, useState } from 'react';
import { AdminBarChart, AdminDoughnutChart } from './AdminChart';
import { batchOptionsFor } from './adminData';
import { getAnalyticsDistributions } from '../../api';
import { Student } from '../../types';

type DistItem = { label: string; count: number };
type Distributions = Record<string, DistItem[]>;

const palette = ['#1f5f52', '#c28a35', '#527aa5', '#75679a', '#b65d5d', '#3c8069', '#8a6b45', '#5c8a99'];

interface ChartSpec {
  key: string;
  label: string;
  chart: 'bar' | 'doughnut';
  horizontal?: boolean;
}

const CHART_SPECS: ChartSpec[] = [
  { key: 'gender', label: 'Gender Distribution', chart: 'doughnut' },
  { key: 'community', label: 'Community', chart: 'bar' },
  { key: 'residence', label: 'Hostel vs Day Scholar', chart: 'doughnut' },
  { key: 'quota', label: 'Admission Quota', chart: 'bar', horizontal: true },
  { key: 'first_generation', label: 'First-Generation Graduates', chart: 'doughnut' },
  { key: 'agriculture', label: 'Agricultural Background', chart: 'doughnut' },
  { key: 'school_type', label: 'School Type', chart: 'bar' },
  { key: 'income', label: 'Family Income Category', chart: 'bar' },
  { key: 'district', label: 'District', chart: 'bar', horizontal: true },
  { key: 'state', label: 'State', chart: 'bar', horizontal: true },
  { key: 'cutoff_bands', label: 'Cutoff / CGPA Distribution', chart: 'bar' },
  { key: 'area_type', label: 'Area of Residence (Rural/Urban)', chart: 'doughnut' },
  { key: 'religion', label: 'Religion', chart: 'bar' },
  { key: 'board_of_study', label: 'Board of Study', chart: 'bar' },
  { key: 'medium', label: 'Medium of Study', chart: 'bar' },
  { key: 'studied_tamil', label: 'Studied Tamil in XII', chart: 'doughnut' },
  { key: 'family_background', label: 'Family Background', chart: 'bar' },
  { key: 'school_medium', label: 'School Medium (X Std)', chart: 'bar' },
];

function DistributionPanel({
  spec,
  data,
  colorIndex,
}: {
  spec: ChartSpec;
  data: DistItem[] | undefined;
  colorIndex: number;
}) {
  const items = data ?? [];
  const color = palette[colorIndex % palette.length];

  const chartData = {
    labels: items.map(item => item.label),
    datasets: [
      {
        data: items.map(item => item.count),
        backgroundColor: spec.chart === 'doughnut'
          ? items.map((_, i) => palette[i % palette.length])
          : color,
        borderRadius: 4,
        borderWidth: 0,
        maxBarThickness: 28,
      },
    ],
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <span className="admin-section-label">BATCH PROFILE</span>
          <h3>{spec.label}</h3>
        </div>
      </div>
      <div className="admin-chart-box">
        {items.length === 0 ? (
          <div className="admin-empty-state">No data available.</div>
        ) : spec.chart === 'doughnut' ? (
          <AdminDoughnutChart data={chartData} />
        ) : (
          <AdminBarChart horizontal={spec.horizontal} data={chartData} />
        )}
      </div>
    </section>
  );
}

export function BatchProfileReport({ students }: { students?: Student[] }) {
  const [batch, setBatch] = useState('all');
  const [distributions, setDistributions] = useState<Distributions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const batchOptions = useMemo(() => (students ? batchOptionsFor(students) : ['all']), [students]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getAnalyticsDistributions(batch)
      .then(data => {
        if (active) setDistributions(data);
      })
      .catch(err => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load distributions.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [batch]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <span className="admin-section-label">FILTER BY BATCH</span>
        <select
          className="admin-large-filter"
          value={batch}
          onChange={e => setBatch(e.target.value)}
          aria-label="Select batch year for profile distributions"
        >
          {batchOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt === 'all' ? 'All Batches' : opt}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="admin-empty-state">Loading batch profile data…</p>}
      {error && <p className="admin-profile-export-error" role="alert">{error}</p>}

      {!loading && !error && distributions && (
        <div className="admin-analytics-chart-grid">
          {CHART_SPECS.map((spec, index) => (
            <DistributionPanel
              key={spec.key}
              spec={spec}
              data={distributions[spec.key]}
              colorIndex={index}
            />
          ))}
        </div>
      )}
    </>
  );
}
