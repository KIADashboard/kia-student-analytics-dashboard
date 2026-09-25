import React from 'react';
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { UserRole } from '../types';
import { InstitutionLogo } from './InstitutionLogo';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => (
  <div className="min-h-screen bg-[#FFFDEE] text-[#0C342C] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
    {/* Subtle Institutional Grid Texture */}
    <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(12,52,44,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(12,52,44,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
    
    {/* Ambient Glow */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-radial from-[#076653]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-radial from-[#E2FBCE]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

    <div className="relative w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] bg-white border border-[#0C342C]/10 rounded-3xl shadow-2xl shadow-[#0C342C]/10 overflow-hidden">
      {/* Left Institutional Showcase Panel */}
      <div className="bg-[#0C342C] text-[#FFFDEE] p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-radial from-[#076653]/40 to-transparent pointer-events-none rounded-full blur-2xl" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <InstitutionLogo 
            className="w-12 h-12 rounded-xl bg-white p-1.5 object-contain shadow-xs shrink-0" 
            imageClassName="object-contain" 
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide uppercase text-[#FFFDEE]">
              Kumaraguru
            </span>
            <div className="h-[2px] w-full bg-[#c8953e] my-[2px] opacity-80"></div>
            <span className="text-[10px] text-[#E2FBCE] font-semibold tracking-wider uppercase">
              Institute of Agriculture
            </span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-md my-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-[#E2FBCE]/60"></span>
            <p className="text-[#E2FBCE] text-[10px] uppercase tracking-[0.25em] font-bold">
              Campus Analytics Portal
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal leading-[1.1] tracking-tight">
            Cultivating excellence, <br />
            <span className="italic font-light text-[#E2FBCE]">guided by data.</span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-[#FFFDEE]/80 leading-relaxed font-light">
            Access your student records, monitor academic performance, chart aspirations, and review verified credentials in one integrated portal.
          </p>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-[#FFFDEE]/60 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E3EF26]"></span>
          <span>Sakthi Nagar Campus, Erode &middot; AY 2026–2027</span>
        </div>
      </div>

      {/* Right Login Action Panel */}
      <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
        <div className="flex items-center gap-2 text-[#076653] mb-3">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.22em] font-bold">
            Portal Access
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#0C342C] font-bold tracking-tight">
          Sign In to Continue
        </h2>
        <p className="text-xs sm:text-sm text-[#06231D]/65 mt-2 mb-8">
          Choose the role corresponding to your verified KIA account.
        </p>

        <div className="space-y-4">
          {/* 1. Student Portal Button */}
          <button 
            onClick={() => onLogin('student')} 
            className="w-full flex items-center justify-between p-4 sm:p-5 border border-[#076653]/30 bg-[#FFFDEE] hover:bg-[#E2FBCE]/60 rounded-2xl transition-all duration-300 text-left group shadow-xs hover:shadow-md hover:border-[#076653]"
          >
            <span className="flex items-center gap-3.5">
              <span className="w-11 h-11 rounded-xl bg-linear-to-br from-[#076653] to-[#0C342C] text-[#FFFDEE] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-[#E2FBCE]" />
              </span>
              <span>
                <span className="block font-bold text-sm text-[#0C342C]">
                  KIA Student Portal
                </span>
                <span className="block text-xs text-[#06231D]/65 mt-0.5">
                  Academics, aspiration survey, and student profile
                </span>
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-[#076653] group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* 2. Admin Portal Button */}
          <button 
            onClick={() => onLogin('admin')} 
            className="w-full flex items-center justify-between p-4 sm:p-5 border border-[#0C342C]/15 hover:border-[#076653]/50 hover:bg-[#FFFDEE] rounded-2xl transition-all duration-300 text-left group"
          >
            <span className="flex items-center gap-3.5">
              <span className="w-11 h-11 rounded-xl bg-white text-[#0C342C] border border-[#0C342C]/15 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#076653]" />
              </span>
              <span>
                <span className="block font-bold text-sm text-[#0C342C]">
                  Institutional Administration
                </span>
                <span className="block text-xs text-[#06231D]/65 mt-0.5">
                  Cohort analytics, student directory, and reports
                </span>
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-[#0C342C]/50 group-hover:text-[#076653] group-hover:translate-x-1.5 transition-all" />
          </button>
        </div>

        <p className="text-[11px] text-[#0C342C]/50 mt-8 text-center sm:text-left">
          Kumaraguru Institute of Agriculture &middot; Official Student Information System
        </p>
      </div>
    </div>
  </div>
);
