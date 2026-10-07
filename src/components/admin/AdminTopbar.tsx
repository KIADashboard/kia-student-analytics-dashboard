import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { AdminPage } from './AdminSidebar';

export function AdminTopbar({ onMenuClick }: { activePage: AdminPage; onMenuClick: () => void }) {
  return (
    <header className="admin-topbar">
      <button className="admin-mobile-menu" onClick={onMenuClick} aria-label="Open administration navigation"><Menu size={20} /></button>
      <div className="admin-topbar-actions" style={{ marginLeft: 'auto' }}>
        <div className="admin-academic-session"><span>Academic Session</span><strong>2026 – 27</strong></div>
        <button className="admin-notification-button" aria-label="Notifications" title="Notifications"><Bell size={16} /><i /></button>
      </div>
    </header>
  );
}