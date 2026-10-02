import { ShieldAlert, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import type { ComprehensiveSimulationResult } from '../../types/results';
import { Panel } from '../ui/Panel';

function MiniAttackPath({ path, outcome }: { path: string[], outcome: string }) {
  if (!path || path.length === 0) return null;
  const isBlocked = outcome === 'ATTACK BLOCKED' || outcome === 'DATA RECOVERED';
  
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {path.map((step, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="bg-slate-800/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-700">
            {step}
          </div>
          {idx < path.length - 1 && <ArrowRight size={12} className="text-slate-600" />}
        </div>
      ))}
      <ArrowRight size={12} className="text-slate-600" />
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border ${isBlocked ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
        {isBlocked ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
        {outcome}
      </div>
    </div>
  );
}

export function VisualResults({ result }: { result: ComprehensiveSimulationResult | null }) {
  if (!result) return null;

  const isBlocked = result.outcome === 'ATTACK BLOCKED' || result.outcome === 'DATA RECOVERED';
  const outcomeColor = isBlocked ? 'text-green-400' : 'text-red-400';
  const outcomeBg = isBlocked ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30';
  
  const findings = result.analysis.findings;
  
  const severityCounts = {
    CRITICAL: findings.filter(f => f.severity === 'CRITICAL').length,
    HIGH: findings.filter(f => f.severity === 'HIGH').length,
    MEDIUM: findings.filter(f => f.severity === 'MEDIUM').length,
    LOW: findings.filter(f => f.severity === 'LOW').length,
  };
  
  const totalFindings = findings.length;

  return (
    <Panel className="border-slate-700 bg-[#060a14] mb-8">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert size={16} className="text-cyan-500" />
          Simulation Visuals
        </h2>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* OUTCOME */}
        <div className={`col-span-1 md:col-span-3 p-6 rounded-lg border ${outcomeBg} flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">FINAL OUTCOME</div>
            <div className={`text-2xl font-black tracking-wider ${outcomeColor}`}>
              {result.outcome}
            </div>
          </div>
          
          <div className="flex-1 md:ml-8">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ATTACK PATH</div>
            <MiniAttackPath path={result.record.attackPath} outcome={result.outcome} />
          </div>
        </div>

        {/* FINDINGS BY SEVERITY */}
        <div className="col-span-1 p-5 rounded-lg border border-slate-800 bg-slate-900/50">
          <div className="flex justify-between items-end mb-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">FINDINGS</div>
            <div className="text-xl font-black text-white">{totalFindings}</div>
          </div>
          
          {totalFindings > 0 ? (
            <div className="space-y-3">
              {Object.entries(severityCounts).map(([sev, count]) => {
                const colors: Record<string, string> = {
                  CRITICAL: 'bg-red-500', HIGH: 'bg-orange-500', MEDIUM: 'bg-amber-500', LOW: 'bg-blue-500'
                };
                const percentage = Math.round((count / totalFindings) * 100);
                return (
                  <div key={sev}>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>{sev}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[sev]}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500">
              <CheckCircle2 size={24} className="text-green-500 mb-2 opacity-50" />
              <div className="text-xs">No vulnerabilities found.</div>
            </div>
          )}
        </div>

        {/* SECURITY POSTURE */}
        <div className="col-span-1 md:col-span-2 p-5 rounded-lg border border-slate-800 bg-slate-900/50">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">ACTIVE DEFENSES (THIS RUN)</div>
          
          {result.record.defensesActive.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.record.defensesActive.map(defense => (
                <div key={defense} className="px-3 py-1.5 rounded bg-[#0b1120] border border-cyan-900/50 text-cyan-400 text-xs font-medium">
                  {defense}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic">No defenses were active or utilized.</div>
          )}

          {/* COMPACT BEFORE/AFTER */}
          {result.remediationEffectiveness && (
            <div className="mt-6 pt-5 border-t border-slate-800/80">
               <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-3">REMEDIATION EFFECTIVENESS</div>
               <div className="flex items-center gap-4">
                 <div className="flex-1 p-3 rounded bg-[#060a14] border border-slate-800 flex items-center justify-between">
                   <span className="text-xs text-slate-400">Before</span>
                   <span className={`text-xs font-bold ${result.remediationEffectiveness.before.findings.length > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                     {result.remediationEffectiveness.before.findings.length} findings
                   </span>
                 </div>
                 <ArrowRight size={14} className="text-slate-600 shrink-0 hidden md:block" />
                 <div className="flex-1 p-3 rounded bg-[#060a14] border border-slate-800 flex items-center justify-between">
                   <span className="text-xs text-slate-400">After</span>
                   <span className={`text-xs font-bold ${result.remediationEffectiveness.after.findings.length < result.remediationEffectiveness.before.findings.length ? 'text-green-500' : 'text-slate-300'}`}>
                     {result.remediationEffectiveness.after.findings.length} findings
                   </span>
                 </div>
                 <div className={`shrink-0 px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-widest hidden md:block ${result.remediationEffectiveness.outcome === 'IMPROVED' || result.remediationEffectiveness.outcome === 'VALIDATED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                   {result.remediationEffectiveness.outcome.replace('_', ' ')}
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
