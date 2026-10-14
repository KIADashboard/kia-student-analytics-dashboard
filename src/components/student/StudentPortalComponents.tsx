import React from 'react';

export const Field = ({
  label,
  value,
  onChange,
  multiline = false,
  badge
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  badge?: 'green' | 'amber' | 'neutral';
  key?: React.Key;
}) => onChange ? (
  multiline ? (
    <label className="block">
      <span className="portal-label mb-2 block">{label}</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="portal-input min-h-24 resize-y"
      />
    </label>
  ) : (
    <label className="block">
      <span className="portal-label mb-2 block">{label}</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="portal-input"
      />
    </label>
  )
) : (
  <div className="bg-[#FFFDEE]/30 p-3.5 rounded-xl border border-[#0C342C]/10 transition-all hover:bg-white hover:border-[#076653]/30">
    <span className="portal-label block">{label}</span>
    <div className="mt-1 flex items-center justify-between">
      <p className="text-sm font-semibold text-[#0C342C]">{value || 'Not provided'}</p>
      {badge === 'green' && (
        <span className="portal-badge green text-[10px] font-bold">Active</span>
      )}
      {badge === 'amber' && (
        <span className="portal-badge amber text-[10px] font-bold">Pending</span>
      )}
      {badge === 'neutral' && (
        <span className="portal-badge text-[10px] font-bold">Verified</span>
      )}
    </div>
  </div>
);

export const PageIntro = ({
  kicker,
  title,
  copy,
  action
}: {
  kicker: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#0C342C]/10">
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-6 h-px bg-[#076653]/60"></span>
        <p className="portal-kicker">{kicker}</p>
      </div>
      <h1 className="text-3xl sm:text-4xl font-serif text-[#0C342C] font-bold">{title}</h1>
      <p className="text-sm text-[#06231D]/70 mt-2 max-w-2xl leading-relaxed">{copy}</p>
    </div>
    {action}
  </div>
);

export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="portal-section rounded-2xl border border-[#0C342C]/10 bg-white p-6 sm:p-8 shadow-xs">
    <h2 className="text-lg sm:text-xl font-serif text-[#0C342C] font-bold border-b border-[#0C342C]/10 pb-3 mb-6">
      {title}
    </h2>
    <div>{children}</div>
  </section>
);

export const InfoGrid = ({ fields }: { fields: [string, string][] }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {fields.map(([label, value]) => (
      <Field key={label} label={label} value={value} />
    ))}
  </div>
);
