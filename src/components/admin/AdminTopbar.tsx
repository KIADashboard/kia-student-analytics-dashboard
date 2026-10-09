import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { AdminPage } from './AdminSidebar';

export function AdminTopbar({ activePage, onMenuClick }: { activePage: AdminPage; onMenuClick: () => void }) {
  const pageHeadings: Record<AdminPage, { section: string; title: string; description: string }> = {
    overview: { section: 'COLLEGE ADMINISTRATION', title: 'College Overview', description: 'Current batch and institution-wide performance.' },
    students: { section: 'STUDENT DIRECTORY', title: 'Student Profiles', description: 'Search, filter and access complete student records.' },
    academic: { section: 'ACADEMIC PERFORMANCE', title: 'Academic Performance', description: 'Review performance across batches, semesters and subjects.' },
    analytics: { section: 'INSTITUTIONAL INSIGHTS', title: 'Analytics', description: 'Understand student demographics and academic patterns.' },
    settings: { section: 'SYSTEM', title: 'Settings', description: 'Dashboard preferences and administration settings.' }
  };
  const heading = pageHeadings[activePage];

  return (
    <header className="admin-topbar">
      <button className="admin-mobile-menu" onClick={onMenuClick} aria-label="Open administration navigation"><Menu size={20} /></button>
      <div className="admin-heading">
        <div className="admin-heading-copy">
          <span className="admin-section-label">{heading.section}</span>
          <h1>{heading.title}</h1>
          <p>{heading.description}</p>
        </div>
        <div className="admin-heading-controls" id="admin-page-header-actions" />
      </div>
      <div className="admin-topbar-actions">
        <div className="admin-academic-session"><span>Academic Session</span><strong>2026 – 27</strong></div>
        <button className="admin-notification-button" aria-label="Notifications" title="Notifications"><Bell size={16} /><i /></button>
      </div>
    </header>
  );
}