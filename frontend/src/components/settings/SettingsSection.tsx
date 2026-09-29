import React from 'react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800/80 bg-[#060a14]/50">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
