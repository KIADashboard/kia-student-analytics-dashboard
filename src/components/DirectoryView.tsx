import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Eye, 
  Download, 
  ArrowUpDown, 
  GraduationCap,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Square,
  MinusSquare,
  Sparkles,
  SlidersHorizontal,
  X,
  ArrowRight,
  Building,
  Briefcase
} from 'lucide-react';
import { Student, GlobalFilterState } from '../types';
import { 
  DISTRICT_LIST, 
  DEPARTMENT_LIST, 
  ACADEMIC_YEARS, 
  CATEGORY_LIST,
  SCHOOL_TYPE_LIST,
  QUOTA_LIST,
  INCOME_RANGES
} from '../data/mockStudents';
import { DirectoryInsight } from './DirectoryInsight';
import { DirectoryCharts } from './DirectoryCharts';

interface DirectoryViewProps {
  students: Student[];
  allStudentsCount: number;
  filters: GlobalFilterState;
  onFilterChange: (filters: GlobalFilterState) => void;
  onResetFilters: () => void;
  onSelectStudent: (student: Student) => void;
  onExportCsv: (customList?: Student[]) => void;
  onExportExcel?: (customList?: Student[]) => void;
  onNavigateToReports?: () => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  students,
  allStudentsCount,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectStudent,
  onExportCsv,
  onExportExcel,
  onNavigateToReports
}) => {
  const [sortField, setSortField] = useState<keyof Student>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery || '');
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({ gender: true, district: true, quota: true, schoolType: true, marks: true, firstGraduate: true });

  useEffect(() => {
    if (searchInput !== (filters.searchQuery || '')) setSearchInput(filters.searchQuery || '');
  }, [filters.searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput !== (filters.searchQuery || '')) {
        onFilterChange({ ...filters, searchQuery: searchInput });
        setCurrentPage(1);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'marksPercentage' || field === 'cgpa' ? 'desc' : 'asc');
    }
  };

  // Sorting
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });
  }, [students, sortField, sortOrder]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedStudents.length);
  const paginatedStudents = sortedStudents.slice(startIndex, endIndex);

  // Active filter detection
  const hasActiveFilters = 
    (filters.searchQuery && filters.searchQuery.trim() !== '') ||
    filters.academicYear !== 'All Years' || 
    filters.gender !== 'All' || 
    filters.district !== 'All Districts' || 
    (filters.quota && filters.quota !== 'All Quotas') || 
    (filters.schoolType && filters.schoolType !== 'All School Types') ||
    (filters.category && filters.category !== 'All Categories') || 
    (filters.department && filters.department !== 'ALL') ||
    (filters.marksRange && filters.marksRange !== 'all') ||
    (filters.incomeCategory && filters.incomeCategory !== 'All Incomes') ||
    (filters.agricultureBackground && filters.agricultureBackground !== 'All') ||
    (filters.firstGenerationGraduate && filters.firstGenerationGraduate !== 'All');

  // Count secondary active filters
  const secondaryFilterCount = [
    filters.category && filters.category !== 'All Categories',
    filters.department && filters.department !== 'ALL',
    filters.incomeCategory && filters.incomeCategory !== 'All Incomes',
    filters.agricultureBackground && filters.agricultureBackground !== 'All',
    filters.firstGenerationGraduate && filters.firstGenerationGraduate !== 'All',
    filters.marksRange && filters.marksRange !== 'all'
  ].filter(Boolean).length;

  // Bulk selection handlers
  const handleToggleSelectAllOnPage = () => {
    const newSelected = new Set(selectedStudentIds);
    const allPageIds = paginatedStudents.map(s => s.id);
    const allSelected = allPageIds.every(id => newSelected.has(id));

    if (allSelected) {
      allPageIds.forEach(id => newSelected.delete(id));
    } else {
      allPageIds.forEach(id => newSelected.add(id));
    }
    setSelectedStudentIds(newSelected);
  };

  const handleToggleSelectStudent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedStudentIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudentIds(newSelected);
  };

  const handleClearSelection = () => {
    setSelectedStudentIds(new Set());
  };

  const selectedStudentsList = useMemo(() => {
    return students.filter(s => selectedStudentIds.has(s.id));
  }, [students, selectedStudentIds]);

  // Generate page numbers array with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div id="student-directory-page" className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Student Directory</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {students.length} Records
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter and explore student records
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Generate Report Action */}
          {onNavigateToReports && (
            <button
              onClick={onNavigateToReports}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5"
              title="Open Reports page with active filters"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Generate Report</span>
            </button>
          )}

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
              title="Export records"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400" />
            </button>

            {exportDropdownOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-44 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setExportDropdownOpen(false)}
              >
                <button
                  onClick={() => onExportCsv(selectedStudentsList.length > 0 ? selectedStudentsList : sortedStudents)}
                  className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV {selectedStudentsList.length > 0 ? `(${selectedStudentsList.length})` : `(${sortedStudents.length})`}</span>
                </button>
                {onExportExcel && (
                  <button
                    onClick={() => onExportExcel(selectedStudentsList.length > 0 ? selectedStudentsList : sortedStudents)}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export Excel (.xls)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Search Bar + Filter Bar Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Prominent Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="directory-search-input"
            type="text"
            placeholder="Search by name, student ID, registration number, district or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-xs text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition font-medium"
          />
          {searchInput && (
            <button
                onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Academic Year */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Academic Year
            </label>
            <select
              value={filters.academicYear}
              onChange={(e) => {
                onFilterChange({ ...filters, academicYear: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
            >
              {ACADEMIC_YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => {
                onFilterChange({ ...filters, gender: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              District
            </label>
            <select
              value={filters.district}
              onChange={(e) => {
                onFilterChange({ ...filters, district: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition truncate"
            >
              {DISTRICT_LIST.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Quota */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Admission Quota
            </label>
            <select
              value={filters.quota || 'All Quotas'}
              onChange={(e) => {
                onFilterChange({ ...filters, quota: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition truncate"
            >
              {QUOTA_LIST.map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* School Type */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              School Type
            </label>
            <select
              value={filters.schoolType || 'All School Types'}
              onChange={(e) => {
                onFilterChange({ ...filters, schoolType: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition truncate"
            >
              {SCHOOL_TYPE_LIST.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filter Toggle Button */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-slate-100 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>More Filters</span>
            {secondaryFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-bold">
                {secondaryFilterCount}
              </span>
            )}
            {showMoreFilters ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 px-2.5 py-1 hover:bg-slate-100 rounded-md transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Expanded Secondary Filters Drawer */}
        {showMoreFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 pb-1 border-t border-slate-100 bg-slate-50/50 p-3 rounded-lg animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Category */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Social Category
              </label>
              <select
                value={filters.category || 'All Categories'}
                onChange={(e) => {
                  onFilterChange({ ...filters, category: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                {CATEGORY_LIST.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={filters.department || 'ALL'}
                onChange={(e) => {
                  onFilterChange({ ...filters, department: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                {DEPARTMENT_LIST.map(d => (
                  <option key={d.code} value={d.code}>{d.code === 'ALL' ? 'All Departments' : d.code}</option>
                ))}
              </select>
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Household Income
              </label>
              <select
                value={filters.incomeCategory || 'All Incomes'}
                onChange={(e) => {
                  onFilterChange({ ...filters, incomeCategory: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition truncate"
              >
                {INCOME_RANGES.map(inc => (
                  <option key={inc} value={inc}>{inc}</option>
                ))}
              </select>
            </div>

            {/* Agriculture Background */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Agriculture Origin
              </label>
              <select
                value={filters.agricultureBackground || 'All'}
                onChange={(e) => {
                  onFilterChange({ ...filters, agricultureBackground: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                <option value="All">All Backgrounds</option>
                <option value="Yes">Yes (Farming)</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* First Generation Graduate */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                First Gen Graduate
              </label>
              <select
                value={filters.firstGenerationGraduate || 'All'}
                onChange={(e) => {
                  onFilterChange({ ...filters, firstGenerationGraduate: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                <option value="All">All Status</option>
                <option value="Yes">Yes (First Gen)</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Performance Tier */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Marks / Tier
              </label>
              <select
                value={filters.marksRange || 'all'}
                onChange={(e) => {
                  onFilterChange({ ...filters, marksRange: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                <option value="all">All Tiers</option>
                <option value=">85">&gt; 85% Distinction</option>
                <option value="70-85">70% – 85% First Class</option>
                <option value="55-70">55% – 70% Second Class</option>
                <option value="<55">&lt; 55% Pass Class</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Hosteller / Dayscholar</label>
              <select value={filters.hostellerDayscholar || 'All'} onChange={(e) => { onFilterChange({ ...filters, hostellerDayscholar: e.target.value }); setCurrentPage(1); }} className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800">
                <option value="All">All Residence Types</option>
                <option>Day Scholar</option>
                <option>Hosteler (Block A)</option>
                <option>Hosteler (Block B)</option>
                <option>Hosteler (Block C)</option>
              </select>
            </div>

            <UnavailableDirectoryFilter label="Admission Type" value={filters.admissionType || 'All Admission Types'} />
            <UnavailableDirectoryFilter label="Residence Area" value={filters.residenceArea || 'All'} />
            <UnavailableDirectoryFilter label="Family Background" value={filters.familyBackground || 'All'} />
          </div>
        )}

        {/* Active Filters Removable Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Active:</span>

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>Search: &ldquo;{filters.searchQuery}&rdquo;</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.academicYear !== 'All Years' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>Batch {filters.academicYear}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, academicYear: 'All Years' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.gender !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>{filters.gender}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, gender: 'All' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.district !== 'All Districts' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>District: {filters.district}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, district: 'All Districts' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.quota && filters.quota !== 'All Quotas' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>{filters.quota}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, quota: 'All Quotas' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.schoolType && filters.schoolType !== 'All School Types' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>School: {filters.schoolType}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, schoolType: 'All School Types' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.category && filters.category !== 'All Categories' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>Category: {filters.category}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, category: 'All Categories' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.department && filters.department !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>Dept: {filters.department}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, department: 'ALL' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.incomeCategory && filters.incomeCategory !== 'All Incomes' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>Income: {filters.incomeCategory}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, incomeCategory: 'All Incomes' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.agricultureBackground && filters.agricultureBackground !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>Agri: {filters.agricultureBackground}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, agricultureBackground: 'All' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.firstGenerationGraduate && filters.firstGenerationGraduate !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>First Gen: {filters.firstGenerationGraduate}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, firstGenerationGraduate: 'All' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            {filters.marksRange && filters.marksRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                <span>Performance: {filters.marksRange}</span>
                <button 
                  onClick={() => onFilterChange({ ...filters, marksRange: 'all' })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}

            <button
              onClick={onResetFilters}
              className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold underline underline-offset-2 ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Directory insight cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <DirectoryInsight label="Students" value={students.length.toLocaleString()} />
        <DirectoryInsight label="Female %" value={students.length ? `${Math.round(students.filter(s => s.gender === 'Female').length / students.length * 100)}%` : '—'} />
        <DirectoryInsight label="First Graduate %" value={students.length ? `${Math.round(students.filter(s => s.firstGenerationGraduate).length / students.length * 100)}%` : '—'} />
        <DirectoryInsight label="Average XII Mark" value={students.length ? `${(students.reduce((sum, s) => sum + s.hscMarks, 0) / students.length).toFixed(1)}%` : '—'} />
        <DirectoryInsight label="Average Cut-off" value={students.length ? (students.reduce((sum, s) => sum + s.cutoffScore, 0) / students.length).toFixed(1) : '—'} />
        <DirectoryInsight label="Rural %" value="—" />
        <DirectoryInsight label="Government School %" value={students.length ? `${Math.round(students.filter(s => s.schoolType === 'Government').length / students.length * 100)}%` : '—'} />
        <DirectoryInsight label="Farming Background %" value={students.length ? `${Math.round(students.filter(s => s.agricultureBackground === 'Yes').length / students.length * 100)}%` : '—'} />
      </div>

      <DirectoryCharts students={students} filters={filters} onFilterChange={onFilterChange} />

      {/* 3. Directory Summary Bar (Count, Per-page, Sorting) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 px-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">{students.length} students found</span>
          {students.length > 0 && (
            <span className="text-slate-400">
              (Showing {startIndex + 1}–{endIndex} of {sortedStudents.length})
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Per Page Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Show:</span>
            {[25, 50, 100].map(size => (
              <button
                key={size}
                onClick={() => {
                  setItemsPerPage(size);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
                  itemsPerPage === size
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => handleSort(e.target.value as keyof Student)}
              className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1 font-semibold text-slate-800 focus:ring-1 focus:ring-slate-300"
            >
              <option value="name">Student Name</option>
              <option value="id">Student ID</option>
              <option value="academicYear">Academic Year</option>
              <option value="marksPercentage">Marks % / CGPA</option>
              <option value="district">District</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 bg-white border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 transition"
              title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <button onClick={() => setShowColumns(!showColumns)} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50">Columns</button>
            {showColumns && <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-slate-200 rounded-lg shadow-lg p-2 space-y-1">{Object.entries(visibleColumns).map(([key, visible]) => <label key={key} className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700"><input type="checkbox" checked={visible} onChange={() => setVisibleColumns({ ...visibleColumns, [key]: !visible })} />{key === 'firstGraduate' ? 'First Graduate' : key[0].toUpperCase() + key.slice(1)}</label>)}</div>}
          </div>
        </div>
      </div>

      {/* 4. Bulk Selection Docked Bar (Shown when 1+ rows selected) */}
      {selectedStudentIds.size > 0 && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex items-center justify-between shadow-md animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-2 text-xs">
            <CheckSquare className="w-4 h-4 text-slate-300" />
            <span className="font-bold">{selectedStudentIds.size} student{selectedStudentIds.size > 1 ? 's' : ''} selected</span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToReports && (
              <button
                onClick={onNavigateToReports}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
              >
                <FileText className="w-3 h-3 text-slate-400" />
                <span>Generate Report</span>
              </button>
            )}

            <button
              onClick={() => onExportCsv(selectedStudentsList)}
              className="px-3 py-1 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-lg transition flex items-center gap-1"
            >
              <Download className="w-3 h-3 text-slate-700" />
              <span>Export Selected CSV</span>
            </button>

            <button
              onClick={handleClearSelection}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 font-medium transition"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* 5. Institutional Student Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Desktop & Tablet Table */}
        <div className="hidden md:block overflow-x-auto">
          <table id="student-directory-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
                {/* Select All Checkbox */}
                <th className="py-3 px-3.5 w-10 text-center">
                  <button 
                    onClick={handleToggleSelectAllOnPage}
                    className="text-slate-400 hover:text-slate-800 transition"
                    title="Select all on this page"
                  >
                    {paginatedStudents.length > 0 && paginatedStudents.every(s => selectedStudentIds.has(s.id)) ? (
                      <CheckSquare className="w-4 h-4 text-slate-800" />
                    ) : paginatedStudents.some(s => selectedStudentIds.has(s.id)) ? (
                      <MinusSquare className="w-4 h-4 text-slate-700" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>

                {/* Student Column */}
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-slate-900">
                    <span>Student</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>

                {/* Student ID */}
                <th className="py-3 px-3">
                  <button onClick={() => handleSort('id')} className="flex items-center gap-1 hover:text-slate-900">
                    <span>Student ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>

                {/* Academic Year */}
                <th className="py-3 px-3">
                  <button onClick={() => handleSort('academicYear')} className="flex items-center gap-1 hover:text-slate-900">
                    <span>Year</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>

                {/* Gender */}
                {visibleColumns.gender && <th className="py-3 px-3">Gender</th>}

                {/* District */}
                {visibleColumns.district && <th className="py-3 px-3">
                  <button onClick={() => handleSort('district')} className="flex items-center gap-1 hover:text-slate-900">
                    <span>District</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>}

                {/* Admission Type is not present in the current Student shape. */}
                <th className="py-3 px-3">Admission Type</th>

                {/* School Type */}
                {visibleColumns.schoolType && <th className="py-3 px-3">School Type</th>}

                {/* Quota */}
                {visibleColumns.quota && <th className="py-3 px-3">Quota</th>}

                {/* Marks */}
                {visibleColumns.marks && <th className="py-3 px-4 text-right">
                  <button onClick={() => handleSort('marksPercentage')} className="flex items-center gap-1 ml-auto hover:text-slate-900">
                    <span>Marks</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>}

                {visibleColumns.firstGraduate && <th className="py-3 px-3">First Graduate</th>}

                {/* Action */}
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-14 text-center text-slate-400">
                    <GraduationCap className="w-9 h-9 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No students found</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Try another name, ID or remove some filters to find matching student records.
                    </p>
                    {hasActiveFilters && (
                      <button 
                        onClick={onResetFilters}
                        className="mt-3.5 px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition shadow-xs"
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const isSelected = selectedStudentIds.has(student.id);
                  const isDistinction = student.marksPercentage >= 85;

                  return (
                    <tr 
                      key={student.id} 
                      onClick={() => onSelectStudent(student)}
                      className={`hover:bg-slate-50/90 cursor-pointer transition group ${
                        isSelected ? 'bg-slate-50/70' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => handleToggleSelectStudent(student.id, e)}
                          className="text-slate-400 hover:text-slate-800 transition"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-slate-800" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>

                      {/* Student Name + Initials Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-slate-950 transition">
                              {student.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {student.rollNo} &middot; <span className="font-medium text-slate-600">{student.departmentCode}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {student.id}
                      </td>

                      {/* Academic Year */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold text-slate-700 border border-slate-200">
                          {student.academicYear}
                        </span>
                      </td>

                      {/* Gender (Normalized) */}
                      {visibleColumns.gender && <td className="py-3 px-3 text-slate-700 font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            student.gender === 'Female' ? 'bg-slate-400' : 'bg-slate-700'
                          }`}></span>
                          {student.gender || 'Unknown'}
                        </span>
                      </td>}

                      {/* District (Normalized + Tooltip safety) */}
                      {visibleColumns.district && <td className="py-3 px-3 text-slate-700 font-medium">
                        <div className="flex items-center gap-1 max-w-30 truncate" title={student.district}>
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{student.district || '—'}</span>
                        </div>
                      </td>}

                      <td className="py-3 px-3 text-slate-400">—</td>

                      {/* School Type (Normalized) */}
                      {visibleColumns.schoolType && <td className="py-3 px-3 text-slate-700">
                        <span className="text-[11px] font-medium">
                          {student.schoolType || '—'}
                        </span>
                      </td>}

                      {/* Quota */}
                      {visibleColumns.quota && <td className="py-3 px-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {student.quota}
                        </span>
                      </td>}

                      {/* Marks (Normalized format with decimal) */}
                      {visibleColumns.marks && <td className="py-3 px-4 text-right">
                        <div className="font-bold text-slate-900 text-xs">
                          {student.marksPercentage ? `${student.marksPercentage.toFixed(1)}%` : '—'}
                        </div>
                        {student.cgpa ? (
                          <div className="text-[10px] text-slate-500 font-medium">
                            {student.cgpa} CGPA
                          </div>
                        ) : null}
                      </td>}

                      {visibleColumns.firstGraduate && <td className="py-3 px-3"><span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{student.firstGenerationGraduate ? 'Yes' : 'No'}</span></td>}

                      {/* Action View */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-md border border-slate-200 hover:border-slate-300 shadow-2xs transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards View (< md) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {paginatedStudents.length === 0 ? (
            <div className="py-12 px-4 text-center text-slate-400">
              <GraduationCap className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700">No students found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting search or filters.</p>
              {hasActiveFilters && (
                <button 
                  onClick={onResetFilters}
                  className="mt-3 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            paginatedStudents.map((student) => (
              <div 
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="p-4 hover:bg-slate-50 cursor-pointer space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                      <div className="text-xs font-mono text-slate-500">{student.id} &middot; {student.rollNo}</div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {student.academicYear}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400">District:</span> <span className="font-medium text-slate-800">{student.district}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">School:</span> <span className="font-medium text-slate-800">{student.schoolType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Quota:</span> <span className="font-medium text-slate-800">{student.quota}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Marks:</span> <span className="font-bold text-slate-900">{student.marksPercentage}%</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(student);
                    }}
                    className="text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md border border-slate-200 flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 6. Pagination Controls */}
        <div className="p-3.5 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Showing</span>
            <span className="font-bold text-slate-800">
              {sortedStudents.length > 0 ? startIndex + 1 : 0}–{endIndex}
            </span>
            <span>of</span>
            <span className="font-bold text-slate-800">{sortedStudents.length}</span>
            <span>students</span>
            {allStudentsCount !== sortedStudents.length && (
              <span className="text-slate-400">({allStudentsCount} in database)</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={validCurrentPage === 1}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium transition flex items-center gap-1"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Page number buttons */}
            <div className="hidden sm:flex items-center gap-1">
              {getPageNumbers().map((p, idx) => (
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400">...</span>
                ) : (
                  <button
                    key={`page-${p}`}
                    onClick={() => setCurrentPage(p as number)}
                    className={`min-w-7.5 h-7.5 rounded-md text-xs font-semibold transition ${
                      validCurrentPage === p
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                )
              ))}
            </div>

            <span className="sm:hidden px-2 font-semibold text-slate-700">
              {validCurrentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={validCurrentPage === totalPages}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium transition flex items-center gap-1"
              title="Next Page"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UnavailableDirectoryFilter = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
    <select value={value} disabled className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-400 cursor-not-allowed">
      <option>{value} (unavailable)</option>
    </select>
  </div>
);
