import React, { useState } from 'react';
import { Table } from 'lucide-react';
import { batchOptions } from './adminData';

function Kpi({ label, foot, unit }: { label: string; foot: string; unit?: string }) {
  return (
    <article className="admin-pf-kpi">
      <span>{label}</span>
      <strong>—{unit && <small>{unit}</small>}</strong>
      <em>{foot}</em>
    </article>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return <div className="admin-section-title-row"><div><span className="admin-section-label">{label}</span><h3>{title}</h3></div></div>;
}

function EmptyProfileCard({
  eyebrow,
  title,
  subtitle = 'No student data available.',
  span = 6,
  tableColumns,
  children
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  span?: 6 | 12;
  tableColumns?: string[];
  children?: React.ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <section className={`admin-panel admin-pf-card span-${span}`}>
      <div className="admin-panel-header">
        <div>
          <span className="admin-section-label">{eyebrow}</span>
          <h3>{title}</h3>
          <p className="admin-pf-subtitle">{subtitle}</p>
        </div>
        {tableColumns && (
          <button
            type="button"
            className={`admin-pf-toggle${showTable ? ' active' : ''}`}
            onClick={() => setShowTable(value => !value)}
            aria-pressed={showTable}
            title={showTable ? 'Back to chart' : 'View data table'}
          >
            <Table size={14} />{showTable ? 'Chart' : 'Table'}
          </button>
        )}
      </div>
      {showTable && tableColumns ? (
        <div className="admin-pf-table-wrap">
          <table className="admin-data-table admin-pf-table">
            <thead><tr>{tableColumns.map(column => <th key={column}>{column}</th>)}</tr></thead>
            <tbody><tr><td colSpan={tableColumns.length} className="admin-empty-state">No student data available.</td></tr></tbody>
          </table>
        </div>
      ) : children ?? (
        <div className="admin-pf-chart" style={{ height: 270 }}>
          <div className="admin-empty-state">No student data available.</div>
        </div>
      )}
    </section>
  );
}

const frequencyColumns = (label: string) => [label, 'Frequency', 'Percent'];

function DonutCard({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <EmptyProfileCard eyebrow={eyebrow} title={title} tableColumns={frequencyColumns(title)}>
      <div className="admin-pf-donut">
        <div className="admin-pf-donut-chart"><div className="admin-empty-state">No student data available.</div></div>
        <div className="admin-pf-legend" />
      </div>
    </EmptyProfileCard>
  );
}

function BarCard({
  eyebrow,
  title,
  horizontal = false,
  height = 270,
  span = 6
}: {
  eyebrow: string;
  title: string;
  horizontal?: boolean;
  height?: number;
  span?: 6 | 12;
}) {
  return (
    <EmptyProfileCard eyebrow={eyebrow} title={title} span={span} tableColumns={frequencyColumns(title)}>
      <div className="admin-pf-chart" style={{ height }}>
        <div className="admin-empty-state">No student data available.</div>
        {horizontal && <div aria-hidden="true" />}
      </div>
    </EmptyProfileCard>
  );
}

export function BatchProfileReport() {
  const years = batchOptions.slice(1);
  const [year, setYear] = useState(years[0]);
  const emptyMessage = `No student data available for the ${year} batch.`;

  return <>
    <div className="admin-analytics-toolbar">
      <div>
        <span>Batch</span>
        <select value={year} onChange={event => setYear(event.target.value)} aria-label="Batch profile year">
          {years.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
    </div>

    <div className="admin-pf-kpis">
      <Kpi label="Total students" foot={`${year} batch · No data available`} />
      <Kpi label="Female students" foot="No data available" unit="%" />
      <Kpi label="Hostel residents" foot="No data available" unit="%" />
      <Kpi label="First-generation graduates" foot="No data available" unit="%" />
      <Kpi label="Average cut-off" foot="No data available" unit="/ 200" />
      <Kpi label="Districts covered" foot="No data available" />
    </div>

    <SectionTitle label="STUDENT PROFILE" title="Demographics" />
    <div className="admin-pf-grid">
      <DonutCard eyebrow="DEMOGRAPHICS" title="Gender" />
      <BarCard eyebrow="DEMOGRAPHICS" title="Community" />
      <BarCard eyebrow="DEMOGRAPHICS" title="Mother Tongue" />
      <DonutCard eyebrow="DEMOGRAPHICS" title="First Graduate" />
      <DonutCard eyebrow="FAMILY" title="Family Background" />
      <DonutCard eyebrow="FAMILY" title="Parents' Occupation" />
    </div>

    <SectionTitle label="RESIDENCE" title="Hostel and Location" />
    <div className="admin-pf-grid">
      <DonutCard eyebrow="RESIDENCE" title="Hosteller / Day Scholar" />
      <BarCard eyebrow="RESIDENCE" title="Residential Area" horizontal height={240} />
      <EmptyProfileCard eyebrow="GEOGRAPHY" title="District-wise Students" subtitle={emptyMessage} span={12} tableColumns={['District', 'Students']}>
        <div className="admin-pf-district no-map">
          <div className="admin-pf-district-facts">
            {['Districts covered', 'Students from other states'].map(label => (
              <div className="fact" key={label}><span>{label}</span><strong>—</strong></div>
            ))}
          </div>
          <div className="admin-pf-chart"><div className="admin-empty-state">{emptyMessage}</div></div>
        </div>
      </EmptyProfileCard>
    </div>

    <SectionTitle label="ADMISSION" title="Admission Route" />
    <div className="admin-pf-grid">
      <DonutCard eyebrow="ADMISSION" title="Admission Type" />
      <BarCard eyebrow="ADMISSION" title="Quota-wise Students" horizontal height={260} />
      <EmptyProfileCard
        eyebrow="ADMISSION ROUTE"
        title="Students by Admission Type, Gender and Residence"
        subtitle="How each admission route splits by gender, then hosteller or day scholar"
        span={12}
      >
        <div className="admin-pf-flow-grid"><div className="admin-empty-state">{emptyMessage}</div></div>
      </EmptyProfileCard>
    </div>

    <SectionTitle label="SCHOOLING" title="School Background" />
    <div className="admin-pf-grid">
      <DonutCard eyebrow="SCHOOLING" title="Board of Study" />
      <DonutCard eyebrow="SCHOOLING" title="Medium of Education" />
      <EmptyProfileCard
        eyebrow="SCHOOLING"
        title="Tamil Medium Students"
        tableColumns={['Admission', 'Quota', 'Students']}
      >
        <div className="admin-pf-chart" style={{ height: 270 }}>
          <div className="admin-empty-state">{emptyMessage}</div>
        </div>
      </EmptyProfileCard>
      <BarCard eyebrow="SCHOOLING" title="School" horizontal height={240} />
    </div>

    <SectionTitle label="CUT-OFF MARK" title="Cut-off Mark Distribution" />
    <div className="admin-pf-grid">
      <EmptyProfileCard eyebrow="CUT-OFF MARK" title="Overall Cut-off Mark" subtitle={emptyMessage} span={12} tableColumns={frequencyColumns('Cut-off mark')}>
        <div className="admin-pf-chart" style={{ height: 270 }}><div className="admin-empty-state">{emptyMessage}</div></div>
      </EmptyProfileCard>
      <EmptyProfileCard eyebrow="CUT-OFF MARK" title="Counselling Cut-off Mark" subtitle={emptyMessage} tableColumns={frequencyColumns('Cut-off mark')}>
        <div className="admin-pf-chart" style={{ height: 270 }}><div className="admin-empty-state">{emptyMessage}</div></div>
      </EmptyProfileCard>
      <EmptyProfileCard eyebrow="CUT-OFF MARK" title="Management Cut-off Mark" subtitle={emptyMessage} tableColumns={frequencyColumns('Cut-off mark')}>
        <div className="admin-pf-chart" style={{ height: 270 }}><div className="admin-empty-state">{emptyMessage}</div></div>
      </EmptyProfileCard>
      <EmptyProfileCard
        eyebrow="CUT-OFF MARK"
        title="Cut-off Mark by Quota"
        subtitle="Maximum, average and minimum cut-off for each admission quota"
        span={12}
      >
        <div className="admin-pf-split">
          <div className="admin-pf-chart" style={{ height: 270 }}><div className="admin-empty-state">{emptyMessage}</div></div>
          <div className="admin-pf-chart" style={{ height: 270 }}><div className="admin-empty-state">{emptyMessage}</div></div>
        </div>
      </EmptyProfileCard>
    </div>
  </>;
}
