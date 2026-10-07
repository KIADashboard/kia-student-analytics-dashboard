import React, { useState } from 'react';
import { Building2, Check, Database, BellRing } from 'lucide-react';

export function SettingsPage() {
  const [year, setYear] = useState('2026 – 27');
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ system: true, reports: true, sync: true });
  const toggle = (key: keyof typeof notifications) =>
    setNotifications(current => ({ ...current, [key]: !current[key] }));

  return (
    <>
      <div className="admin-page-heading-row">
        <div>
          <h2>Settings</h2>
        </div>
        <div className="admin-page-actions">
          <button className="admin-primary-button" onClick={() => setSaved(true)}>
            <Check size={15} />
            <span>{saved ? 'Saved' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      <div className="admin-settings-grid">
        <section className="admin-panel admin-setting-card">
          <div className="admin-setting-heading">
            <span className="admin-setting-icon">
              <Building2 size={18} />
            </span>
            <div>
              <h3>Institution Information</h3>
            </div>
          </div>
          <div className="admin-setting-body">
            <label>
              <span>Academic Year</span>
              <select
                value={year}
                onChange={event => {
                  setYear(event.target.value);
                  setSaved(false);
                }}
              >
                <option>2026 – 27</option>
                <option>2025 – 26</option>
                <option>2024 – 25</option>
              </select>
            </label>
            <div className="admin-setting-readonly">
              <span>Campus</span>
              <strong>Main Campus · Coimbatore</strong>
            </div>
          </div>
        </section>

        <section className="admin-panel admin-setting-card">
          <div className="admin-setting-heading">
            <span className="admin-setting-icon">
              <BellRing size={18} />
            </span>
            <div>
              <h3>Notifications</h3>
            </div>
          </div>
          <div className="admin-setting-body">
            {(
              [
                ['system', 'System notifications'],
                ['reports', 'Report generation updates'],
                ['sync', 'Data synchronization alerts']
              ] as [keyof typeof notifications, string][]
            ).map(([key, label]) => (
              <label className="admin-setting-toggle" key={key}>
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={() => {
                    toggle(key);
                    setSaved(false);
                  }}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="admin-panel admin-setting-card wide">
          <div className="admin-setting-heading">
            <span className="admin-setting-icon">
              <Database size={18} />
            </span>
            <div>
              <h3>Academic Data</h3>
            </div>
          </div>
          <div className="admin-setting-body">
            <div className="admin-setting-status">
              <div>
                <strong>Academic records are synchronized</strong>
              </div>
              <span className="admin-connection-status">
                <i /> Live Connected
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
