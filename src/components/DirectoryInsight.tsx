import React from 'react';

interface DirectoryInsightProps {
  label: string;
  value: string;
}

export const DirectoryInsight: React.FC<DirectoryInsightProps> = ({ label, value }) => (
  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
    <strong className="block mt-2 text-xl font-bold text-slate-900">{value}</strong>
  </div>
);
