import React from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  GraduationCap, 
  Database,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { ActiveTab } from '../types';
import { InstitutionLogo } from './InstitutionLogo';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  totalStudentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab,
  totalStudentsCount
}) => {
  return (
    <aside 
      id="app-sidebar" 
      className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <InstitutionLogo className="w-9 h-9 rounded-lg bg-slate-900 p-1 object-contain" imageClassName="object-contain" />
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
              <span>Kumaraguru Institute of Agriculture</span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Student Analytics Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Dashboards
        </div>

        {/* 1. Analytics */}
        <button
          id="nav-analytics-tab"
          onClick={() => onSelectTab('analytics')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
            activeTab === 'analytics'
              ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-200/80 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1 rounded-md transition ${
              activeTab === 'analytics' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
            }`}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <span>Analytics</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            activeTab === 'analytics' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            Overview
          </span>
        </button>

        {/* 2. Student Directory */}
        <button
          id="nav-directory-tab"
          onClick={() => onSelectTab('directory')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
            activeTab === 'directory'
              ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-200/80 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1 rounded-md transition ${
              activeTab === 'directory' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
            }`}>
              <Users className="w-4 h-4" />
            </div>
            <span>Student Directory</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
            activeTab === 'directory' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {totalStudentsCount}
          </span>
        </button>

        {/* 3. Reports */}
        <button
          id="nav-reports-tab"
          onClick={() => onSelectTab('reports')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
            activeTab === 'reports'
              ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-200/80 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1 rounded-md transition ${
              activeTab === 'reports' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
            }`}>
              <FileText className="w-4 h-4" />
            </div>
            <span>Reports & Exports</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            activeTab === 'reports' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            CSV / PDF
          </span>
        </button>

        {/* Institutional Quick Guidelines */}
        <div className="pt-6 px-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Session In Progress</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Odd Semester 2024–25 continuous assessments and attendance matrices verified.
            </p>
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/70">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-medium text-slate-700">Sync: Realtime</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">v4.2.0</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Official Institutional System</span>
          <HelpCircle className="w-3 h-3 hover:text-slate-600 cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};
