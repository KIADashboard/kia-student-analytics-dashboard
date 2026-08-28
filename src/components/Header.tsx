import React from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  Calendar, 
  ShieldCheck, 
  ChevronDown,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTab: (tab: 'analytics' | 'directory' | 'reports') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  searchQuery, 
  onSearchChange,
  onSelectTab,
  onLogout
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200/80 px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Campus Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-100/90 border border-slate-200/70 rounded-md text-xs font-medium text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Main Campus &middot; Coimbatore</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="hidden md:inline">Institutional ERP</span>
            <span className="text-slate-300 hidden md:inline">/</span>
            <span className="text-slate-800 font-bold uppercase tracking-wider text-[11px]">
              {activeTab === 'analytics' && 'Institutional Analytics'}
              {activeTab === 'directory' && 'Student Directory & Records'}
              {activeTab === 'reports' && 'Batch Report Generation'}
            </span>
          </div>
        </div>

        {/* Center: Global Quick Search */}
        <div className="flex-1 max-w-md mx-2 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              id="global-search-input"
              type="text"
              placeholder="Quick search by Student Name, Roll No, or ID..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'directory' && e.target.value.trim().length > 0) {
                  onSelectTab('directory');
                }
              }}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Right: Academic Context & User Badge */}
        <div className="flex items-center gap-3">
          {/* Active Period Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Academic Year 2024–2025</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 ml-0.5"></span>
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button 
              id="header-notification-btn"
              title="System Notifications"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-slate-700 rounded-full"></span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* Admin User Profile */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-lg bg-slate-800 text-white font-semibold text-xs flex items-center justify-center shadow-2xs">
              AO
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight flex items-center gap-1">
                <span>Academic Office</span>
                <ShieldCheck className="w-3 h-3 text-slate-500" />
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Dean of Academics</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            <button
              id="admin-logout-btn"
              type="button"
              title="Log out"
              aria-label="Log out"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
