import React from 'react';
import { Activity, BookOpenCheck, ChartNoAxesCombined, Gauge, GraduationCap, Settings, UsersRound } from 'lucide-react';
import { InstitutionLogo } from '../InstitutionLogo';

export type AdminPage = 'overview' | 'students' | 'academic' | 'analytics' | 'settings';

const navigation = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'students', label: 'Student Profiles', icon: UsersRound },
  { id: 'academic', label: 'Academic Performance', icon: BookOpenCheck },
  { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined }
] as const;

export function AdminSidebar({ activePage, onNavigate, onLogout, mobileOpen, onClose }: {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const choose = (page: AdminPage) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {mobileOpen && <button className="admin-drawer-backdrop" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`admin-sidebar${mobileOpen ? ' is-open' : ''}`}>
        <div className="admin-brand">
          <div className="admin-brand-mark">
            <InstitutionLogo className="admin-brand-logo-img" />
          </div>
          <div className="admin-brand-details">
            <div className="admin-brand-lockup">
              <span className="admin-brand-primary">KUMARAGURU</span>
              <div className="admin-brand-rule" />
              <div className="admin-brand-line2">
                <span className="admin-brand-sub">INSTITUTE OF</span>
                <span className="admin-brand-focus">AGRICULTURE</span>
              </div>
            </div>
            <div className="admin-brand-subtitle">Student Administration</div>
          </div>
        </div>
        <div className="admin-sidebar-section-title">MAIN MENU</div>
        <nav className="admin-sidebar-nav" aria-label="Administration pages">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`admin-nav-link${activePage === id ? ' active' : ''}`} onClick={() => choose(id)}>
              <span className="admin-nav-symbol"><Icon size={16} strokeWidth={1.8} /></span><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-section-title system-title">SYSTEM</div>
        <nav className="admin-sidebar-nav" aria-label="System settings">
          <button className={`admin-nav-link${activePage === 'settings' ? ' active' : ''}`} onClick={() => choose('settings')}>
            <span className="admin-nav-symbol"><Settings size={16} strokeWidth={1.8} /></span><span>Settings</span>
          </button>
        </nav>
        <button className="admin-sidebar-bottom" onClick={onLogout} title="Sign out of administration">
          <span className="admin-avatar">A</span><span className="admin-info"><strong>Administrator</strong><span>College Office</span></span><span className="admin-more">↗</span>
        </button>
      </aside>
    </>
  );
}