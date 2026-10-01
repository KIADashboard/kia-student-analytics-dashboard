import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../../data/mockStudents';
import { AdminSidebar, AdminPage } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AcademicPerformancePage } from './AcademicPerformancePage';
import { AnalyticsPage } from './AnalyticsPage';
import { ArrearsPage } from './ArrearsPage';
import { OverviewPage } from './OverviewPage';
import { ReportsPage } from './ReportsPage';
import { SettingsPage } from './SettingsPage';
import { StudentProfilesPage } from './StudentProfilesPage';
import './admin.css';

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activePage, setActivePage] = useState<AdminPage>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = (page: AdminPage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const pageContent = {
    overview: <OverviewPage students={MOCK_STUDENTS} onNavigate={navigate} />,
    students: <StudentProfilesPage students={MOCK_STUDENTS} />,
    academic: <AcademicPerformancePage students={MOCK_STUDENTS} />,
    arrears: <ArrearsPage students={MOCK_STUDENTS} />,
    analytics: <AnalyticsPage students={MOCK_STUDENTS} />,
    reports: <ReportsPage students={MOCK_STUDENTS} />,
    settings: <SettingsPage />
  }[activePage];

  return (
    <div className="kia-admin">
      <AdminSidebar activePage={activePage} onNavigate={navigate} onLogout={onLogout} mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="admin-main-content">
        <AdminTopbar activePage={activePage} onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="admin-content-area">{pageContent}</div>
      </main>
    </div>
  );
}
