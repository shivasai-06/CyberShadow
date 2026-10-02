import { ArrowRight, CheckCircle2, AlertCircle, ArrowDown } from 'lucide-react';
import type { EffectivenessComparison } from '../../types/remediation-effectiveness';
import { Panel } from '../ui/Panel';

function AttackPathDisplay({ path, outcome, isActive }: { path: string[], outcome: string, isActive: boolean }) {
  const isBlocked = outcome === 'ATTACK BLOCKED' || outcome === 'DATA RECOVERED';
  return (
    <div className={`p-4 rounded-lg border ${isActive ? 'bg-[#060a14] border-slate-700/80' : 'bg-slate-900/30 border-slate-800/50 opacity-80'}`}>
      <div className="flex flex-col gap-2">
        {path.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="bg-slate-800 px-3 py-1.5 rounded text-xs font-mono text-slate-300 w-full text-center border border-slate-700">
              {step}
            </div>
            {idx < path.length - 1 && (
              <ArrowDown size={14} className="text-slate-600 my-1" />
            )}
          </div>
        ))}
        <div className="flex justify-center mt-2">
          {isBlocked ? (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-widest border border-green-500/20">
              <CheckCircle2 size={12} />
              {outcome}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full uppercase tracking-widest border border-red-500/20">
              <AlertCircle size={12} />
              {outcome}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BeforeAfterResults({ comparison }: { comparison: EffectivenessComparison }) {
  if (!comparison) return null;

  const { before, after, control, outcome, explanation } = comparison;

  const isImproved = outcome === 'IMPROVED' || outcome === 'VALIDATED';
  const outcomeColor = isImproved ? 'text-green-400' : outcome === 'UNCHANGED' ? 'text-slate-400' : 'text-red-400';
  const outcomeBg = isImproved ? 'bg-green-500/10' : outcome === 'UNCHANGED' ? 'bg-slate-800/50' : 'bg-red-500/10';

  return (
    <Panel className="mt-6 border-violet-900/50 bg-[#060a14]/80 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
            DEFENSE VALIDATION
          </div>
          <h3 className="text-lg font-bold text-slate-100">Before & After Comparison</h3>
        </div>
        <div className={`px-4 py-2 rounded border ${outcomeColor} ${outcomeBg} border-current/20 flex items-center gap-2 font-bold text-sm tracking-wider uppercase`}>
          {isImproved ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {outcome.replace('_', ' ')}
        </div>
      </div>

      <p className="text-sm text-slate-300 mb-6">{explanation}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Connection line for desktop */}
        <div className="hidden md:flex absolute inset-y-0 left-1/2 -ml-3 items-center justify-center z-10 pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <ArrowRight size={12} className="text-slate-400" />
          </div>
        </div>

        {/* BEFORE STATE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">BEFORE</h4>
            <span className="text-[10px] text-slate-600 font-mono">Run: {before.runId.substring(0, 8)}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded bg-slate-900/50 border border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{control}</div>
            <div className={`text-xs font-bold ${before.relevantControlActive ? 'text-green-400' : 'text-red-400'}`}>
              {before.relevantControlActive ? 'ON' : 'OFF'}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Security Findings</span>
            <span className="font-bold text-amber-400">{before.findings.length} found</span>
          </div>

          {before.attackPath && before.attackPath.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Simulated Attack Path</div>
              <AttackPathDisplay path={before.attackPath} outcome={before.outcome} isActive={false} />
            </div>
          )}
        </div>

        {/* AFTER STATE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest">AFTER</h4>
            <span className="text-[10px] text-slate-600 font-mono">Run: {after.runId.substring(0, 8)}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-[#0b1120] border border-violet-900/30">
            <div className="text-xs font-bold text-white uppercase tracking-wider">{control}</div>
            <div className={`text-xs font-bold ${after.relevantControlActive ? 'text-green-400' : 'text-red-400'}`}>
              {after.relevantControlActive ? 'ON' : 'OFF'}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Security Findings</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${after.findings.length < before.findings.length ? 'text-green-400' : 'text-amber-400'}`}>
                {after.findings.length} found
              </span>
              {comparison.findingsRemoved > 0 && (
                <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                  -{comparison.findingsRemoved}
                </span>
              )}
            </div>
          </div>

          {after.attackPath && after.attackPath.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Simulated Attack Path</div>
              <AttackPathDisplay path={after.attackPath} outcome={after.outcome} isActive={true} />
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
