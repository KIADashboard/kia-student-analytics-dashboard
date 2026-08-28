import React from 'react';
import { Bell, Building2, ShieldCheck, SlidersHorizontal } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">Manage institutional workspace preferences and notifications.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600"><Building2 className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-slate-900">Institution details</h2><p className="mt-1 text-xs text-slate-500">Kumaraguru Institute of Agriculture</p></div>
          </div>
          <div className="mt-5 space-y-3 text-sm"><label className="block"><span className="mb-1 block text-xs font-medium text-slate-500">Academic year</span><select className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"><option>2026–2027</option></select></label><label className="block"><span className="mb-1 block text-xs font-medium text-slate-500">Campus</span><input value="Main Campus · Coimbatore" readOnly className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" /></label></div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3"><div className="rounded-lg bg-slate-100 p-2 text-slate-600"><Bell className="h-5 w-5" /></div><div><h2 className="font-semibold text-slate-900">Notifications</h2><p className="mt-1 text-xs text-slate-500">Choose which updates reach the academic office.</p></div></div>
          <div className="mt-5 space-y-4 text-sm text-slate-700"><label className="flex items-center justify-between gap-4"><span>System notifications</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-slate-700" /></label><label className="flex items-center justify-between gap-4"><span>Report generation updates</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-slate-700" /></label><label className="flex items-center justify-between gap-4"><span>Data sync alerts</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-slate-700" /></label></div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2"><div className="flex items-center gap-3"><div className="rounded-lg bg-slate-100 p-2 text-slate-600"><ShieldCheck className="h-5 w-5" /></div><div><h2 className="font-semibold text-slate-900">Access and data</h2><p className="mt-1 text-xs text-slate-500">Administrative access is managed by the institutional identity provider.</p></div></div><div className="mt-5 flex items-center gap-2 text-xs font-medium text-emerald-700"><SlidersHorizontal className="h-4 w-4" />Realtime synchronization is enabled</div></div>
      </section>
    </div>
  );
};
