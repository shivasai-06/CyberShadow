import type { SecurityControlDef } from '../../types/security';
import { ArrowDown, Info } from 'lucide-react';

interface WhatChangesPanelProps {
  control: SecurityControlDef;
  isActive: boolean;
}

export function WhatChangesPanel({ control, isActive }: WhatChangesPanelProps) {
  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Info size={16} className="text-violet-500" />
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WHAT CHANGES IN SIMULATION?</h3>
      </div>
      
      <div className="mb-6">
        <h4 className="text-xs font-bold text-white tracking-wide mb-2 uppercase">{control.name}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          {isActive 
            ? `When enabled, ${control.name.toLowerCase()} interrupts the fictional attack path.` 
            : `When disabled, fictional attacks can progress through this stage.`}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#060a14] border border-slate-800 rounded p-4 flex flex-col items-center opacity-50 grayscale">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4 w-full text-left">BEFORE (OFF)</div>
          
          <div className="flex flex-col items-center w-full gap-2">
            {control.beforePath.map((node, idx) => (
              <div key={idx} className="flex flex-col items-center w-full">
                <div className={`px-2 py-1 border rounded text-[9px] font-bold tracking-wide uppercase text-center w-full max-w-[140px] ${
                  idx === control.beforePath.length - 1 
                    ? 'bg-red-950/30 border-red-500/50 text-red-400' 
                    : 'bg-[#0b1120] border-slate-700 text-slate-300'
                }`}>
                  {node}
                </div>
                {idx < control.beforePath.length - 1 && <ArrowDown size={10} className="text-slate-600" />}
              </div>
            ))}
          </div>
        </div>

        <div className={`bg-[#060a14] border rounded p-4 flex flex-col items-center transition-all duration-500 ${
          isActive ? 'border-cyan-900/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-slate-800 opacity-50 grayscale'
        }`}>
          <div className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest mb-4 w-full text-left">AFTER (ON)</div>
          
          <div className="flex flex-col items-center w-full gap-2">
            {control.afterPath.map((node, idx) => {
              const isBlocked = node === 'ATTACK BLOCKED';
              return (
                <div key={idx} className="flex flex-col items-center w-full">
                  <div className={`px-2 py-1 border rounded text-[9px] font-bold tracking-wide uppercase text-center w-full max-w-[140px] ${
                    isBlocked 
                      ? 'bg-green-950/30 border-green-500/50 text-green-400' 
                      : 'bg-[#0b1120] border-slate-700 text-slate-300'
                  }`}>
                    {node}
                  </div>
                  {idx < control.afterPath.length - 1 && <ArrowDown size={10} className="text-slate-600" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
}
