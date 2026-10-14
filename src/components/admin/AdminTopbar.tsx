import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { AdminPage } from './AdminSidebar';
import { ThemeMode } from '../../types';

export function AdminTopbar({
  activePage,
  onMenuClick,
  onMenuPointerEnter,
  onMenuPointerLeave,
  menuOpen,
  theme,
  onToggleTheme
}: {
  activePage: AdminPage;
  onMenuClick?: () => void;
  onMenuPointerEnter?: (event: React.PointerEvent) => void;
  onMenuPointerLeave?: (event: React.PointerEvent) => void;
  menuOpen?: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  const pageHeadings: Record<AdminPage, { section: string; title: string; description: string }> = {
    overview: { section: '', title: 'Overview', description: 'Student strength and academic insights' },
    students: { section: 'STUDENT DIRECTORY', title: 'Student Profiles', description: 'Search, filter and access complete student records.' },
    academic: { section: 'ACADEMIC PERFORMANCE', title: 'Academic Performance', description: 'Review performance across batches, semesters and subjects.' },
    analytics: { section: 'INSTITUTIONAL INSIGHTS', title: 'Analytics', description: 'Understand student demographics and academic patterns.' },
    settings: { section: 'SYSTEM', title: 'Settings', description: 'Dashboard preferences and administration settings.' }
  };
  const heading = pageHeadings[activePage];

  return (
    <header className="admin-topbar">
      <div className="admin-heading">
        <div className="admin-heading-copy">
          {heading.section && <span className="admin-section-label">{heading.section}</span>}
          <h1>{heading.title}</h1>
          <p>{heading.description}</p>
        </div>
        <div className="admin-heading-controls" id="admin-page-header-actions" />
      </div>
      <div className="admin-topbar-actions">
        <div className="admin-academic-session"><span>Academic Session</span><strong>2026 – 27</strong></div>
        <button
          className="admin-theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          aria-pressed={theme === 'dark'}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}