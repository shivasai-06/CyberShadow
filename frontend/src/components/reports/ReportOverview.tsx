import type { ReportOverviewMetrics } from '../../types/reports';

interface ReportOverviewProps {
  metrics: ReportOverviewMetrics;
}

export function ReportOverview({ metrics }: ReportOverviewProps) {
  const total = metrics.attacksBlocked + metrics.simulatedCompromises;
  const blockedPercent = total > 0 ? Math.round((metrics.attacksBlocked / total) * 100) : 0;
  const compromisedPercent = total > 0 ? Math.round((metrics.simulatedCompromises / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* High-level metrics */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-5">
          <div className="text-3xl font-bold text-white mb-2">{metrics.simulationsCompleted}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SIMULATIONS<br/>COMPLETED</div>
        </div>
        <div className="bg-[#0b1120] border border-green-900/30 rounded-lg p-5">
          <div className="text-3xl font-bold text-green-400 mb-2">{metrics.attacksBlocked}</div>
          <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">ATTACKS<br/>BLOCKED</div>
        </div>
        <div className="bg-[#0b1120] border border-red-900/30 rounded-lg p-5">
          <div className="text-3xl font-bold text-red-400 mb-2">{metrics.simulatedCompromises}</div>
          <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest">SIMULATED<br/>COMPROMISES</div>
        </div>
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-5">
          <div className="text-3xl font-bold text-violet-400 mb-2">{metrics.scenariosExplored}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SCENARIOS<br/>EXPLORED</div>
        </div>
      </div>

      {/* Outcome Breakdown */}
      <div className="lg:col-span-1 bg-[#0b1120] border border-slate-800/80 rounded-lg p-6 flex flex-col justify-center">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">SIMULATION OUTCOMES</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-green-400 tracking-wider">BLOCKED {blockedPercent}%</span>
              <span className="text-slate-500">{metrics.attacksBlocked}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${blockedPercent}%` }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-red-400 tracking-wider">COMPROMISED {compromisedPercent}%</span>
              <span className="text-slate-500">{metrics.simulatedCompromises}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${compromisedPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
