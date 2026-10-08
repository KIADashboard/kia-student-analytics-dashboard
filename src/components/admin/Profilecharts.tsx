import React, { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import type { ChartOptions, Plugin } from 'chart.js';
import { Table } from 'lucide-react';
import './AdminChart';
import { CutoffProfile, FlowAdmission, QuotaCutoff, Slice } from './batchProfileData';

export const palette = ['#1f5f52', '#c28a35', '#527aa5', '#75679a', '#b65d5d', '#3c8069', '#8a6b45', '#5c8a99'];
const gridColor = '#edf0ee';
const tooltipBase = { backgroundColor: '#1f2926', padding: 12, titleFont: { size: 13, weight: 600 }, bodyFont: { size: 12.5 }, cornerRadius: 8, boxPadding: 4 };

export const sum = (items: Slice[]) => items.reduce((total, item) => total + item.value, 0);
export const percent = (value: number, total: number) => (total ? (value / total) * 100 : 0);
const fmt = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));
const topNote = (items: Slice[]) => {
  const total = sum(items);
  const top = items.reduce((best, item) => (item.value > best.value ? item : best), items[0]);
  return `${top.label} is the largest group at ${percent(top.value, total).toFixed(1)}%`;
};

/* ---------- Chart.js plugins (no extra packages needed) ---------- */
const valueLabels: Plugin = {
  id: 'valueLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const horizontal = (chart.options as { indexAxis?: string }).indexAxis === 'y';
    ctx.save();
    ctx.font = "600 12px 'Inter', system-ui, sans-serif";
    ctx.fillStyle = '#4e5955';
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;
      meta.data.forEach((element, index) => {
        const raw = dataset.data[index];
        if (raw === null || raw === undefined) return;
        const { x, y } = element.getProps(['x', 'y'], true) as { x: number; y: number };
        const text = fmt(Number(raw));
        if (meta.type === 'line') { ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(text, x, y - 9); }
        else if (horizontal) { ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, x + 8, y); }
        else { ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(text, x, y - 6); }
      });
    });
    ctx.restore();
  }
};

const centerText: Plugin = {
  id: 'centerText',
  afterDraw(chart, _args, options) {
    const { value, label } = (options ?? {}) as { value?: number; label?: string };
    if (value === undefined) return;
    const { ctx, chartArea } = chart;
    const cx = (chartArea.left + chartArea.right) / 2;
    const cy = (chartArea.top + chartArea.bottom) / 2;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1f2926';
    ctx.font = "600 28px 'Outfit', 'Inter', system-ui, sans-serif";
    ctx.fillText(String(value), cx, cy - 6);
    ctx.fillStyle = '#78817d';
    ctx.font = "500 12px 'Inter', system-ui, sans-serif";
    ctx.fillText(label ?? '', cx, cy + 16);
    ctx.restore();
  }
};

const pointer = (event: { native: Event | null }, elements: unknown[]) => {
  const target = event.native?.target as HTMLElement | null | undefined;
  if (target) target.style.cursor = elements.length ? 'pointer' : 'default';
};

/* ---------- Card frame (hover lift, optional data table) ---------- */
export interface TableSpec { columns: string[]; rows: (string | number)[][] }

export function ProfileCard({ eyebrow, title, subtitle, span = 6, table, children }: {
  eyebrow: string; title: string; subtitle?: string; span?: 6 | 12; table?: TableSpec; children: React.ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <section className={`admin-panel admin-pf-card span-${span}`}>
      <div className="admin-panel-header">
        <div><span className="admin-section-label">{eyebrow}</span><h3>{title}</h3>{subtitle && <p className="admin-pf-subtitle">{subtitle}</p>}</div>
        {table && <button type="button" className={`admin-pf-toggle${showTable ? ' active' : ''}`} onClick={() => setShowTable(value => !value)} aria-pressed={showTable} title={showTable ? 'Back to chart' : 'View data table'}><Table size={14} />{showTable ? 'Chart' : 'Table'}</button>}
      </div>
      {showTable && table
        ? <div className="admin-pf-table-wrap"><table className="admin-data-table admin-pf-table"><thead><tr>{table.columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row, index) => <tr key={index} className={row[0] === 'Total' ? 'total' : undefined}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
        : children}
    </section>
  );
}

