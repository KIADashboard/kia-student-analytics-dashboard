import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  Calendar, 
  ShieldCheck, 
  ChevronDown, 
  LogOut, 
  Settings 
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTab: (tab: 'analytics' | 'directory' | 'reports' | 'settings') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  searchQuery, 
  onSearchChange,
  onSelectTab,
  onLogout
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header 
      id="main-header" 
      className="sticky top-0 z-20 bg-[#FFFDEE]/90 backdrop-blur-md border-b border-[#0C342C]/10 px-6 py-3.5 transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Campus Location Indicator matching Landing Page */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-[#0C342C]/10 rounded-full text-xs font-semibold text-[#0C342C] shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-[#076653]" />
            <span>Main Campus &middot; Sakthi Nagar, Erode</span>
          </div>
        </div>

        {/* Center: Global Quick Search */}
        <div className="flex-1 max-w-md mx-2 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-[#076653] absolute left-3.5 top-1/2 -translate-y-1/2" />
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
              className="w-full pl-9 pr-8 py-2 bg-white hover:bg-white focus:bg-white text-xs text-[#0C342C] placeholder-[#0C342C]/40 border border-[#0C342C]/15 rounded-full focus:outline-none focus:ring-2 focus:ring-[#076653]/30 focus:border-[#076653] transition shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#0C342C]/40 hover:text-[#0C342C]"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Right: Academic Context & User Badge */}
        <div className="flex items-center gap-3">
          {/* Active Period Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-[#E2FBCE]/60 border border-[#076653]/25 rounded-full text-xs font-semibold text-[#0C342C]">
            <Calendar className="w-3.5 h-3.5 text-[#076653]" />
            <span>Academic Year 2026–2027</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#076653] ml-0.5"></span>
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button 
              id="header-notification-btn"
              title="System Notifications"
              className="p-2 text-[#0C342C]/70 hover:text-[#0C342C] hover:bg-[#E2FBCE]/50 rounded-full border border-[#0C342C]/10 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#076653] rounded-full ring-2 ring-white"></span>
            </button>
          </div>

          <div className="h-5 w-px bg-[#0C342C]/15"></div>

          {/* Admin User Profile */}
          <div className="relative flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#076653] to-[#0C342C] text-[#FFFDEE] font-bold text-xs flex items-center justify-center shadow-xs border border-[#E2FBCE]/30">
              AO
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-[#0C342C] leading-tight flex items-center gap-1">
                <span>Academic Office</span>
                <ShieldCheck className="w-3 h-3 text-[#076653]" />
              </div>
              <div className="text-[10px] text-[#076653] font-semibold">Dean of Academics</div>
            </div>
            <button
              type="button"
              title="Open account menu"
              aria-label="Open account menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen(value => !value)}
              className="p-1.5 text-[#0C342C]/50 hover:text-[#0C342C] hover:bg-[#E2FBCE]/50 rounded-full transition"
            >
              <ChevronDown className={`w-3.5 h-3.5 hidden xl:block transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#0C342C]/10 bg-white p-1.5 shadow-xl z-30">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onSelectTab('settings');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#0C342C] hover:bg-[#E2FBCE]/50 transition"
                >
                  <Settings className="w-4 h-4 text-[#076653]" />
                  System Settings
                </button>
              </div>
            )}
            <button
              id="admin-logout-btn"
              type="button"
              title="Log out"
              aria-label="Log out"
              onClick={onLogout}
              className="p-2 text-[#0C342C]/50 hover:text-[#0C342C] hover:bg-[#E2FBCE]/50 rounded-full transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
