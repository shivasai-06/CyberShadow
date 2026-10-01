import { Panel } from '../ui/Panel';
import type { DefenseImpact } from '../../types/simulation';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SimulationDefenseImpactProps {
  impacts: DefenseImpact[];
}

export function SimulationDefenseImpact({ impacts }: SimulationDefenseImpactProps) {
  if (!impacts || impacts.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">DEFENSE IMPACT</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {impacts.map((impact, idx) => {
          const isActive = impact.isActive;
          
          return (
            <Panel key={idx} className="bg-[#060a14] border-slate-800/60 p-4 flex flex-col gap-3 relative overflow-hidden group hover:border-slate-700/80 transition-colors">
              <div className={`absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none ${isActive ? 'text-green-500' : 'text-red-500'}`}>
                {isActive ? <CheckCircle2 size={100} /> : <XCircle size={100} />}
              </div>
              
              <div className="flex justify-between items-start z-10">
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                  {impact.control.replace(/_/g, ' ')}
                </h3>
                <div className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest ${
                  isActive ? 'bg-cyan-900/30 text-cyan-400' : 'bg-slate-800/50 text-slate-400'
                }`}>
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>
              
              <div className="z-10 mt-2">
                <p className="text-xs text-slate-400 leading-relaxed">
                  {impact.effectDescription}
                </p>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
