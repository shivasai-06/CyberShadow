import { Activity, ShieldAlert, BookOpen, AlertTriangle } from 'lucide-react';
import type { SecurityFindingInvestigation } from '../../types/security-investigation';

interface FindingInvestigationProps {
  investigation: SecurityFindingInvestigation;
}

export function FindingInvestigation({ investigation }: FindingInvestigationProps) {
  const { finding } = investigation;

  const severityColor = 
    finding.severity === 'CRITICAL' ? 'text-red-500 border-red-500/30 bg-red-950/20' :
    finding.severity === 'HIGH' ? 'text-orange-500 border-orange-500/30 bg-orange-950/20' :
    finding.severity === 'MEDIUM' ? 'text-amber-500 border-amber-500/30 bg-amber-950/20' :
    'text-blue-500 border-blue-500/30 bg-blue-950/20';

  return (
    <div className="border border-slate-800/80 bg-[#060a14] rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`px-5 py-4 border-b ${severityColor} flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <AlertTriangle size={18} />
          <h3 className="font-bold tracking-wide uppercase">{finding.title}</h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
          <span className="opacity-80">{finding.affectedAsset}</span>
          <span className="px-2 py-1 rounded bg-black/40 border border-current">{finding.severity}</span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={14} className="text-slate-400" />
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">What Happened</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{investigation.whatHappened}</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={14} className="text-slate-400" />
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Why It Happened</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{investigation.whyItHappened}</p>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-red-400" />
            <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Simulated Impact</h4>
          </div>
          <p className="text-sm text-red-100/80 leading-relaxed bg-red-950/20 border border-red-900/30 p-4 rounded">{investigation.impact}</p>
        </div>

        <div className="border-t border-slate-800/50 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={14} className="text-cyan-400" />
              <h4 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Defense</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{investigation.defense}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-violet-400" />
              <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Why It Matters</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{investigation.whyItMatters}</p>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0f1c] p-4 rounded border border-slate-800/80">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">LEARNING CONNECTION</div>
              <div className="text-sm font-bold text-white">{investigation.learningConnection}</div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">RECOMMENDED PRACTICE</div>
              <div className="text-sm text-cyan-400 font-medium">{investigation.recommendedPractice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
