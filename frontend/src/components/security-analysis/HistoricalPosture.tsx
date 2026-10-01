import { Activity, ShieldCheck, ShieldAlert, BarChart3, Target } from 'lucide-react';
import type { SecurityPosture } from '../../types/security-posture';

export function HistoricalPosture({ posture }: { posture: SecurityPosture }) {
  if (posture.totalAnalyzedSimulations === 0) {
    return (
      <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-8 text-center animate-in fade-in">
        <Activity size={32} className="text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">NO SIMULATION DATA YET</h3>
        <p className="text-sm text-slate-400">Complete a simulation to begin building your CyberShadow security posture.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#060a14] border border-slate-800/80 p-5 rounded-lg">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Activity size={12} /> Simulations Analyzed
          </div>
          <div className="text-2xl font-bold text-white">{posture.totalAnalyzedSimulations}</div>
        </div>
        <div className="bg-[#060a14] border border-slate-800/80 p-5 rounded-lg">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldAlert size={12} /> Findings Observed
          </div>
          <div className="text-2xl font-bold text-orange-400">{posture.totalFindings}</div>
        </div>
        <div className="bg-[#060a14] border border-slate-800/80 p-5 rounded-lg">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck size={12} /> Active Defenses
          </div>
          <div className="text-2xl font-bold text-green-400">{posture.defenseCoverage.filter(d => d.status === 'ACTIVE' || d.status === 'STRONG').length}</div>
        </div>
        <div className="bg-[#060a14] border border-slate-800/80 p-5 rounded-lg">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <BarChart3 size={12} /> Learning Trend
          </div>
          <div className={`text-sm font-bold uppercase tracking-widest mt-2 ${
            posture.recentTrend === 'IMPROVING' ? 'text-green-500' :
            posture.recentTrend === 'NEEDS PRACTICE' ? 'text-orange-500' :
            posture.recentTrend === 'MIXED' ? 'text-amber-500' : 'text-slate-500'
          }`}>{posture.recentTrend}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recurring Weaknesses */}
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6">
          <h3 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Target size={14} /> RECURRING WEAKNESSES
          </h3>
          {posture.recurringWeaknesses.length === 0 ? (
            <div className="text-sm text-slate-400 italic">No recurring weaknesses identified in simulation history.</div>
          ) : (
            <div className="space-y-4">
              {posture.recurringWeaknesses.map(w => (
                <div key={w.id} className="p-4 border border-orange-500/20 bg-orange-950/10 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-white">{w.title}</h4>
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-950/50 px-2 py-1 rounded">
                      {w.occurrenceCount}x OBSERVED
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-3">{w.affectedAssets.join(', ')} • {w.highestSeverity} SEVERITY</div>
                  <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">PRACTICE RECOMMENDATION</div>
                  <div className="text-xs text-cyan-200">{w.recommendedPractice}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Defense Coverage */}
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6">
          <h3 className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShieldCheck size={14} /> DEFENSE COVERAGE
          </h3>
          <div className="space-y-3">
            {posture.defenseCoverage.map(d => (
              <div key={d.controlName} className="flex items-center justify-between p-3 border border-slate-800/50 bg-[#060a14] rounded">
                <div className="text-sm font-bold text-white">{d.controlName}</div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase ${
                  d.status === 'STRONG' ? 'text-green-400 bg-green-950/50' :
                  d.status === 'ACTIVE' ? 'text-blue-400 bg-blue-950/50' :
                  d.status === 'NEEDS PRACTICE' ? 'text-orange-400 bg-orange-950/50' :
                  'text-slate-500 bg-slate-900'
                }`}>
                  {d.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
