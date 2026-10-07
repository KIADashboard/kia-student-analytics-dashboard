import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { AdminPage } from './AdminSidebar';
import { InstitutionLogo } from '../InstitutionLogo';

const titles: Record<AdminPage, string> = {
  overview: 'College Overview',
  students: 'Student Profiles',
  academic: 'Academic Performance',
  analytics: 'Institutional Analytics',
  settings: 'Settings'
};

export function AdminTopbar({ activePage, onMenuClick }: { activePage: AdminPage; onMenuClick: () => void }) {
  const title = titles[activePage] || 'Administration';
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button className="admin-mobile-menu" onClick={onMenuClick} aria-label="Open administration navigation">
          <Menu size={20} />
        </button>

        <div className="admin-topbar-mobile-brand">
          <InstitutionLogo className="admin-topbar-logo" />
          <div className="admin-brand-lockup compact">
            <span className="admin-brand-primary">KUMARAGURU</span>
            <div className="admin-brand-rule" />
            <div className="admin-brand-line2">
              <span className="admin-brand-sub">INSTITUTE OF</span>
              <span className="admin-brand-focus">AGRICULTURE</span>
            </div>
          </div>
        </div>

        <div className="admin-heading">
          <div className="admin-breadcrumb">
            <span className="admin-breadcrumb-institution">Kumaraguru Institute of Agriculture</span>
            <span className="admin-breadcrumb-sep">/</span>
            <span>Administration</span>
            <span className="admin-breadcrumb-sep">/</span>
            <strong>{title}</strong>
          </div>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="admin-topbar-actions">
        <div className="admin-topbar-inst-badge" title="Kumaraguru Institute of Agriculture">
          <InstitutionLogo className="admin-topbar-inst-logo" />
          <div className="admin-topbar-inst-info">
            <span className="admin-topbar-inst-name">Kumaraguru Institute of Agriculture</span>
            <span className="admin-topbar-inst-tag">Institutional Administration</span>
          </div>
        </div>
        <div className="admin-academic-session">
          <span>Academic Session</span>
          <strong>2026 – 27</strong>
        </div>
        <button className="admin-notification-button" aria-label="Notifications" title="Notifications">
          <Bell size={16} />
          <i />
        </button>
      </div>
    </header>
  );
}