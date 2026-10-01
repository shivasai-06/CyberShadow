import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useCyberShadow } from '../../contexts/CyberShadowContext';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';

export function RemediationStatusOverview() {
  const navigate = useNavigate();
  const { remediations } = useCyberShadow();

  const openCount = remediations.filter(r => r.status === 'OPEN').length;
  const inProgressCount = remediations.filter(r => r.status === 'IN_PROGRESS').length;
  const validatedCount = remediations.filter(r => r.status === 'VALIDATED').length;

  const nextRemediation = [...remediations].reverse().find(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS');

  return (
    <div className="mt-12 mb-12 border-t border-slate-800/80 pt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <ShieldAlert size={12} /> REMEDIATION STATUS
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Simulated Remediation Actions</h2>
          <p className="text-sm text-slate-400">
            Action items to practice based on your simulated vulnerabilities.
          </p>
        </div>
        <Button variant="secondary" className="border-orange-900/50 text-orange-400 hover:bg-orange-950/20" onClick={() => navigate('/security/remediation')}>
          Go to Remediation Center
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Panel className="bg-[#0b1120] border-slate-800/80 p-5 flex flex-col justify-center items-center">
          <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">Open</div>
          <div className="text-4xl font-light text-orange-400">{openCount}</div>
        </Panel>
        <Panel className="bg-[#0b1120] border-slate-800/80 p-5 flex flex-col justify-center items-center">
          <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">In Progress</div>
          <div className="text-4xl font-light text-amber-400">{inProgressCount}</div>
        </Panel>
        <Panel className="bg-[#0b1120] border-slate-800/80 p-5 flex flex-col justify-center items-center">
          <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">Validated</div>
          <div className="text-4xl font-light text-green-400">{validatedCount}</div>
        </Panel>

        <Panel className="bg-[#0b1120] border-slate-800/80 p-5 relative overflow-hidden flex flex-col justify-center">
          <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-3">Next Action</div>
          {nextRemediation ? (
            <div className="z-10">
              <h3 className="text-sm font-bold text-white mb-1 truncate">{nextRemediation.title}</h3>
              <p className="text-xs text-slate-400 truncate mb-3">Fixes: {nextRemediation.findingTitle}</p>
              <Button size="sm" variant="ghost" className="h-6 text-[10px] text-cyan-400 p-0 hover:bg-transparent hover:text-cyan-300 gap-1" onClick={() => navigate('/security/remediation')}>
                View Details <ArrowRight size={10} />
              </Button>
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic">No pending actions.<br/>Excellent simulation posture.</div>
          )}
        </Panel>
      </div>
    </div>
  );
}
