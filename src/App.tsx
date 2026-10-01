import React, { useState } from 'react';
import { LoginView } from './components/LoginView';
import { LandingPage } from './components/landing/LandingPage';
import { StudentPortal } from './components/StudentPortal';
import { MOCK_STUDENTS } from './data/mockStudents';
import { getStudentProfile } from './studentData';
import { UserRole } from './types';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  if (!role) {
    if (showLogin) {
      return <LoginView onLogin={setRole} />;
    }
    return <LandingPage onNavigateToLogin={() => setShowLogin(true)} />;
  }

  if (role === 'admin') {
    return <AdminDashboard onLogout={() => setRole(null)} />;
  }

  return (
    <StudentPortal
      student={MOCK_STUDENTS[0]}
      profile={getStudentProfile(MOCK_STUDENTS[0])}
      onLogout={() => setRole(null)}
    />
  );
}