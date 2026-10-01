import { Target } from 'lucide-react';
import type { SecurityPosture } from '../../types/security-posture';

export function ReportPostureSummary({ posture }: { posture: SecurityPosture }) {
  if (posture.totalAnalyzedSimulations === 0) return null;

  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6 animate-in fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Target size={16} className="text-cyan-500" />
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SECURITY POSTURE SUMMARY (PHASE 5.2)</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SIMULATION TREND</div>
          <div className={`text-sm font-bold uppercase tracking-widest ${
            posture.recentTrend === 'IMPROVING' ? 'text-green-500' :
            posture.recentTrend === 'NEEDS PRACTICE' ? 'text-orange-500' :
            posture.recentTrend === 'MIXED' ? 'text-amber-500' : 'text-slate-500'
          }`}>
            {posture.recentTrend}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">RECURRING WEAKNESSES</div>
          <div className="text-xl font-bold text-white">{posture.recurringWeaknesses.length}</div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">NEEDS PRACTICE (DEFENSES)</div>
          <div className="text-xl font-bold text-orange-400">
            {posture.defenseCoverage.filter(d => d.status === 'NEEDS PRACTICE').length}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SEVERITY DISTRIBUTION</div>
          <div className="flex gap-3 text-xs">
            <div className="text-slate-400"><span className="text-red-400 font-bold">{posture.severityBreakdown.CRITICAL}</span> C</div>
            <div className="text-slate-400"><span className="text-orange-400 font-bold">{posture.severityBreakdown.HIGH}</span> H</div>
            <div className="text-slate-400"><span className="text-amber-400 font-bold">{posture.severityBreakdown.MEDIUM}</span> M</div>
            <div className="text-slate-400"><span className="text-blue-400 font-bold">{posture.severityBreakdown.LOW}</span> L</div>
          </div>
        </div>
      </div>
    </div>
  );
}
