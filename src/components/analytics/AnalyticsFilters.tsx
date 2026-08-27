import React from 'react';
import { ArrowRight, Filter, RotateCcw, X } from 'lucide-react';
import { GlobalFilterState } from '../../types';
import { 
  DISTRICT_LIST, 
  ACADEMIC_YEARS, 
  SCHOOL_TYPE_LIST, 
  QUOTA_LIST 
} from '../../data/mockStudents';

interface AnalyticsFiltersProps {
  filters: GlobalFilterState;
  onFilterChange: (filters: GlobalFilterState) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
  isCalculating?: boolean;
  onViewStudents?: () => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount
  , isCalculating = false
  , onViewStudents
}) => {
  const isFiltered = 
    filters.academicYear !== 'All Years' || 
    filters.gender !== 'All' || 
    filters.district !== 'All Districts' || 
    filters.quota !== 'All Quotas' || 
    filters.schoolType !== 'All School Types' || 
    filters.hostellerDayscholar !== 'All' ||
    filters.agricultureBackground !== 'All' ||
    filters.firstGenerationGraduate !== 'All' ||
    (filters.searchQuery && filters.searchQuery.trim() !== '');

  const activeFilterChips = [
    filters.searchQuery.trim() && { label: `Search: ${filters.searchQuery}`, key: 'searchQuery', reset: '' },
    filters.academicYear !== 'All Years' && { label: `Year: ${filters.academicYear}`, key: 'academicYear', reset: 'All Years' },
    filters.gender !== 'All' && { label: `Gender: ${filters.gender}`, key: 'gender', reset: 'All' },
    filters.district !== 'All Districts' && { label: `District: ${filters.district}`, key: 'district', reset: 'All Districts' },
    filters.quota !== 'All Quotas' && { label: `Quota: ${filters.quota}`, key: 'quota', reset: 'All Quotas' },
    filters.schoolType !== 'All School Types' && { label: `School: ${filters.schoolType}`, key: 'schoolType', reset: 'All School Types' },
    filters.category !== 'All Categories' && { label: `Category: ${filters.category}`, key: 'category', reset: 'All Categories' },
    filters.department !== 'ALL' && { label: `Department: ${filters.department}`, key: 'department', reset: 'ALL' },
    filters.incomeCategory && filters.incomeCategory !== 'All Incomes' && { label: `Income: ${filters.incomeCategory}`, key: 'incomeCategory', reset: 'All Incomes' },
    filters.hostellerDayscholar !== 'All' && filters.hostellerDayscholar && { label: `Residence: ${filters.hostellerDayscholar}`, key: 'hostellerDayscholar', reset: 'All' },
    filters.firstGenerationGraduate !== 'All' && filters.firstGenerationGraduate && { label: `First Graduate: ${filters.firstGenerationGraduate}`, key: 'firstGenerationGraduate', reset: 'All' },
    filters.agricultureBackground !== 'All' && filters.agricultureBackground && { label: `Farming: ${filters.agricultureBackground}`, key: 'agricultureBackground', reset: 'All' },
    filters.marksRange !== 'all' && { label: `Marks: ${filters.marksRange}`, key: 'marksRange', reset: 'all' },
  ].filter(Boolean) as { label: string; key: keyof GlobalFilterState; reset: string }[];

  return (
    <div id="analytics-filter-container" className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Global Filters
          </span>
          <span className="text-xs text-slate-500 font-medium">({isCalculating ? 'Calculating…' : `Showing ${filteredCount} of ${totalCount} students`})</span>
        </div>

        <div className="flex items-center gap-2">
        {onViewStudents && <button onClick={onViewStudents} className="text-xs text-slate-700 hover:text-slate-950 font-semibold flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition"><span>View Students</span><ArrowRight className="w-3 h-3" /></button>}
        {isFiltered && (
          <button
            id="reset-analytics-filters-btn"
            onClick={onResetFilters}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition shrink-0"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Clear all filters</span>
          </button>
        )}
        </div>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {/* Academic Year */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Academic Year
          </label>
          <select
            id="filter-select-academic-year"
            value={filters.academicYear}
            onChange={(e) => onFilterChange({ ...filters, academicYear: e.target.value })}
            className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
          >
            {ACADEMIC_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <UnavailableFilter label="Admission Type" value={filters.admissionType || 'All Admission Types'} />

        {/* Gender */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Gender
          </label>
          <select
            id="filter-select-gender"
            value={filters.gender}
            onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
            className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <UnavailableFilter label="Board" value={filters.board || 'All Boards'} />

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Hosteller / Dayscholar</label>
          <select value={filters.hostellerDayscholar || 'All'} onChange={(e) => onFilterChange({ ...filters, hostellerDayscholar: e.target.value })} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800">
            <option value="All">All Residence Types</option><option>Day Scholar</option><option>Hosteler (Block A)</option><option>Hosteler (Block B)</option><option>Hosteler (Block C)</option>
          </select>
        </div>

        <UnavailableFilter label="Residence Area" value={filters.residenceArea || 'All'} />
        <UnavailableFilter label="Family Background" value={filters.familyBackground || 'All'} />

        {/* District */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            District
          </label>
          <select
            id="filter-select-district"
            value={filters.district}
            onChange={(e) => onFilterChange({ ...filters, district: e.target.value })}
            className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition truncate"
          >
            {DISTRICT_LIST.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Quota */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Admission Quota
          </label>
          <select
            id="filter-select-quota"
            value={filters.quota}
            onChange={(e) => onFilterChange({ ...filters, quota: e.target.value })}
            className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition truncate"
          >
            {QUOTA_LIST.map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        {/* School Type */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            School Type
          </label>
          <select
            id="filter-select-school-type"
            value={filters.schoolType}
            onChange={(e) => onFilterChange({ ...filters, schoolType: e.target.value })}
            className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition truncate"
          >
            {SCHOOL_TYPE_LIST.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterChips.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400">Active Filters:</span>
          {activeFilterChips.map(chip => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
            >
              <span>{chip.label}</span>
              <button
                onClick={() => onFilterChange({ ...filters, [chip.key]: chip.reset })}
                className="text-slate-400 hover:text-slate-700 ml-0.5"
                title={`Remove filter ${chip.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const UnavailableFilter = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</label>
    <select value={value} disabled className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-400 cursor-not-allowed"><option>{value} (unavailable)</option></select>
  </div>
);