const frequencyTable = (items: Slice[], first: string): TableSpec => {
  const total = sum(items);
  return { columns: [first, 'Frequency', 'Percent'], rows: [...items.map(item => [item.label, item.value, `${percent(item.value, total).toFixed(1)}%`]), ['Total', total, '100%']] };
};

/* ---------- Doughnut with centre total and linked legend ---------- */
export function DonutCard({ eyebrow, title, label, data }: { eyebrow: string; title: string; label: string; data: Slice[] }) {
  const [active, setActive] = useState<number | null>(null);
  const total = sum(data);
  const colors = data.map((_, index) => palette[index % palette.length]);
  const options = {
    responsive: true, maintainAspectRatio: false, cutout: '66%', layout: { padding: 12 },
    animation: { duration: 500 },
    onHover: (event: { native: Event | null }, elements: { index: number }[]) => { pointer(event, elements); setActive(elements.length ? elements[0].index : null); },
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltipBase, callbacks: { label: (context: { raw: unknown; label: string }) => ` ${context.label}: ${context.raw} · ${percent(Number(context.raw), total).toFixed(1)}%` } },
      centerText: { value: total, label }
    }
  } as unknown as ChartOptions<'doughnut'>;
  return (
    <ProfileCard eyebrow={eyebrow} title={title} subtitle={topNote(data)} table={frequencyTable(data, title)}>
      <div className="admin-pf-donut">
        <div className="admin-pf-donut-chart">
          <Doughnut plugins={[centerText]} options={options} data={{ labels: data.map(item => item.label), datasets: [{ data: data.map(item => item.value), backgroundColor: colors.map((color, index) => (active === null || active === index ? color : `${color}55`)), borderColor: '#ffffff', borderWidth: 2, hoverOffset: 8 }] }} />
        </div>
        <ul className="admin-pf-legend">
          {data.map((item, index) => (
            <li key={item.label} className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)}>
              <i style={{ background: colors[index] }} /><span>{item.label}</span><strong>{item.value}</strong><em>{percent(item.value, total).toFixed(1)}%</em>
            </li>
          ))}
          <li className="total"><span>Total</span><strong>{total}</strong><em>100%</em></li>
        </ul>
      </div>
    </ProfileCard>
  );
}

/* ---------- Bar charts (vertical or ranked horizontal) ---------- */
function barOptions(horizontal: boolean, total: number): ChartOptions<'bar'> {
  const category = { grid: { display: false }, border: { display: false }, ticks: { color: '#55605b', font: { size: 12.5 } } };
  const value = { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { color: '#78817d', font: { size: 12 }, precision: 0 } };
  return {
    responsive: true, maintainAspectRatio: false, indexAxis: horizontal ? 'y' : 'x',
    layout: { padding: horizontal ? { right: 36 } : { top: 24 } },
    animation: { duration: 600 }, onHover: pointer,
    plugins: { legend: { display: false }, tooltip: { ...tooltipBase, callbacks: { label: (context: { raw: unknown }) => ` ${context.raw} students · ${percent(Number(context.raw), total).toFixed(1)}%` } } },
    scales: horizontal ? { x: value, y: category } : { x: category, y: value }
  } as unknown as ChartOptions<'bar'>;
}

export function BarCard({ eyebrow, title, data, color, horizontal = false, height = 270, span = 6, subtitle }: {
  eyebrow: string; title: string; data: Slice[]; color: string; horizontal?: boolean; height?: number; span?: 6 | 12; subtitle?: string;
}) {
  const total = sum(data);
  return (
    <ProfileCard eyebrow={eyebrow} title={title} span={span} subtitle={subtitle ?? topNote(data)} table={frequencyTable(data, title)}>
      <div className="admin-pf-chart" style={{ height }}>
        <Bar plugins={[valueLabels]} options={barOptions(horizontal, total)} data={{ labels: data.map(item => item.label), datasets: [{ label: 'Students', data: data.map(item => item.value), backgroundColor: color, hoverBackgroundColor: '#17463d', borderRadius: 6, maxBarThickness: horizontal ? 24 : 42 }] }} />
      </div>
    </ProfileCard>
  );
}

