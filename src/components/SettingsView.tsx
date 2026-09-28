import React from 'react';
import { Bell, Building2, ShieldCheck, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="portal-hero rounded-3xl p-6 sm:p-8">
        <div className="relative z-10">
          <span className="portal-kicker">Institutional Administration</span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-serif text-[#FFFDEE] leading-tight">Settings & Governance</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#FFFDEE]/80">
            Manage institutional workspace preferences, communications, and access controls from a single administrative dashboard.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="portal-badge green">Realtime sync</span>
            <span className="portal-badge">Academic year 2026–2027</span>
          </div>
        </div>
      </div>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="portal-section bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E2FBCE] p-2.5 text-[#076653]"><Building2 className="h-5 w-5" /></div>
            <div>
              <h2 className="text-xl font-bold text-[#0C342C]">Institution details</h2>
              <p className="mt-1 text-xs text-[#06231D]/70">Kumaraguru Institute of Agriculture</p>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm">
            <label className="block">
              <span className="portal-label mb-2 block">Academic year</span>
              <select className="portal-input appearance-none">
                <option>2026–2027</option>
                <option>2025–2026</option>
                <option>2024–2025</option>
              </select>
            </label>
            <label className="block">
              <span className="portal-label mb-2 block">Campus</span>
              <input value="Main Campus · Coimbatore" readOnly className="portal-input" />
            </label>
          </div>
        </div>

        <div className="portal-section bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E2FBCE] p-2.5 text-[#076653]"><Bell className="h-5 w-5" /></div>
            <div>
              <h2 className="text-xl font-bold text-[#0C342C]">Notifications</h2>
              <p className="mt-1 text-xs text-[#06231D]/70">Choose which updates reach the academic office.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm text-[#0C342C]">
            {[
              'System notifications',
              'Report generation updates',
              'Data sync alerts'
            ].map((item) => (
              <label key={item} className="flex items-center justify-between gap-4 rounded-xl border border-[#0C342C]/10 bg-[#FFFDEE]/40 px-3 py-2.5">
                <span className="font-medium">{item}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#076653]" />
              </label>
            ))}
          </div>
        </div>

        <div className="portal-section bg-white p-5 sm:p-6 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E2FBCE] p-2.5 text-[#076653]"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <h2 className="text-xl font-bold text-[#0C342C]">Access and data</h2>
              <p className="mt-1 text-xs text-[#06231D]/70">Administrative access is managed by the institutional identity provider.</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#076653]/20 bg-[#E2FBCE]/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0C342C]">
              <SlidersHorizontal className="h-4 w-4 text-[#076653]" />
              Realtime synchronization is enabled
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#076653]">
              <CheckCircle2 className="h-4 w-4" />
              Verified
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
