import { Target, TrendingUp, ShieldCheck } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { useCyberShadow } from '../../contexts/CyberShadowContext';

export function ReportEffectivenessSummary() {
  const { effectivenessComparisons } = useCyberShadow();

  if (effectivenessComparisons.length === 0) {
    return null;
  }

  const improvedCount = effectivenessComparisons.filter(c => c.outcome === 'IMPROVED').length;
  const validatedCount = effectivenessComparisons.filter(c => c.outcome === 'VALIDATED').length;
  const totalFindingsRemoved = effectivenessComparisons.reduce((sum, c) => sum + c.findingsRemoved, 0);

  return (
    <Panel className="bg-[#0b1120] border-slate-800/80 p-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
            <Target size={14} className="text-cyan-500" /> REMEDIATION EFFECTIVENESS SUMMARY
          </h2>
          <p className="text-sm text-slate-400">
            Factual measurement of improvements observed across validated simulations.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded">
          <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">SIMULATION ONLY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#060a14] border border-slate-800 rounded p-6 text-center">
          <ShieldCheck size={24} className="text-cyan-500 mx-auto mb-3" />
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL VALIDATED</div>
          <div className="text-4xl font-light text-cyan-400">{validatedCount}</div>
        </div>
        
        <div className="bg-[#060a14] border border-slate-800 rounded p-6 text-center">
          <TrendingUp size={24} className="text-green-500 mx-auto mb-3" />
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL IMPROVED</div>
          <div className="text-4xl font-light text-green-400">{improvedCount}</div>
        </div>

        <div className="bg-[#060a14] border border-slate-800 rounded p-6 text-center">
          <Target size={24} className="text-violet-500 mx-auto mb-3" />
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">FINDINGS RESOLVED</div>
          <div className="text-4xl font-light text-violet-400">{totalFindingsRemoved}</div>
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">RECENT COMPARISONS</h3>
        <div className="space-y-3">
          {effectivenessComparisons.slice(-3).reverse().map(c => (
            <div key={c.remediationId} className="flex flex-col md:flex-row justify-between p-4 bg-slate-900/50 border border-slate-800 rounded gap-4">
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-200 mb-1">{c.control}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{c.scenarioId.replace('sc_', '')}</div>
              </div>
              <div className="flex-1 flex flex-col items-start md:items-center justify-center">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-orange-400 font-mono">{c.before.outcome}</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-green-400 font-mono">{c.after.outcome}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-start md:items-end justify-center">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                  c.outcome === 'IMPROVED' ? 'bg-green-950/50 text-green-500 border border-green-900/30' :
                  c.outcome === 'VALIDATED' ? 'bg-cyan-950/50 text-cyan-500 border border-cyan-900/30' :
                  'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {c.outcome.replace('_', ' ')}
                </span>
                {c.findingsRemoved > 0 && (
                  <span className="text-[10px] text-violet-400 mt-1">-{c.findingsRemoved} finding(s)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
