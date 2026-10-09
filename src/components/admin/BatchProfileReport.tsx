import React, { useState } from 'react';
import { batchProfiles } from './batchProfileData';
import { BarCard, CutoffCard, DistrictCard, DonutCard, FlowCard, QuotaCutoffCard, TamilMediumCard, palette, percent } from './ProfileCharts';

function Kpi({ label, value, unit, foot }: { label: string; value: string; unit?: string; foot: string }) {
  return <article className="admin-pf-kpi"><span>{label}</span><strong>{value}{unit && <small>{unit}</small>}</strong><em>{foot}</em></article>;
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return <div className="admin-section-title-row"><div><span className="admin-section-label">{label}</span><h3>{title}</h3></div></div>;
}

export function BatchProfileReport() {
  const years = Object.keys(batchProfiles).sort().reverse();
  const [year, setYear] = useState(years[0]);
  const profile = batchProfiles[year];
  const count = (items: { label: string; value: number }[], label: string) => items.find(item => item.label === label)?.value ?? 0;
  const female = count(profile.gender, 'Female');
  const hostellers = count(profile.hostel, 'Hosteller');
  const firstGraduates = count(profile.firstGraduate, 'Yes');

  return <>
    <div className="admin-analytics-toolbar"><div>
      <span>Batch</span>
      {years.length > 1
        ? <select value={year} onChange={event => setYear(event.target.value)} aria-label="Batch profile year">{years.map(option => <option key={option}>{option}</option>)}</select>
        : <span className="admin-pf-batch-pill">{profile.year} · {profile.total} students</span>}
    </div></div>

    <div className="admin-pf-kpis">
      <Kpi label="Total students" value={String(profile.total)} foot={`${year} batch`} />
      <Kpi label="Female students" value={percent(female, profile.total).toFixed(1)} unit="%" foot={`${female} of ${profile.total}`} />
      <Kpi label="Hostel residents" value={percent(hostellers, profile.total).toFixed(1)} unit="%" foot={`${hostellers} of ${profile.total}`} />
      <Kpi label="First-generation graduates" value={percent(firstGraduates, profile.total).toFixed(1)} unit="%" foot={`${firstGraduates} of ${profile.total}`} />
      <Kpi label="Average cut-off" value={profile.cutoff.overall.average.toFixed(1)} unit="/ 200" foot={`Range ${profile.cutoff.overall.minimum} to ${profile.cutoff.overall.maximum}`} />
      <Kpi label="Districts covered" value={String(profile.districts.covered)} unit={`/ ${profile.districts.total}`} foot="Tamil Nadu districts" />
    </div>

    <SectionTitle label="STUDENT PROFILE" title="Demographics" />
    <div className="admin-pf-grid">
      <DonutCard eyebrow="DEMOGRAPHICS" title="Gender" label="students" data={profile.gender} />
      <BarCard eyebrow="DEMOGRAPHICS" title="Community" data={profile.community} color={palette[1]} />
      <BarCard eyebrow="DEMOGRAPHICS" title="Mother Tongue" data={profile.motherTongue} color={palette[2]} />
      <DonutCard eyebrow="DEMOGRAPHICS" title="First Graduate" label="students" data={profile.firstGraduate} />
      <DonutCard eyebrow="FAMILY" title="Family Background" label="students" data={profile.familyBackground} />
      <DonutCard eyebrow="FAMILY" title="Parents' Occupation" label="students" data={profile.parentsOccupation} />
    </div>

    <SectionTitle label="RESIDENCE" title="Hostel and Location" />
    <div className="admin-pf-grid">
      <DonutCard eyebrow="RESIDENCE" title="Hosteller / Day Scholar" label="students" data={profile.hostel} />
      <BarCard eyebrow="RESIDENCE" title="Residential Area" data={profile.residentialArea} color={palette[5]} horizontal height={240} />
      <DistrictCard districts={profile.districts} batchTotal={profile.total} />
    </div>

    <SectionTitle label="ADMISSION" title="Admission Route" />
    <div className="admin-pf-grid">
      <DonutCard eyebrow="ADMISSION" title="Admission Type" label="students" data={profile.admissionType} />
      <BarCard eyebrow="ADMISSION" title="Quota-wise Students" data={profile.quota} color={palette[3]} horizontal height={260} />
      <FlowCard flows={profile.admissionFlow} />
    </div>

    <SectionTitle label="SCHOOLING" title="School Background" />
    <div className="admin-pf-grid">
      <DonutCard eyebrow="SCHOOLING" title="Board of Study" label="students" data={profile.boardOfStudy} />
      <DonutCard eyebrow="SCHOOLING" title="Medium of Education" label="students" data={profile.mediumOfEducation} />
      <TamilMediumCard total={profile.tamilMedium.total} breakdown={profile.tamilMedium.breakdown} />
      <BarCard eyebrow="SCHOOLING" title="School" data={profile.school} color={palette[0]} horizontal height={240} />
    </div>

    <SectionTitle label="CUT-OFF MARK" title="Cut-off Mark Distribution" />
    <div className="admin-pf-grid">
      <CutoffCard eyebrow="CUT-OFF MARK" title="Overall Cut-off Mark" profile={profile.cutoff.overall} color={palette[0]} span={12} />
      <CutoffCard eyebrow="CUT-OFF MARK" title="Counselling Cut-off Mark" profile={profile.cutoff.counselling} color={palette[2]} />
      <CutoffCard eyebrow="CUT-OFF MARK" title="Management Cut-off Mark" profile={profile.cutoff.management} color={palette[1]} />
      <QuotaCutoffCard rows={profile.cutoff.byQuota} />
    </div>
    <p className="admin-pf-source">Source: {profile.source}. Aspiration survey results are not part of this tab.</p>
  </>;
}