/* ---------- Tamil medium students ---------- */
export function TamilMediumCard({ total, breakdown }: { total: number; breakdown: { admission: string; quota: string; value: number }[] }) {
  const labels = breakdown.map(item => (item.admission === item.quota ? item.quota : `${item.admission} · ${item.quota}`));
  const colors = breakdown.map(item => (item.admission === 'Counselling' ? palette[0] : palette[1]));
  const byAdmission = breakdown.reduce<Record<string, number>>((result, item) => ({ ...result, [item.admission]: (result[item.admission] ?? 0) + item.value }), {});
  const subtitle = Object.entries(byAdmission).map(([admission, value]) => `${admission} ${value}`).join(' · ');
  return (
    <ProfileCard eyebrow="SCHOOLING" title={`Tamil Medium Students (${total})`} subtitle={subtitle}
      table={{ columns: ['Admission', 'Quota', 'Students'], rows: [...breakdown.map(item => [item.admission, item.quota, item.value]), ['Total', '', total]] }}>
      <div className="admin-pf-chart" style={{ height: 250 }}>
        <Bar plugins={[valueLabels]} options={barOptions(true, total)} data={{ labels, datasets: [{ label: 'Students', data: breakdown.map(item => item.value), backgroundColor: colors, borderRadius: 6, maxBarThickness: 24 }] }} />
      </div>
    </ProfileCard>
  );
}

/* ---------- Cut-off line chart with max / min / average ---------- */
export function CutoffCard({ title, eyebrow, profile, color, span = 6 }: { title: string; eyebrow: string; profile: CutoffProfile; color: string; span?: 6 | 12 }) {
  const total = sum(profile.bands);
  const options = {
    responsive: true, maintainAspectRatio: false, layout: { padding: { top: 24, right: 14 } },
    animation: { duration: 700 }, onHover: pointer, interaction: { mode: 'nearest', intersect: false, axis: 'x' },
    plugins: { legend: { display: false }, tooltip: { ...tooltipBase, callbacks: { title: (items: { label: string }[]) => `Cut-off ${items[0].label}`, label: (context: { raw: unknown }) => ` ${context.raw} students · ${percent(Number(context.raw), total).toFixed(1)}%` } } },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: '#68716d', font: { size: 11.5 }, autoSkip: false, maxRotation: span === 12 ? 0 : 40 } },
      y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { color: '#78817d', font: { size: 12 }, precision: 0 } }
    }
  } as unknown as ChartOptions<'line'>;
  const stats: [string, number][] = [['Maximum', profile.maximum], ['Minimum', profile.minimum], ['Average', profile.average]];
  return (
    <ProfileCard eyebrow={eyebrow} title={title} span={span} subtitle={`${total} students · average ${profile.average.toFixed(1)}`} table={frequencyTable(profile.bands, 'Cut-off mark')}>
      <div className="admin-pf-chart" style={{ height: 270 }}>
        <Line plugins={[valueLabels]} options={options} data={{ labels: profile.bands.map(band => band.label), datasets: [{ label: 'Students', data: profile.bands.map(band => band.value), borderColor: color, backgroundColor: `${color}22`, borderWidth: 2.5, tension: 0.35, fill: true, pointRadius: 4, pointHoverRadius: 8, pointBackgroundColor: '#ffffff', pointBorderColor: color, pointBorderWidth: 2 }] }} />
      </div>
      <div className="admin-pf-stat-row">{stats.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value.toFixed(1)}</strong></div>)}</div>
    </ProfileCard>
  );
}

