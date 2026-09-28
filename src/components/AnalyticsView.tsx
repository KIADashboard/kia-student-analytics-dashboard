import React from 'react';
import { Users, BarChart3 } from 'lucide-react';
import { Student, GlobalFilterState } from '../types';
import { AnalyticsFilters } from './analytics/AnalyticsFilters';
import { KPICards } from './analytics/KPICards';
import { EnrollmentTrendChart } from './analytics/EnrollmentTrendChart';
import { DemographicsSection } from './analytics/DemographicsSection';
import { GeographicSection } from './analytics/GeographicSection';
import { AdmissionSection } from './analytics/AdmissionSection';
import { AcademicSection } from './analytics/AcademicSection';
import { SocioeconomicSection } from './analytics/SocioeconomicSection';
import { KeyInsightsSection } from './analytics/KeyInsightsSection';
import { PerformanceComparison } from './analytics/PerformanceComparison';

interface AnalyticsViewProps {
  students: Student[];
  allStudents: Student[];
  filters: GlobalFilterState;
  onFilterChange: (filters: GlobalFilterState) => void;
  onResetFilters: () => void;
  onSelectStudent: (student: Student) => void;
  onNavigateToDirectory: () => void;
  isCalculating?: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  students,
  allStudents,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectStudent,
  onNavigateToDirectory,
  isCalculating = false
}) => {
  const isFiltered = 
    filters.academicYear !== 'All Years' || 
    filters.gender !== 'All' || 
    filters.district !== 'All Districts' || 
    filters.quota !== 'All Quotas' || 
    filters.schoolType !== 'All School Types' || 
    filters.department !== 'ALL' ||
    (filters.searchQuery && filters.searchQuery.trim() !== '');

  return (
    <div id="analytics-view" className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="portal-hero rounded-3xl p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="portal-kicker">Institutional Administration</span>
            <h2 className="mt-3 text-3xl font-serif text-[#FFFDEE] leading-tight">Student Analytics</h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#FFFDEE]/80">
              Monitor academic outcomes, demographic patterns, and institutional performance from a single operational dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToDirectory}
              className="portal-primary text-[10px]"
              title="Browse all student records in Directory"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Explore Directory ({students.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Global Filter Bar */}
      <AnalyticsFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        filteredCount={students.length}
        totalCount={allStudents.length}
        isCalculating={isCalculating}
        onViewStudents={onNavigateToDirectory}
      />

      {/* 3. Five Compact KPI Cards */}
      <KPICards
        students={students}
        allStudents={allStudents}
        isFiltered={isFiltered}
      />

      <KeyInsightsSection students={students} allStudents={allStudents} />
      <PerformanceComparison
        students={students}
        onFilterChange={({ field, value }) => {
          if (field === 'gender') onFilterChange({ ...filters, gender: value });
          if (field === 'school') onFilterChange({ ...filters, schoolType: value === 'Private' ? 'Private Matric' : value === 'Aided' ? 'Govt-Aided' : value });
          if (field === 'firstGraduate') onFilterChange({ ...filters, firstGenerationGraduate: value });
          if (field === 'farming') onFilterChange({ ...filters, agricultureBackground: value === 'Farming' ? 'Yes' : 'No' });
        }}
      />

      {/* 4. Section 1: Enrollment Trend (2021 to 2025, Students vs Admissions Toggle) */}
      <EnrollmentTrendChart
        students={students}
        allStudents={allStudents}
        selectedYear={filters.academicYear}
        onSelectYear={(yr) => onFilterChange({ ...filters, academicYear: yr })}
      />

      {/* 5. Section 2: Demographic Overview (Gender Donut & School Type Bar) */}
      <DemographicsSection
        students={students}
        allStudents={allStudents}
        selectedGender={filters.gender}
        selectedSchoolType={filters.schoolType}
        onFilterGender={(g) => onFilterChange({ ...filters, gender: g })}
        onFilterSchoolType={(st) => onFilterChange({ ...filters, schoolType: st })}
      />

      {/* 6. Section 3: Geographic Analysis (Students by District, Top 10 vs All toggle) */}
      <GeographicSection
        students={students}
        selectedDistrict={filters.district}
        onFilterDistrict={(d) => onFilterChange({ ...filters, district: d })}
      />

      {/* 7. Section 4: Admission Analytics (By Quota & Stacked Quota Trend) */}
      <AdmissionSection
        students={students}
        allStudents={allStudents}
        selectedQuota={filters.quota}
        onFilterQuota={(q) => onFilterChange({ ...filters, quota: q })}
      />

      {/* 8. Section 5: Academic Performance (Average Marks by Year, Histogram, Schooling) */}
      <AcademicSection
        students={students}
        allStudents={allStudents}
        onSelectYear={(yr) => onFilterChange({ ...filters, academicYear: yr })}
      />

      {/* 9. Section 6: Socioeconomic & Agricultural Background */}
      <SocioeconomicSection
        students={students}
      />

    </div>
  );
};
