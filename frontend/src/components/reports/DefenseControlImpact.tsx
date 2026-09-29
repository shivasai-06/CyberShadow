import type { DefenseImpact } from '../../types/reports';
import { ShieldCheck } from 'lucide-react';

interface DefenseControlImpactProps {
  impacts: DefenseImpact[];
}

export function DefenseControlImpact({ impacts }: DefenseControlImpactProps) {
  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">DEFENSE CONTROL IMPACT</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {impacts.map((impact, idx) => (
          <div key={idx} className="bg-[#060a14] border border-slate-800 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm font-bold text-white tracking-wide">{impact.controlName}</h4>
              <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border ${
                impact.status === 'ENABLED' ? 'bg-cyan-950/30 text-cyan-400 border-cyan-900/50' : 'bg-slate-900 text-slate-500 border-slate-700'
              }`}>
                {impact.status}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-green-400">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                {impact.blockedCount} simulated attacks blocked
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {impact.explanation}
            </p>
          </div>
        ))}
      </div>
      
      <div className="pt-6 mt-6 border-t border-slate-800/80">
        <p className="text-[9px] text-amber-500/70 font-mono tracking-widest uppercase">
          In CyberShadow simulations, these controls changed the fictional outcomes. They do not represent real-world effectiveness.
        </p>
      </div>
    </div>
  );
}
