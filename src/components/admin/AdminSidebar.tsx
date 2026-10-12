import React from 'react';
import kiaLogo from '../../assets/kia-logo.png';
import kiaShield from '../../assets/kiwal.png';
import { Activity, BookOpenCheck, ChartNoAxesCombined, Gauge, GraduationCap, Settings, UsersRound, X } from 'lucide-react';

// Set to true to show the text "KIA / Student Administration" next to the logo.
const showBrandText = false;

export type AdminPage = 'overview' | 'students' | 'academic' | 'analytics' | 'settings';

const navigation = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'students', label: 'Student Profiles', icon: UsersRound },
  { id: 'academic', label: 'Academic Performance', icon: BookOpenCheck },
  { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined }
] as const;

export function AdminSidebar({ activePage, onNavigate, onLogout, mobileOpen, onClose, onPointerEnter, onPointerLeave }: {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
  onPointerEnter: (event: React.PointerEvent) => void;
  onPointerLeave: (event: React.PointerEvent) => void;
}) {
  const choose = (page: AdminPage) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {mobileOpen && <button className="admin-drawer-backdrop" aria-label="Close navigation" onClick={onClose} />}
      <aside
        id="admin-navigation"
        className={`admin-sidebar${mobileOpen ? ' is-open' : ''}`}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <div className="admin-brand" style={{ background: '#ffffff' }}>
          <img className="admin-brand-mark" src={kiaShield} alt="Kumaraguru Institute of Agriculture" />
          <img className="admin-brand-logo" src={kiaLogo} alt="Kumaraguru Institute of Agriculture" />
          {showBrandText && <div><div className="admin-brand-name">KIA</div><div className="admin-brand-subtitle">Student Administration</div></div>}
          <button className="admin-sidebar-close" onClick={onClose} aria-label="Close navigation" title="Close"><X size={18} /></button>
        </div>
        <div className="admin-sidebar-section-title">MAIN MENU</div>
        <nav className="admin-sidebar-nav" aria-label="Administration pages">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`admin-nav-link${activePage === id ? ' active' : ''}`} onClick={() => choose(id)} title={label}>
              <span className="admin-nav-symbol"><Icon size={18} strokeWidth={1.8} /></span><span className="admin-nav-label">{label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-section-title system-title">SYSTEM</div>
        <nav className="admin-sidebar-nav" aria-label="System settings">
          <button className={`admin-nav-link${activePage === 'settings' ? ' active' : ''}`} onClick={() => choose('settings')} title="Settings">
            <span className="admin-nav-symbol"><Settings size={18} strokeWidth={1.8} /></span><span className="admin-nav-label">Settings</span>
          </button>
        </nav>
        <button className="admin-sidebar-bottom" onClick={onLogout} title="Sign out of administration">
          <span className="admin-avatar">A</span><span className="admin-info"><strong>Administrator</strong><span>College Office</span></span><span className="admin-more">↗</span>
        </button>
      </aside>
    </>
  );
}