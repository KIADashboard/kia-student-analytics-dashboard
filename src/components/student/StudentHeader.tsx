import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Student, ThemeMode } from '../../types';

interface StudentHeaderProps {
  title: string;
  student: Student;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  title,
  student,
  theme,
  onToggleTheme,
  onLogout
}) => {
  return (
    <header className="student-header">
      <div className="flex items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="portal-kicker">KIA Student Portal</span>
          </div>
          <p>{title}</p>
        </div>
      </div>

      <div className="header-user">
        {/* Campus Tag */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#E2FBCE]/50 border border-[#076653]/20 rounded-full text-xs font-semibold text-[#0C342C]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#076653]"></span>
          Sakthi Nagar Campus
        </div>

        {/* Theme Toggle */}
        <button
          className="student-icon-button theme-toggle-button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          aria-pressed={theme === 'dark'}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
