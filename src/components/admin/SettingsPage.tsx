import React, { useState } from 'react';
import { Building2, Check, Database, BellRing } from 'lucide-react';

export function SettingsPage() {
  const [year, setYear] = useState('2026 – 27');
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ system: true, reports: true, sync: true });
  const toggle = (key: keyof typeof notifications) => setNotifications(current => ({ ...current, [key]: !current[key] }));
  return <>
    <div className="admin-page-heading-row"><div><span className="admin-section-label">SYSTEM</span><h2>Settings</h2><p>Dashboard preferences and administration settings.</p></div><button className="admin-primary-button" onClick={() => setSaved(true)}><Check size={14} />{saved ? 'Saved' : 'Save Settings'}</button></div>
    <div className="admin-settings-grid">
      <section className="admin-panel admin-setting-card"><div className="admin-setting-heading"><span><Building2 size={17} /></span><div><span className="admin-section-label">COLLEGE</span><h3>Institution Information</h3></div></div><p>Kumaraguru Institute of Agriculture</p><label>Academic year<select value={year} onChange={event => { setYear(event.target.value); setSaved(false); }}><option>2026 – 27</option><option>2025 – 26</option><option>2024 – 25</option></select></label><div className="admin-setting-readonly"><span>Campus</span><strong>Main Campus · Coimbatore</strong></div></section>
      <section className="admin-panel admin-setting-card"><div className="admin-setting-heading"><span><BellRing size={17} /></span><div><span className="admin-section-label">PREFERENCES</span><h3>Notifications</h3></div></div><p>Choose which updates reach the academic office.</p>{([['system', 'System notifications'], ['reports', 'Report generation updates'], ['sync', 'Data sync alerts']] as [keyof typeof notifications, string][]).map(([key, label]) => <label className="admin-setting-toggle" key={key}><span>{label}</span><input type="checkbox" checked={notifications[key]} onChange={() => { toggle(key); setSaved(false); }} /></label>)}</section>
      <section className="admin-panel admin-setting-card wide"><div className="admin-setting-heading"><span><Database size={17} /></span><div><span className="admin-section-label">DATA</span><h3>Academic Data</h3></div></div><p>Manage academic year and batch settings.</p><div className="admin-setting-status"><div><strong>Academic records are synchronized</strong><span>Latest data refresh completed successfully.</span></div><span className="admin-connection-status"><i /> Connected</span></div></section>
    </div>
  </>;
}
