import React, { useCallback, useEffect, useState } from 'react';
import { LoginView } from './components/LoginView';
import { StudentPortal } from './components/StudentPortal';
import { Student, StudentProfile, ThemeMode, UserRole } from './types';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { clearAccessToken, getAllStudents, getCurrentUser, logout, mapStudent, mapStudentProfile } from './api';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState('');
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

  const refreshStudents = useCallback(async () => {
    setIsLoadingStudents(true);
    setStudentsError('');
    try {
      setStudents(await getAllStudents());
    } catch (error) {
      setStudentsError(error instanceof Error ? error.message : 'Unable to load student records.');
    } finally {
      setIsLoadingStudents(false);
    }
  }, []);

  const hydrateUser = useCallback(async (userRole: UserRole) => {
    if (userRole === 'admin') {
      setRole('admin');
      await refreshStudents();
      return;
    }
    const user = await getCurrentUser();
    if (!user.profile) throw new Error('No student profile is linked to this account.');
    const mappedStudent = mapStudent(user.profile);
    setStudent(mappedStudent);
    setStudentProfile(mapStudentProfile(user.profile, mappedStudent));
    setRole('student');
  }, [refreshStudents]);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then(async user => {
        if (active) await hydrateUser(user.role);
      })
      .catch(() => {
        clearAccessToken();
      })
      .finally(() => {
        if (active) setIsRestoringSession(false);
      });
    return () => { active = false; };
  }, [hydrateUser]);

  const handleLogin = async (userRole: UserRole) => {
    try {
      await hydrateUser(userRole);
    } catch (error) {
      clearAccessToken();
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    setRole(null);
    setStudent(null);
    setStudentProfile(null);
    setStudents([]);
    setStudentsError('');
  };

  if (isRestoringSession) {
    return <div className="min-h-screen flex items-center justify-center text-slate-600">Restoring your session…</div>;
  }

  if (!role) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (role === 'admin') {
    return (
      <AdminDashboard
        students={students}
        onReloadStudents={refreshStudents}
        studentsLoading={isLoadingStudents}
        studentsError={studentsError}
        onLogout={handleLogout}
        theme={adminTheme}
        onToggleTheme={() => setAdminTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light')}
      />
    );
  }

  return (
    <StudentPortal
      student={student}
      profile={studentProfile}
      onLogout={handleLogout}
      theme={studentTheme}
      onToggleTheme={() => setStudentTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light')}
    />
  );
}