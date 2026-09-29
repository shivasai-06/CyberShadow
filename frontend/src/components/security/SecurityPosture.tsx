import type { SecurityPostureMetrics } from '../../types/security';
import { ShieldCheck, Activity } from 'lucide-react';

interface SecurityPostureProps {
  metrics: SecurityPostureMetrics;
}

export function SecurityPosture({ metrics }: SecurityPostureProps) {
  const riskColor = 
    metrics.simulatedRisk === 'LOW' ? 'text-green-400' :
    metrics.simulatedRisk === 'MEDIUM' ? 'text-amber-400' :
    'text-red-400';

  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={16} className="text-cyan-500" />
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SIMULATED SECURITY POSTURE</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-[#060a14] border border-slate-800 rounded-lg p-4 col-span-2 md:col-span-1 flex flex-col justify-center">
          <div className="text-3xl font-bold text-white mb-1">{metrics.coveragePercent}%</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">PROTECTION COVERAGE</div>
          <div className="w-full h-1 bg-slate-900 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${metrics.coveragePercent}%` }} />
          </div>
        </div>

        <div className="bg-[#060a14] border border-slate-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-cyan-400 mb-1">{metrics.activeControls} / {metrics.totalControls}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">ACTIVE CONTROLS</div>
        </div>

        <div className="bg-[#060a14] border border-slate-800 rounded-lg p-4">
          <div className={`text-2xl font-bold mb-1 ${riskColor}`}>{metrics.simulatedRisk}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SIMULATED RISK</div>
        </div>

        <div className="bg-[#060a14] border border-slate-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400 mb-1">{metrics.vulnerablePaths}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">VULNERABLE PATHS</div>
        </div>

        <div className="bg-[#060a14] border border-slate-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400 mb-1">{metrics.blockedPaths}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">BLOCKED PATHS</div>
        </div>

      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <Activity size={12} className="text-amber-500/70" />
        <span className="text-[9px] text-amber-500/70 font-mono tracking-widest uppercase">
          Simulation metrics only. Does not represent real-world security.
        </span>
      </div>
    </div>
  );
}
