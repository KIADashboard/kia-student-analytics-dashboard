import React, { useRef, useState } from 'react';
import { Student } from '../../types';
import { AdminSidebar, AdminPage, AnalyticsSubTab } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AcademicPerformancePage } from './AcademicPerformancePage';
import { AnalyticsPage } from './AnalyticsPage';
import { OverviewPage } from './OverviewPage';
import { SettingsPage } from './SettingsPage';
import { StudentProfilesPage } from './StudentProfilesPage';
import { ThemeMode } from '../../types';
import './admin.css';

export function AdminDashboard({
  onLogout,
  students,
  onReloadStudents,
  studentsLoading,
  studentsError,
  theme,
  onToggleTheme
}: {
  onLogout: () => void;
  students: Student[];
  onReloadStudents: () => Promise<void>;
  studentsLoading: boolean;
  studentsError: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  const [activePage, setActivePage] = useState<AdminPage>('overview');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<AnalyticsSubTab>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHoverOpen, setSidebarHoverOpen] = useState(false);
  const hoverCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebarVisible = sidebarOpen || sidebarHoverOpen;

  const cancelHoverClose = () => {
    if (hoverCloseTimeout.current !== null) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
  };
  const scheduleHoverClose = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    cancelHoverClose();
    hoverCloseTimeout.current = setTimeout(() => setSidebarHoverOpen(false), 160);
  };
  const openOnHover = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    cancelHoverClose();
    setSidebarHoverOpen(true);
  };
  const closeSidebar = () => {
    cancelHoverClose();
    setSidebarOpen(false);
    setSidebarHoverOpen(false);
  };
  const toggleSidebar = () => {
    cancelHoverClose();
    setSidebarHoverOpen(false);
    setSidebarOpen(previous => !previous);
  };

  const navigate = (page: AdminPage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateAnalytics = (tab: AnalyticsSubTab) => {
    setActiveAnalyticsTab(tab);
    setActivePage('analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageContent = {
    overview: <OverviewPage students={students} onNavigate={navigate} />,
    students: <StudentProfilesPage students={students} onReloadStudents={onReloadStudents} />,
    academic: <AcademicPerformancePage students={students} onReloadStudents={onReloadStudents} />,
    analytics: <AnalyticsPage students={students} activeTab={activeAnalyticsTab} />,
    settings: <SettingsPage />
  }[activePage];

  return (
    <div className={`kia-admin${sidebarVisible ? ' sidebar-expanded' : ''}${theme === 'dark' ? ' dark-theme' : ''}`}>
      <AdminSidebar
        activePage={activePage}
        activeAnalyticsTab={activeAnalyticsTab}
        onNavigate={navigate}
        onNavigateAnalytics={navigateAnalytics}
        onLogout={onLogout}
        mobileOpen={sidebarVisible}
        onClose={closeSidebar}
        onPointerEnter={openOnHover}
        onPointerLeave={scheduleHoverClose}
      />
      <main className="admin-main-content">
        <AdminTopbar
          activePage={activePage}
          onMenuClick={toggleSidebar}
          onMenuPointerEnter={openOnHover}
          onMenuPointerLeave={scheduleHoverClose}
          menuOpen={sidebarVisible}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <div className="admin-content-area">
          {students.length > 0 && !students.some(student => student.academicDataAvailable) && (
            <p className="admin-empty-state" role="note">
              The admission dataset does not include college grades, attendance, arrears, or placements. Those metrics remain unavailable until actual academic records are imported.
            </p>
          )}
          {(studentsLoading || studentsError) && (
            <p className={studentsError ? 'admin-profile-export-error' : 'admin-empty-state'} role={studentsError ? 'alert' : 'status'}>
              {studentsError || 'Loading student records…'}
            </p>
          )}
          {pageContent}
        </div>
      </main>
    </div>
  );
}