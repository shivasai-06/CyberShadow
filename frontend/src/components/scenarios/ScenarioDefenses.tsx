import type { ScenarioDefensiveControl } from '../../types/scenarios';
import { ShieldCheck } from 'lucide-react';

interface ScenarioDefensesProps {
  controls: ScenarioDefensiveControl[];
}

export function ScenarioDefenses({ controls }: ScenarioDefensesProps) {
  return (
    <div className="bg-[#060a14] p-5 rounded-lg border border-slate-800/80 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DEFENSIVE CONTROLS</h4>
      </div>
      
      <div className="space-y-3 mb-6 flex-1">
        {controls.map((ctrl, i) => (
          <div key={i} className="p-3 bg-[#0b1120] border border-cyan-900/30 rounded">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={12} className="text-cyan-500" />
              <h5 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{ctrl.name}</h5>
            </div>
            <p className="text-xs text-slate-400 leading-snug">{ctrl.description}</p>
          </div>
        ))}
      </div>
      
      <div className="pt-3 border-t border-slate-800">
        <p className="text-[9px] text-amber-500/70 font-mono tracking-widest uppercase">
          SIMULATION CONTROLS ONLY. Does NOT modify real systems.
        </p>
      </div>
    </div>
  );
}