/* ---------- Quota-wise cut-off (grouped bars + table) ---------- */
export function QuotaCutoffCard({ rows }: { rows: QuotaCutoff[] }) {
  const options = {
    responsive: true, maintainAspectRatio: false, layout: { padding: { top: 24 } }, animation: { duration: 600 }, onHover: pointer,
    plugins: { legend: { display: true, position: 'top', align: 'end', labels: { color: '#68716d', usePointStyle: true, pointStyle: 'rectRounded', boxWidth: 10, boxHeight: 10, padding: 16, font: { size: 12 } } }, tooltip: { ...tooltipBase } },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: '#55605b', font: { size: 12.5 } } },
      y: { beginAtZero: false, min: 80, grid: { color: gridColor }, border: { display: false }, ticks: { color: '#78817d', font: { size: 12 } } }
    }
  } as unknown as ChartOptions<'bar'>;
  const series: [string, keyof QuotaCutoff, string][] = [['Maximum', 'maximum', palette[0]], ['Average', 'average', palette[1]], ['Minimum', 'minimum', palette[2]]];
  return (
    <ProfileCard eyebrow="CUT-OFF MARK" title="Cut-off Mark by Quota" span={12} subtitle="Maximum, average and minimum cut-off for each admission quota">
      <div className="admin-pf-split">
        <div className="admin-pf-chart" style={{ height: 300 }}>
          <Bar plugins={[valueLabels]} options={options} data={{ labels: rows.map(row => row.quota), datasets: series.map(([label, key, color]) => ({ label, data: rows.map(row => Number(row[key])), backgroundColor: color, borderRadius: 5, maxBarThickness: 30 })) }} />
        </div>
        <div className="admin-pf-table-wrap inline"><table className="admin-data-table admin-pf-table"><thead><tr><th />{rows.map(row => <th key={row.quota}>{row.quota}</th>)}</tr></thead><tbody>
          {series.map(([label, key]) => <tr key={label}><td><strong>{label}</strong></td>{rows.map(row => <td key={row.quota}>{Number(row[key]).toFixed(1)}</td>)}</tr>)}
        </tbody></table></div>
      </div>
    </ProfileCard>
  );
}

