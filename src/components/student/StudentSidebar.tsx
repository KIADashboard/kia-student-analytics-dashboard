import React from 'react';
import { LogOut } from 'lucide-react';
import { Student, StudentPortalTab } from '../../types';
import kiaLogo from '../../assets/kia-logo.png';
import kiaShield from '../../assets/kiwal.png';

interface NavItem {
  id: StudentPortalTab;
  label: string;
  icon: React.ElementType;
}

interface StudentSidebarProps {
  navItems: NavItem[];
  activeTab: StudentPortalTab;
  onNavigate: (tab: StudentPortalTab) => void;
  student: Student;
  onLogout: () => void;
  isOpen: boolean;
  onPointerEnter: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: (event: React.PointerEvent<HTMLElement>) => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  navItems,
  activeTab,
  onNavigate,
  student,
  onLogout,
  isOpen,
  onPointerEnter,
  onPointerLeave
}) => {
  return (
    <aside
      id="student-navigation"
      className={`student-sidebar ${isOpen ? 'open' : ''}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Brand Header with Official KIA Logo */}
      <div className="student-sidebar-brand">
        <img src={kiaShield} alt="Kumaraguru Institute of Agriculture" className="student-sidebar-mark" />
        <img src={kiaLogo} alt="Kumaraguru Institute of Agriculture" className="student-sidebar-logo" />
      </div>

      {/* Navigation Items */}
      <nav>
        <p className="student-nav-label">Portal Navigation</p>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={activeTab === item.id ? 'active' : ''}
              onClick={() => onNavigate(item.id)}
              title={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="student-sidebar-footer">
        <div className="mini-avatar">
          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="student-sidebar-user min-w-0 flex-1">
          <strong>{student.name}</strong>
          <small>{student.id} · {student.rollNo}</small>
        </div>
        <button
          title="Log out"
          className="icon-button student-sidebar-logout"
          onClick={onLogout}
          aria-label="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
