import React from 'react';
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { UserRole } from '../types';
import { InstitutionLogo } from './InstitutionLogo';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-5 relative overflow-hidden">
    <div className="absolute inset-0 opacity-40 bg-[linear-gradient(#e2e8f0_1px,transparent_1px),linear-gradient(90deg,#e2e8f0_1px,transparent_1px)] bg-size-[44px_44px]" />
    <div className="relative w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] bg-white border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
      <div className="bg-slate-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-107.5">
        <div className="flex items-center gap-3"><InstitutionLogo className="w-12 h-12 rounded-lg bg-white p-1 object-contain" imageClassName="object-contain" /><span className="font-bold tracking-tight">Kumaraguru Institute of Agriculture</span></div>
        <div className="max-w-md mt-14"><p className="text-slate-300 text-xs uppercase tracking-[0.25em] font-bold mb-5">Kumaraguru Institute of Agriculture</p><h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">Your academic journey, in one place.</h1><p className="mt-6 text-slate-300 leading-relaxed">Access your student records, goals, achievements, and documents with clarity.</p></div>
        <p className="text-xs text-slate-400 mt-14">Secure institutional access · Academic year 2024–25</p>
      </div>
      <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center"><div className="flex items-center gap-2 text-slate-700 mb-3"><Sparkles className="w-4 h-4" /><span className="text-xs uppercase tracking-[0.2em] font-bold">Welcome back</span></div><h2 className="text-3xl font-semibold tracking-tight">Sign in to continue</h2><p className="text-sm text-slate-500 mt-3 mb-8">Choose the workspace connected to your account.</p><div className="space-y-3"><button onClick={() => onLogin('student')} className="w-full flex items-center justify-between p-4 border border-slate-300 bg-slate-50 hover:bg-slate-100 transition text-left group"><span className="flex items-center gap-3"><span className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center"><GraduationCap className="w-4 h-4" /></span><span><span className="block font-semibold text-sm">Student portal</span><span className="block text-xs text-slate-500 mt-0.5">Manage your personal academic journey</span></span></span><ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition" /></button><button onClick={() => onLogin('admin')} className="w-full flex items-center justify-between p-4 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition text-left group"><span className="flex items-center gap-3"><span className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></span><span><span className="block font-semibold text-sm">Administration</span><span className="block text-xs text-slate-500 mt-0.5">Analytics, directory, and reports</span></span></span><ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition" /></button></div><p className="text-[11px] text-slate-400 mt-8">Demo access is enabled for this frontend preview.</p></div>
    </div>
  </div>
);
