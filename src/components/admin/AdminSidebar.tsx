import React from 'react';
import { BookOpenCheck, ChartNoAxesCombined, Gauge, LogOut, Settings, UsersRound } from 'lucide-react';

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
        {/* Top-Left: Administrator / College Office Profile */}
        <div className="admin-profile-header">
          <div className="admin-profile-badge">
            <div className="admin-profile-avatar-wrap">
              <span className="admin-profile-avatar">A</span>
              <span className="admin-avatar-status" title="Online" />
            </div>
            <div className="admin-profile-info">
              <strong className="admin-profile-name">Administrator</strong>
              <span className="admin-profile-role">College Office</span>
            </div>
          </div>
          <button
            className="admin-profile-logout-btn"
            onClick={onLogout}
            title="Sign out of Administration"
            aria-label="Sign out"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
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