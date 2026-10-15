import React, { useEffect, useState } from 'react';
import { LoginView } from './components/LoginView';
import { StudentPortal } from './components/StudentPortal';
import { ThemeMode, UserRole } from './types';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [adminTheme, setAdminTheme] = useState<ThemeMode>(() => {
    const savedTheme = window.localStorage.getItem('kia-admin-theme')
      ?? window.localStorage.getItem('kia-dashboard-theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });
  const [studentTheme, setStudentTheme] = useState<ThemeMode>(() => {
    const savedTheme = window.localStorage.getItem('kia-student-theme')
      ?? window.localStorage.getItem('kia-dashboard-theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    window.localStorage.setItem('kia-admin-theme', adminTheme);
  }, [adminTheme]);
  useEffect(() => {
    window.localStorage.setItem('kia-student-theme', studentTheme);
  }, [studentTheme]);

  if (!role) {
    return <LoginView onLogin={setRole} />;
  }

  if (role === 'admin') {
    return (
      <AdminDashboard
        students={[]}
        onLogout={() => setRole(null)}
        theme={adminTheme}
        onToggleTheme={() => setAdminTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light')}
      />
    );
  }

  return (
    <StudentPortal
      onLogout={() => setRole(null)}
      theme={studentTheme}
      onToggleTheme={() => setStudentTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light')}
    />
  );
}