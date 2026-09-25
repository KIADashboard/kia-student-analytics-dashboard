import React from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Database,
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
      className="w-64 bg-[#FFFDEE] border-r border-[#0C342C]/10 flex flex-col shrink-0 h-screen sticky top-0 select-none shadow-xs"
    >
      {/* Brand Header matching Landing Page Navbar */}
      <div className="p-5 border-b border-[#0C342C]/10 bg-[#FFFDEE]/80">
        <div className="flex items-center gap-3">
          <InstitutionLogo 
            className="w-10 h-10 rounded-xl bg-[#0C342C] p-1.5 object-contain shadow-xs shrink-0" 
            imageClassName="object-contain" 
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#0C342C] tracking-wide uppercase leading-tight truncate">
                Kumaraguru
              </span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#E2FBCE] text-[#0C342C] border border-[#076653]/25 shrink-0">
                PRO
              </span>
            </div>
            <div className="h-[2px] w-full bg-[#c8953e] my-[2px] opacity-80"></div>
            <span className="text-[10px] text-[#076653] font-semibold tracking-wider uppercase leading-none truncate">
              Institute of Agriculture
            </span>
            <span className="text-[9px] text-[#0C342C]/60 font-medium mt-1">
              Student Analytics Suite
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#076653]">
          Core Dashboards
        </div>

        {/* 1. Analytics */}
        <button
          id="nav-analytics-tab"
          onClick={() => onSelectTab('analytics')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group ${
            activeTab === 'analytics'
              ? 'bg-linear-to-r from-[#076653] to-[#0C342C] text-[#FFFDEE] font-bold shadow-md shadow-[#076653]/20 border border-[#E2FBCE]/30'
              : 'text-[#0C342C]/80 hover:text-[#0C342C] hover:bg-[#E2FBCE]/50 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1 rounded-md transition ${
              activeTab === 'analytics' ? 'text-[#E2FBCE]' : 'text-[#076653] group-hover:text-[#0C342C]'
            }`}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <span>Analytics</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            activeTab === 'analytics' 
              ? 'bg-[#0C342C] text-[#FFFDEE] border border-white/20' 
              : 'bg-white text-[#0C342C] border border-[#0C342C]/10 group-hover:border-[#076653]/30'
          }`}>
            Overview
          </span>
        </button>

        {/* 2. Student Directory */}
        <button
          id="nav-directory-tab"
          onClick={() => onSelectTab('directory')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group ${
            activeTab === 'directory'
              ? 'bg-linear-to-r from-[#076653] to-[#0C342C] text-[#FFFDEE] font-bold shadow-md shadow-[#076653]/20 border border-[#E2FBCE]/30'
              : 'text-[#0C342C]/80 hover:text-[#0C342C] hover:bg-[#E2FBCE]/50 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1 rounded-md transition ${
              activeTab === 'directory' ? 'text-[#E2FBCE]' : 'text-[#076653] group-hover:text-[#0C342C]'
            }`}>
              <Users className="w-4 h-4" />
            </div>
            <span>Student Directory</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            activeTab === 'directory' 
              ? 'bg-[#0C342C] text-[#FFFDEE] border border-white/20' 
              : 'bg-[#E2FBCE] text-[#0C342C] border border-[#076653]/20'
          }`}>
            {totalStudentsCount}
          </span>
        </button>

        {/* 3. Reports */}
        <button
          id="nav-reports-tab"
          onClick={() => onSelectTab('reports')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group ${
            activeTab === 'reports'
              ? 'bg-linear-to-r from-[#076653] to-[#0C342C] text-[#FFFDEE] font-bold shadow-md shadow-[#076653]/20 border border-[#E2FBCE]/30'
              : 'text-[#0C342C]/80 hover:text-[#0C342C] hover:bg-[#E2FBCE]/50 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1 rounded-md transition ${
              activeTab === 'reports' ? 'text-[#E2FBCE]' : 'text-[#076653] group-hover:text-[#0C342C]'
            }`}>
              <FileText className="w-4 h-4" />
            </div>
            <span>Reports & Exports</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            activeTab === 'reports' 
              ? 'bg-[#0C342C] text-[#FFFDEE] border border-white/20' 
              : 'bg-white text-[#0C342C] border border-[#0C342C]/10 group-hover:border-[#076653]/30'
          }`}>
            CSV / PDF
          </span>
        </button>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-[#0C342C]/10 bg-white/70">
        <div className="flex items-center justify-between text-[11px] text-[#0C342C]">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#076653]" />
            <span className="font-semibold text-[#0C342C]">Sync: Realtime</span>
          </div>
          <span className="text-[10px] text-[#076653] font-mono font-bold bg-[#E2FBCE]/60 px-1.5 py-0.5 rounded">
            v4.2.0
          </span>
        </div>
        <div className="mt-2 text-[10px] text-[#0C342C]/60 flex items-center justify-between">
          <span>Official Institutional System</span>
          <HelpCircle className="w-3.5 h-3.5 text-[#076653]/70 hover:text-[#0C342C] cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};
