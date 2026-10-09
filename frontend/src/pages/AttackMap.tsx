import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ArrowDown, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { Button } from '../components/ui/Button';

export function AttackMap() {
  const navigate = useNavigate();
  const { history } = useCyberShadow();

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Fallback to first if selected doesn't exist (e.g. history cleared)
  const displayRecord = history.find(r => r.id === selectedRecordId) || history[0];

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      <PageHeader
        title="Attack Map"
        description="Visualize potential simulated attack paths and defense effectiveness."
      />

      <Panel className="min-h-[700px] bg-[#0b1120] relative overflow-hidden flex flex-col items-center justify-start border-slate-800/80 p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVMMDAgMzkuNXoiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTM5LjUgMEwzOS41IDQweiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-20" />

        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pr-4">
          {displayRecord && (
            <StatusBadge
              status={
                displayRecord.result === 'ATTACK BLOCKED' ? 'success' :
                displayRecord.result === 'DATA RECOVERED' ? 'info' :
                (displayRecord.result === 'SIMULATED COMPROMISE' || displayRecord.result === 'DATA LOSS') ? 'danger' :
                'warning'
              }
              label={displayRecord.result || 'UNKNOWN'}
            />
          )}
        </div>

        {history.length > 0 && (
          <div className="absolute top-4 right-4 z-20">
            <select
              className="bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              value={displayRecord?.id || ''}
              onChange={(e) => setSelectedRecordId(e.target.value)}
            >
              {history.map((record) => (
                <option key={record.id} value={record.id}>
                  {new Date(record.date).toLocaleDateString()} - {record.scenarioName} ({record.result})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mt-12 pb-16">
          {!displayRecord ? (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-[#0b1120] rounded-lg border border-slate-800/80 max-w-md w-full my-auto mt-20">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                 <ArrowDown className="text-slate-600 h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2">NO ATTACK DATA</h3>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                Run a fictional simulation to generate an attack path map. The map will visualize the exact path taken by the simulated threat and where it was stopped.
              </p>
              <Button variant="primary" onClick={() => navigate('/simulation')} className="text-xs uppercase tracking-widest gap-2">
                <Play size={14} fill="currentColor" /> START SIMULATION
              </Button>
            </div>
          ) : (
            <>
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-8">
                Simulation Details: {displayRecord.scenarioName}
              </div>

              <div className="px-6 py-3 rounded-lg border border-red-500/50 bg-red-950/30 text-red-400 font-bold tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.1)] text-center w-48">
                Attacker Entry
              </div>

              {displayRecord.attackPath.map((step, index) => {
                const isBlockedStep = displayRecord.blockedAtStep === step;
                const isLast = index === displayRecord.attackPath.length - 1;

                let boxClass = "px-6 py-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-400 text-center w-64";

                if (isBlockedStep) {
                  boxClass = "px-6 py-3 rounded-lg border border-green-500/50 bg-green-950/30 text-green-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.15)] text-center w-64";
                } else if (isLast && (displayRecord.result === 'SIMULATED COMPROMISE' || displayRecord.result === 'DATA LOSS')) {
                  boxClass = "px-6 py-3 rounded-lg border border-red-500/50 bg-red-950/30 text-red-400 font-bold shadow-[0_0_15px_rgba(239,68,68,0.15)] text-center w-64";
                } else if (index < displayRecord.attackPath.length - 1) {
                  boxClass = "px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 text-center w-64";
                }

                return (
                  <div key={index} className="flex flex-col items-center">
                    <ArrowDown className="text-slate-600 my-4 h-8" />
                    <div className={boxClass}>
                      {step}
                    </div>
                  </div>
                );
              })}

              <ArrowDown className="text-slate-600 my-4 h-8" />

              <div className={`px-6 py-3 rounded-lg border font-bold uppercase tracking-widest shadow-lg text-center w-48 ${
                displayRecord.result === 'ATTACK BLOCKED' ? 'border-green-500/50 bg-green-950/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]' :
                displayRecord.result === 'DATA RECOVERED' ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' :
                (displayRecord.result === 'SIMULATED COMPROMISE' || displayRecord.result === 'DATA LOSS') ? 'border-red-500/50 bg-red-950/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]' :
                'border-amber-500/50 bg-amber-950/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
              }`}>
                {displayRecord.result || 'UNKNOWN'}
              </div>
            </>
          )}
        </div>
      </Panel>
    </div>
  );
}
