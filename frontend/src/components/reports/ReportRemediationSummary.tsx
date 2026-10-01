import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Target } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import type { RemediationAction } from '../../types/security-remediation';

interface ReportRemediationSummaryProps {
  remediations: RemediationAction[];
}

export function ReportRemediationSummary({ remediations }: ReportRemediationSummaryProps) {
  const navigate = useNavigate();

  const validated = remediations.filter(r => r.status === 'VALIDATED');
  const open = remediations.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS');

  return (
    <Panel className="bg-[#0b1120] border-slate-800/80 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
            <Target size={14} className="text-cyan-500" /> SIMULATED REMEDIATION OUTCOMES
          </h2>
          <p className="text-sm text-slate-300">Analysis of your validated defenses.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/security/remediation')}>
          View Action Items
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#060a14] border border-slate-800 rounded p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">VALIDATED DEFENSES</div>
            <div className="text-2xl font-light text-green-400">{validated.length}</div>
          </div>
          <ShieldCheck size={32} className="text-green-500/20" />
        </div>
        <div className="bg-[#060a14] border border-slate-800 rounded p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">PENDING ACTIONS</div>
            <div className="text-2xl font-light text-orange-400">{open.length}</div>
          </div>
          <Target size={32} className="text-orange-500/20" />
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-4">LATEST VALIDATIONS</h3>
        {validated.length === 0 ? (
          <div className="text-sm text-slate-500 italic p-4 border border-dashed border-slate-800 rounded text-center">
            No defenses have been validated yet.
          </div>
        ) : (
          <div className="space-y-3">
            {[...validated].reverse().slice(0, 3).map(rem => (
              <div key={rem.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <div>
                  <div className="text-sm font-semibold text-white mb-1">{rem.title}</div>
                  <div className="text-xs text-slate-400">Addressed: {rem.findingTitle}</div>
                </div>
                <div className="mt-2 sm:mt-0 text-left sm:text-right">
                  <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded inline-block">
                    VALIDATED
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
