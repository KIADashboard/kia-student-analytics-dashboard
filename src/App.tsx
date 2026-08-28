import React, { useState, useMemo, useDeferredValue } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnalyticsView } from './components/AnalyticsView';
import { DirectoryView } from './components/DirectoryView';
import { ProfileView } from './components/ProfileView';
import { ReportsView } from './components/ReportsView';
import { Toast } from './components/Toast';
import { LoginView } from './components/LoginView';
import { StudentPortal } from './components/StudentPortal';
import { MOCK_STUDENTS } from './data/mockStudents';
import { Student, ActiveTab, GlobalFilterState, UserRole } from './types';
import { getStudentProfile } from './studentData';
import { InstitutionLogo } from './components/InstitutionLogo';
import { Menu, X, GraduationCap, LogOut } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<GlobalFilterState>({
    academicYear: 'All Years',
    gender: 'All',
    admissionType: 'All Admission Types',
    district: 'All Districts',
    quota: 'All Quotas',
    category: 'All Categories',
    schoolType: 'All School Types',
    board: 'All Boards',
    department: 'ALL',
    searchQuery: '',
    marksRange: 'all',
    hostellerDayscholar: 'All',
    residenceArea: 'All',
    familyBackground: 'All'
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleResetFilters = () => {
    setFilters({
      academicYear: 'All Years',
      gender: 'All',
      admissionType: 'All Admission Types',
      district: 'All Districts',
      quota: 'All Quotas',
      category: 'All Categories',
      schoolType: 'All School Types',
      board: 'All Boards',
      department: 'ALL',
      searchQuery: '',
      marksRange: 'all',
      hostellerDayscholar: 'All',
      residenceArea: 'All',
      familyBackground: 'All'
    });
    showToast('Filters reset to default view', 'info');
  };

  // Filter students based on active filter state
  const deferredFilters = useDeferredValue(filters);
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(student => {
      // Search Query
      if (deferredFilters.searchQuery.trim()) {
        const q = deferredFilters.searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesId = student.id.toLowerCase().includes(q);
        const matchesRoll = student.rollNo.toLowerCase().includes(q);
        const matchesDept = student.department.toLowerCase().includes(q);
        const matchesEmail = student.email.toLowerCase().includes(q);
        const matchesDistrict = student.district.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesRoll && !matchesDept && !matchesEmail && !matchesDistrict) {
          return false;
        }
      }

      // Academic Year
      if (deferredFilters.academicYear !== 'All Years' && student.academicYear.toString() !== deferredFilters.academicYear) {
        return false;
      }

      // Gender
      if (deferredFilters.gender !== 'All' && student.gender !== deferredFilters.gender) {
        return false;
      }

      // District
      if (deferredFilters.district !== 'All Districts' && student.district !== deferredFilters.district) {
        return false;
      }

      // Quota
      if (deferredFilters.quota && deferredFilters.quota !== 'All Quotas' && student.quota !== deferredFilters.quota) {
        return false;
      }

      // Category
      if (deferredFilters.category && deferredFilters.category !== 'All Categories' && student.category !== deferredFilters.category) {
        return false;
      }

      // School Type
      if (deferredFilters.schoolType !== 'All School Types' && student.schoolType !== deferredFilters.schoolType) {
        return false;
      }

      // Department
      if (deferredFilters.department !== 'ALL' && student.departmentCode !== deferredFilters.department) {
        return false;
      }

      // Marks Range
      if (deferredFilters.marksRange && deferredFilters.marksRange !== 'all') {
        if (deferredFilters.marksRange === '>85' && student.marksPercentage < 85) return false;
        if (deferredFilters.marksRange === '70-85' && (student.marksPercentage < 70 || student.marksPercentage >= 85)) return false;
        if (deferredFilters.marksRange === '55-70' && (student.marksPercentage < 55 || student.marksPercentage >= 70)) return false;
        if (deferredFilters.marksRange === '<55' && student.marksPercentage >= 55) return false;
      }

      // Income Category
      if (deferredFilters.incomeCategory && deferredFilters.incomeCategory !== 'All Incomes' && student.incomeCategory !== deferredFilters.incomeCategory) {
        return false;
      }

      // Agriculture Background
      if (deferredFilters.agricultureBackground && deferredFilters.agricultureBackground !== 'All' && student.agricultureBackground !== deferredFilters.agricultureBackground) {
        return false;
      }

      // First Generation Graduate
      if (deferredFilters.firstGenerationGraduate && deferredFilters.firstGenerationGraduate !== 'All') {
        const isFirstGen = deferredFilters.firstGenerationGraduate === 'Yes';
        if (student.firstGenerationGraduate !== isFirstGen) {
          return false;
        }
      }

      if (deferredFilters.hostellerDayscholar && deferredFilters.hostellerDayscholar !== 'All' && student.residentialType !== deferredFilters.hostellerDayscholar) {
        return false;
      }

      return true;
    });
  }, [deferredFilters]);

  const isFiltering = deferredFilters !== filters;

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedStudent(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToReports = () => {
    setActiveTab('reports');
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded ${filteredStudents.length} student records into Report Builder`, 'info');
  };

  const handleNavigateToAnalyticsFromStudent = (student: Student) => {
    setFilters({
      academicYear: student.academicYear.toString(),
      gender: 'All',
      district: student.district,
      quota: student.quota,
      category: 'All Categories',
      schoolType: 'All School Types',
      department: student.departmentCode,
      searchQuery: '',
      marksRange: 'all',
      admissionType: 'All Admission Types',
      board: 'All Boards',
      hostellerDayscholar: 'All',
      residenceArea: 'All',
      familyBackground: 'All'
    });
    setSelectedStudent(null);
    setActiveTab('analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Filtered Analytics for ${student.name}'s cohort (${student.academicYear}, ${student.district})`, 'info');
  };

  const handleExportCsv = (customList?: Student[]) => {
    const listToExport = customList || filteredStudents;
    if (listToExport.length === 0) {
      showToast('No student records to export.', 'info');
      return;
    }

    const headers = [
      'Student ID',
      'Roll Number',
      'Student Name',
      'Department',
      'Academic Year',
      'Current Semester',
      'Gender',
      'District',
      'Category',
      'Quota',
      'School Type',
      'Cutoff Score',
      'CGPA',
      'Marks %',
      'Attendance %',
      'Active Arrears',
      'Household Income',
      'Agriculture Background',
      'First Gen Graduate',
      'Scholarship'
    ];

    const rows = listToExport.map(s => [
      `"${s.id}"`,
      `"${s.rollNo}"`,
      `"${s.name}"`,
      `"${s.department}"`,
      s.academicYear,
      s.currentSemester,
      `"${s.gender}"`,
      `"${s.district}"`,
      `"${s.category}"`,
      `"${s.quota}"`,
      `"${s.schoolType}"`,
      s.cutoffScore,
      s.cgpa,
      s.marksPercentage,
      s.attendance,
      s.backlogs,
      `"${s.annualIncome}"`,
      `"${s.agricultureBackground}"`,
      s.firstGenerationGraduate ? 'Yes' : 'No',
      `"${s.scholarship}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_Directory_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${listToExport.length} student records as CSV`, 'success');
  };

  const handleExportExcel = (customList?: Student[]) => {
    const listToExport = customList || filteredStudents;
    if (listToExport.length === 0) {
      showToast('No student records to export.', 'info');
      return;
    }

    const headers = [
      'Student ID',
      'Roll Number',
      'Student Name',
      'Department',
      'Academic Year',
      'Current Semester',
      'Gender',
      'District',
      'Category',
      'Quota',
      'School Type',
      'Cutoff Score',
      'CGPA',
      'Marks %',
      'Attendance %',
      'Active Arrears',
      'Household Income',
      'Agriculture Background',
      'First Gen Graduate',
      'Scholarship'
    ];

    const rows = listToExport.map(s => [
      s.id,
      s.rollNo,
      s.name,
      s.department,
      s.academicYear,
      s.currentSemester,
      s.gender,
      s.district,
      s.category,
      s.quota,
      s.schoolType,
      s.cutoffScore,
      s.cgpa,
      s.marksPercentage,
      s.attendance,
      s.backlogs,
      s.annualIncome,
      s.agricultureBackground,
      s.firstGenerationGraduate ? 'Yes' : 'No',
      s.scholarship
    ]);

    const tsvContent = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_Directory_${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${listToExport.length} student records as Excel (.xls)`, 'success');
  };

  if (!role) {
    return <LoginView onLogin={setRole} />;
  }

  if (role === 'student') {
    return (
      <StudentPortal
        student={MOCK_STUDENTS[0]}
        profile={getStudentProfile(MOCK_STUDENTS[0])}
        onLogout={() => setRole(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 antialiased font-sans">
      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          totalStudentsCount={MOCK_STUDENTS.length}
        />
      </div>

      {/* Mobile Drawer Navigation Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">
              <InstitutionLogo className="w-8 h-8 rounded-lg object-contain" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Kumaraguru Institute of Agriculture</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          totalStudentsCount={MOCK_STUDENTS.length}
        />
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header Bar Toggle */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <InstitutionLogo className="w-5 h-5 object-contain" />
            <span className="font-bold text-slate-900 text-sm">Kumaraguru Institute of Agriculture</span>
          </div>
          <button
            type="button"
            title="Log out"
            aria-label="Log out"
            onClick={() => setRole(null)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Global Desktop Header */}
        <Header
          activeTab={activeTab}
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
          onSelectTab={handleTabChange}
          onLogout={() => setRole(null)}
        />

        {/* Dynamic Content Viewport */}
        <main id="main-content-viewport" className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {selectedStudent ? (
            /* Student Profile Drill-down View */
            <ProfileView
              student={selectedStudent}
              onBack={() => setSelectedStudent(null)}
              onExportStudentReport={(s) => handleExportCsv([s])}
              onNavigateToAnalytics={() => handleNavigateToAnalyticsFromStudent(selectedStudent)}
              onNavigateToReports={handleNavigateToReports}
            />
          ) : (
            <>
              {/* 1. Analytics View (Default Overview) */}
              {activeTab === 'analytics' && (
                <AnalyticsView
                  students={filteredStudents}
                  allStudents={MOCK_STUDENTS}
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={handleResetFilters}
                  onSelectStudent={handleSelectStudent}
                  onNavigateToDirectory={() => handleTabChange('directory')}
                  isCalculating={isFiltering}
                />
              )}

              {/* 2. Student Directory View */}
              {activeTab === 'directory' && (
                <DirectoryView
                  students={filteredStudents}
                  allStudentsCount={MOCK_STUDENTS.length}
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={handleResetFilters}
                  onSelectStudent={handleSelectStudent}
                  onExportCsv={handleExportCsv}
                  onExportExcel={handleExportExcel}
                  onNavigateToReports={handleNavigateToReports}
                />
              )}

              {/* 3. Reports View */}
              {activeTab === 'reports' && (
                <ReportsView
                  students={filteredStudents}
                  allStudents={MOCK_STUDENTS}
                  onShowToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Toast Feedback */}
      <Toast
        message={toast ? toast.message : null}
        type={toast ? toast.type : 'success'}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
