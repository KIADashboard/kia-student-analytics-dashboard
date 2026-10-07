import React from 'react';
import { Activity, BookOpenCheck, ChartNoAxesCombined, Gauge, GraduationCap, LogOut, Settings, UsersRound } from 'lucide-react';
import { InstitutionLogo } from '../InstitutionLogo';

export type AdminPage = 'overview' | 'students' | 'academic' | 'analytics' | 'settings';

const navigation = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'students', label: 'Student Profiles', icon: UsersRound },
  { id: 'academic', label: 'Academic Performance', icon: BookOpenCheck },
  { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined }
] as const;

export function AdminSidebar({
  activePage,
  onNavigate,
  onLogout,
  mobileOpen,
  onClose
}: {
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
      {mobileOpen && (
        <button
          className="admin-drawer-backdrop"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside className={`admin-sidebar${mobileOpen ? ' is-open' : ''}`}>
        <div className="admin-brand" style={{ padding: '20px 18px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="admin-avatar">AD</div>
          <div className="admin-info">
            <strong>Administrator</strong>
            <span style={{ color: 'var(--admin-muted)', fontSize: '11.5px' }}>College Office</span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="admin-sidebar-menu-wrap">
          <nav className="admin-sidebar-nav" aria-label="Administration pages">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`admin-nav-link${activePage === id ? ' active' : ''}`}
                onClick={() => choose(id)}
              >
                <span className="admin-nav-symbol">
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-divider" />

          <nav className="admin-sidebar-nav" aria-label="System settings">
            <button
              className={`admin-nav-link${activePage === 'settings' ? ' active' : ''}`}
              onClick={() => choose('settings')}
            >
              <span className="admin-nav-symbol">
                <Settings size={18} strokeWidth={1.9} />
              </span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with dedicated Logout option */}
        <div className="admin-sidebar-footer">
          <button
            className="admin-nav-link admin-logout-link"
            onClick={onLogout}
            title="Sign out of administration"
          >
            <span className="admin-nav-symbol">
              <LogOut size={18} strokeWidth={1.9} />
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}