import React from 'react';
import { Bell, Calendar, Menu } from 'lucide-react';
import { AdminPage } from './AdminSidebar';

const titles: Record<AdminPage, string> = {
  overview: 'College Overview',
  students: 'Student Profiles',
  academic: 'Academic Performance',
  analytics: 'Institutional Analytics',
  settings: 'Settings'
};

export function AdminTopbar({
  activePage,
  onMenuClick
}: {
  activePage: AdminPage;
  onMenuClick: () => void;
}) {
  const title = titles[activePage] || 'Administration';

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          className="admin-mobile-menu"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="admin-heading">
          <h1>{title}</h1>
        </div>
      </div>

      <div className="admin-topbar-actions">
        <div className="admin-academic-session-pill" title="Current Academic Session">
          <Calendar size={14} className="admin-session-icon" />
          <span>AY 2026 – 2027</span>
        </div>

        <button
          className="admin-notification-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={17} strokeWidth={1.9} />
          <span className="admin-notification-dot" />
        </button>
      </div>
    </header>
  );
}