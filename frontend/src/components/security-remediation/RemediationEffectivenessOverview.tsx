import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, Minus, XCircle } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { useCyberShadow } from '../../contexts/CyberShadowContext';

export function RemediationEffectivenessOverview() {
  const navigate = useNavigate();
  const { effectivenessComparisons } = useCyberShadow();

  if (effectivenessComparisons.length === 0) {
    return null; // Only show if there's data
  }

  const improvedCount = effectivenessComparisons.filter(c => c.outcome === 'IMPROVED').length;
  const validatedCount = effectivenessComparisons.filter(c => c.outcome === 'VALIDATED').length;
  const unchangedCount = effectivenessComparisons.filter(c => c.outcome === 'UNCHANGED').length;
  const notValidatedCount = effectivenessComparisons.filter(c => c.outcome === 'NOT_VALIDATED').length;

  const latest = effectivenessComparisons[effectivenessComparisons.length - 1];

  return (
    <Panel className="bg-[#0b1120] border-slate-800/80 p-6 mt-6 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
            <Target size={14} className="text-cyan-500" /> REMEDIATION EFFECTIVENESS
          </h2>
          <p className="text-sm text-slate-300">
            Factual summary of simulation improvements based on your validated actions.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/security/remediation')} className="border-cyan-900/50 text-cyan-400 hover:bg-cyan-950/20">
          View Comparisons
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#060a14] border border-slate-800 rounded p-4 flex flex-col items-center text-center">
          <TrendingUp size={20} className="text-green-500 mb-2" />
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">IMPROVED</div>
          <div className="text-2xl font-light text-green-400">{improvedCount}</div>
        </div>
        <div className="bg-[#060a14] border border-slate-800 rounded p-4 flex flex-col items-center text-center">
          <Target size={20} className="text-cyan-500 mb-2" />
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">VALIDATED</div>
          <div className="text-2xl font-light text-cyan-400">{validatedCount}</div>
        </div>
        <div className="bg-[#060a14] border border-slate-800 rounded p-4 flex flex-col items-center text-center">
          <Minus size={20} className="text-slate-500 mb-2" />
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">UNCHANGED</div>
          <div className="text-2xl font-light text-slate-400">{unchangedCount}</div>
        </div>
        <div className="bg-[#060a14] border border-slate-800 rounded p-4 flex flex-col items-center text-center">
          <XCircle size={20} className="text-orange-500 mb-2" />
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">NOT VALIDATED</div>
          <div className="text-2xl font-light text-orange-400">{notValidatedCount}</div>
        </div>
      </div>

      {latest && (
        <div className="bg-slate-900/50 border border-slate-800 rounded p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">LATEST VALIDATION</div>
            <div className="text-sm font-semibold text-slate-200">{latest.scenarioId.replace('sc_', '').toUpperCase()} PROTECTION</div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-orange-400">BEFORE: {latest.before.outcome}</span>
            <span className="text-slate-600 font-bold">→</span>
            <span className="text-green-400">AFTER: {latest.after.outcome}</span>
          </div>
        </div>
      )}
    </Panel>
  );
}
