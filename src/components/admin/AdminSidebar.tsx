import React from 'react';
import kiaLogo from '../../assets/kia-logo.png';
import kiaShield from '../../assets/kiwal.png';
import { Activity, BookOpenCheck, ChartNoAxesCombined, Gauge, GraduationCap, LogOut, Settings, UsersRound } from 'lucide-react';

// Set to true to show the text "KIA / Student Administration" next to the logo.
const showBrandText = false;

export type AdminPage = 'overview' | 'students' | 'academic' | 'analytics' | 'settings';
export type AnalyticsSubTab = 'profile' | 'compare' | 'trend';

const analyticsSubTabs: { id: AnalyticsSubTab; label: string }[] = [
  { id: 'profile', label: 'Batch' },
  { id: 'compare', label: 'Compare' },
  { id: 'trend', label: 'Overall' }
];

const navigation = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'students', label: 'Students', icon: UsersRound },
  { id: 'academic', label: 'Academics', icon: BookOpenCheck },
  { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { id: 'settings', label: 'Settings', icon: Settings }
] as const;

export function AdminSidebar({
  activePage,
  activeAnalyticsTab = 'profile',
  onNavigate,
  onNavigateAnalytics,
  onLogout,
  mobileOpen,
  onClose,
  onPointerEnter,
  onPointerLeave
}: {
  activePage: AdminPage;
  activeAnalyticsTab?: AnalyticsSubTab;
  onNavigate: (page: AdminPage) => void;
  onNavigateAnalytics?: (tab: AnalyticsSubTab) => void;
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

  const chooseAnalyticsTab = (tab: AnalyticsSubTab, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onNavigateAnalytics) {
      onNavigateAnalytics(tab);
    } else {
      onNavigate('analytics');
    }
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
        <div className="admin-brand">
          <img className="admin-brand-mark" src={kiaShield} alt="Kumaraguru Institute of Agriculture" />
          <img className="admin-brand-logo" src={kiaLogo} alt="Kumaraguru Institute of Agriculture" />
          {showBrandText && <div><div className="admin-brand-name">KIA</div><div className="admin-brand-subtitle">Student Administration</div></div>}
        </div>
        <div className="admin-sidebar-section-title">MAIN MENU</div>
        <nav className="admin-sidebar-nav" aria-label="Administration pages">
          {navigation.map(({ id, label, icon: Icon }) => {
            const isAnalytics = id === 'analytics';
            return (
              <div
                key={id}
                className={`admin-nav-item-wrapper${isAnalytics ? ' has-submenu' : ''}`}
              >
                <button
                  className={`admin-nav-link${activePage === id ? ' active' : ''}`}
                  onClick={() => choose(id)}
                  title={label}
                >
                  <span className="admin-nav-symbol"><Icon size={18} strokeWidth={1.8} /></span>
                  <span className="admin-nav-label">{label}</span>
                </button>
                {isAnalytics && (
                  <div className="admin-submenu" role="menu" aria-label="Analytics sub-options">
                    {analyticsSubTabs.map(sub => (
                      <button
                        key={sub.id}
                        type="button"
                        role="menuitem"
                        className={`admin-submenu-link${activePage === 'analytics' && activeAnalyticsTab === sub.id ? ' active' : ''}`}
                        onClick={e => chooseAnalyticsTab(sub.id, e)}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <button className="admin-sidebar-bottom" onClick={onLogout} title="Sign out of administration">
          <span className="admin-avatar">A</span><span className="admin-info"><strong>Administrator</strong><span>College Office</span></span><span className="admin-more"><LogOut size={16} strokeWidth={1.8} /></span>
        </button>
      </aside>
    </>
  );
}