/* ---------- Admission type → gender → residence flow ---------- */
const nodeW = 124, nodeH = 46;
const leafY = [32, 92, 152, 212];
const genderY = [62, 182];
const columns = { root: 0, gender: 218, leaf: 436 };
const curve = (x1: number, y1: number, x2: number, y2: number) => `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

function FlowTree({ admission }: { admission: FlowAdmission }) {
  const [hover, setHover] = useState<string | null>(null);
  const total = admission.genders.reduce((result, gender) => result + gender.hosteller + gender.dayScholar, 0);
  const genderTotals = admission.genders.map(gender => gender.hosteller + gender.dayScholar);
  const leaves = admission.genders.flatMap((gender, genderIndex) => [
    { id: `l${genderIndex}0`, parent: `g${genderIndex}`, label: 'Hosteller', value: gender.hosteller, gender: gender.gender, base: genderTotals[genderIndex] },
    { id: `l${genderIndex}1`, parent: `g${genderIndex}`, label: 'Day Scholar', value: gender.dayScholar, gender: gender.gender, base: genderTotals[genderIndex] }
  ]);
  const inPath = (id: string) => {
    if (!hover || hover === 'root') return true;
    if (hover.startsWith('g')) return id === 'root' || id === hover || id.startsWith(`l${hover[1]}`);
    return id === 'root' || id === hover || id === `g${hover[1]}`;
  };
  const hovered = leaves.find(leaf => leaf.id === hover);
  const hoveredGender = hover?.startsWith('g') ? admission.genders[Number(hover[1])] : null;
  const caption = hovered
    ? `${admission.type} → ${hovered.gender} → ${hovered.label}: ${hovered.value} students (${percent(hovered.value, total).toFixed(1)}% of ${admission.type})`
    : hoveredGender
      ? `${admission.type} → ${hoveredGender.gender}: ${hoveredGender.hosteller + hoveredGender.dayScholar} students (${percent(hoveredGender.hosteller + hoveredGender.dayScholar, total).toFixed(1)}% of ${admission.type})`
      : 'Hover over a box to trace one group through the admission route.';
  const node = (id: string, x: number, y: number, label: string, value: number, fill: string, text = '#ffffff') => (
    <g key={id} className="admin-pf-node" style={{ opacity: inPath(id) ? 1 : 0.28 }} onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)} tabIndex={0} onFocus={() => setHover(id)} onBlur={() => setHover(null)}>
      <rect x={x} y={y - nodeH / 2} width={nodeW} height={nodeH} rx={10} fill={fill} />
      <text x={x + nodeW / 2} y={y - 5} textAnchor="middle" fontSize="12" fill={text} opacity="0.9">{label}</text>
      <text x={x + nodeW / 2} y={y + 14} textAnchor="middle" fontSize="16" fontWeight="700" fill={text}>{value}</text>
    </g>
  );
  return (
    <div className="admin-pf-flow-tree">
      <svg viewBox="0 0 560 244" role="img" aria-label={`${admission.type} admissions by gender and residence`}>
        {admission.genders.map((_, index) => <path key={`rg${index}`} d={curve(columns.root + nodeW, 122, columns.gender, genderY[index])} fill="none" stroke={palette[1]} strokeWidth="2" style={{ opacity: inPath(`g${index}`) ? 0.7 : 0.15 }} />)}
        {leaves.map((leaf, index) => <path key={`gl${leaf.id}`} d={curve(columns.gender + nodeW, genderY[Number(leaf.id[1])], columns.leaf, leafY[index])} fill="none" stroke={palette[2]} strokeWidth="2" style={{ opacity: inPath(leaf.id) ? 0.7 : 0.15 }} />)}
        {node('root', columns.root, 122, admission.type, total, palette[0])}
        {admission.genders.map((gender, index) => node(`g${index}`, columns.gender, genderY[index], gender.gender, genderTotals[index], '#f2e3c6', '#5a4416'))}
        {leaves.map((leaf, index) => node(leaf.id, columns.leaf, leafY[index], leaf.label, leaf.value, '#dde7f1', '#26425f'))}
      </svg>
      <p className="admin-pf-flow-caption" aria-live="polite">{caption}</p>
    </div>
  );
}

export function FlowCard({ flows }: { flows: FlowAdmission[] }) {
  return (
    <ProfileCard eyebrow="ADMISSION ROUTE" title="Students by Admission Type, Gender and Residence" span={12} subtitle="How each admission route splits by gender, then hosteller or day scholar">
      <div className="admin-pf-flow-grid">{flows.map(flow => <FlowTree key={flow.type} admission={flow} />)}</div>
    </ProfileCard>
  );
}

/* ---------- District coverage ---------- */
export function DistrictCard({ districts, batchTotal }: { districts: { total: number; covered: number; notCovered: string[]; otherState: number; top: Slice[] }; batchTotal: number }) {
  const [mapFailed, setMapFailed] = useState(false);
  return (
    <ProfileCard eyebrow="GEOGRAPHY" title="District-wise Students" span={12} subtitle={`${districts.covered} of ${districts.total} Tamil Nadu districts are represented`}
      table={{ columns: ['District', 'Students'], rows: districts.top.map(item => [item.label, item.value]) }}>
      <div className={`admin-pf-district${mapFailed ? ' no-map' : ''}`}>
        <div className="admin-pf-district-facts">
          <div className="fact"><span>Total districts</span><strong>{districts.total}</strong></div>
          <div className="fact"><span>Districts covered</span><strong>{districts.covered}</strong><i className="admin-meter"><b style={{ width: `${percent(districts.covered, districts.total)}%` }} /></i></div>
          <div className="fact"><span>Other-state students</span><strong>{districts.otherState === 0 ? 'Nil' : districts.otherState}</strong></div>
          <div className="fact wide"><span>Districts not covered ({districts.notCovered.length})</span><div className="admin-pf-chips">{districts.notCovered.map(name => <em key={name}>{name}</em>)}</div></div>
        </div>
        <div>
          <div className="admin-pf-chart" style={{ height: 300 }}>
            <Bar plugins={[valueLabels]} options={barOptions(true, batchTotal)} data={{ labels: districts.top.map(item => item.label), datasets: [{ label: 'Students', data: districts.top.map(item => item.value), backgroundColor: palette[3], hoverBackgroundColor: '#5a4d7c', borderRadius: 6, maxBarThickness: 22 }] }} />
          </div>
          <p className="admin-pf-chart-note">Top {districts.top.length} districts by number of students</p>
        </div>
        {!mapFailed && <figure className="admin-pf-map"><img src="/tn-district-map.jpg" alt="Tamil Nadu map showing district-wise student numbers" onError={() => setMapFailed(true)} /></figure>}
      </div>
    </ProfileCard>
  );
}