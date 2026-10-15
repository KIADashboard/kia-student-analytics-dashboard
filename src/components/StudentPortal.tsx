import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, UserRound } from 'lucide-react';
import { Student, StudentPortalTab, StudentProfile, ThemeMode } from '../types';
import { StudentSidebar } from './student/StudentSidebar';
import { StudentHeader } from './student/StudentHeader';
import { StudentProfilePage } from './student/StudentProfilePage';
import { StudentAcademicsPage } from './student/StudentAcademicsPage';
import { PageIntro, Section } from './student/StudentPortalComponents';

interface StudentPortalProps {
  student?: Student | null;
  profile?: StudentProfile | null;
  onLogout: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const navItems: { id: StudentPortalTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'My Profile', icon: UserRound },
  { id: 'academics', label: 'My Academics', icon: BarChart3 }
];

const DEFAULT_TAB: StudentPortalTab = 'profile';

const parseTabFromUrl = (): StudentPortalTab => {
  if (typeof window === 'undefined') return DEFAULT_TAB;

  // 1. Check URL hash (e.g. #profile, #academics)
  const hash = window.location.hash.replace(/^#[/]?/, '').toLowerCase().trim();
  if (hash === 'academics') return 'academics';
  if (hash === 'profile') return 'profile';

  // 2. Check query params (e.g. ?tab=academics or ?page=profile)
  const params = new URLSearchParams(window.location.search);
  const tabQuery = (params.get('tab') || params.get('page') || params.get('view') || '').toLowerCase().trim();
  if (tabQuery === 'academics') return 'academics';
  if (tabQuery === 'profile') return 'profile';

  // 3. Check path segment (e.g. /profile or /academics)
  const pathSegment = window.location.pathname.toLowerCase().split('/').filter(Boolean).pop() || '';
  if (pathSegment === 'academics') return 'academics';
  if (pathSegment === 'profile') return 'profile';

  return DEFAULT_TAB;
};

export const StudentPortal: React.FC<StudentPortalProps> = ({ student, profile, onLogout, theme, onToggleTheme }) => {
  const [activeTab, setActiveTab] = useState<StudentPortalTab>(() => parseTabFromUrl());
  const [sidebarHoverOpen, setSidebarHoverOpen] = useState(false);
  const hoverCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (hoverCloseTimeout.current !== null) {
      clearTimeout(hoverCloseTimeout.current);
    }
  }, []);

  const cancelHoverClose = () => {
    if (hoverCloseTimeout.current !== null) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
  };
  const openSidebarOnHover = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    cancelHoverClose();
    setSidebarHoverOpen(true);
  };
  const scheduleSidebarHoverClose = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    cancelHoverClose();
    hoverCloseTimeout.current = setTimeout(() => setSidebarHoverOpen(false), 160);
  };
  const closeSidebar = () => {
    cancelHoverClose();
    setSidebarHoverOpen(false);
  };

  // URL handling & protection: prevent access to removed pages if manually entered in URL
  useEffect(() => {
    const syncFromUrl = () => {
      const resolved = parseTabFromUrl();
      setActiveTab(resolved);

      // If URL contains references to removed pages (home, achievements, survey), sanitize URL
      const currentHash = window.location.hash.toLowerCase();
      const currentSearch = window.location.search.toLowerCase();
      const currentPath = window.location.pathname.toLowerCase();
      const removedPatterns = ['home', 'achievement', 'survey'];
      const hasRemoved = removedPatterns.some(p => currentHash.includes(p) || currentSearch.includes(p) || currentPath.includes(p));

      if (hasRemoved) {
        window.history.replaceState(null, '', `#${resolved}`);
      }
    };

    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const go = (tab: StudentPortalTab) => {
    setActiveTab(tab);
    closeSidebar();
    window.history.replaceState(null, '', `#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const title = navItems.find(item => item.id === activeTab)?.label || 'My Profile';

  return (
    <div className={`student-portal min-h-screen ${sidebarHoverOpen ? 'sidebar-open' : ''}${theme === 'dark' ? ' dark-theme' : ''}`}>
      {/* Sidebar Navigation */}
      <StudentSidebar
        navItems={navItems}
        activeTab={activeTab}
        onNavigate={go}
        student={student}
        onLogout={onLogout}
        isOpen={sidebarHoverOpen}
        onPointerEnter={openSidebarOnHover}
        onPointerLeave={scheduleSidebarHoverClose}
      />

      {/* Main View Area */}
      <div className="student-main">
        {/* Sticky Header Top Bar */}
        <StudentHeader
          title={title}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onLogout={onLogout}
        />

        {/* Dynamic Content */}
        <main className="student-content">
          {student && profile ? (
            <>
              {activeTab === 'profile' && <StudentProfilePage student={student} profile={profile} />}
              {activeTab === 'academics' && <StudentAcademicsPage student={student} profile={profile} />}
            </>
          ) : (
            <div className="space-y-6">
              <PageIntro
                kicker={activeTab === 'profile' ? 'Personal Record' : 'Academic Record'}
                title={title}
                copy="Student records are not currently available."
              />
              <Section title="Student Record">
                <p className="text-sm text-[#06231D]/70">No student record is available.</p>
              </Section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
