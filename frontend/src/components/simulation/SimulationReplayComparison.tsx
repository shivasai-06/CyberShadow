import { createReplayComparison } from '../../engine/replayEngine';
import type { HistoryRecord } from '../../types/history';
import { Panel } from '../ui/Panel';
import { CheckCircle2, AlertCircle, ArrowRightLeft } from 'lucide-react';

interface SimulationReplayComparisonProps {
  firstRun: HistoryRecord;
  replayRun: HistoryRecord;
}

export function SimulationReplayComparison({ firstRun, replayRun }: SimulationReplayComparisonProps) {
  const comparison = createReplayComparison(firstRun, replayRun);

  return (
    <div className="space-y-6">
      <Panel className="border-violet-900/50 bg-[#060a14] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest px-2 py-1 bg-violet-900/20 rounded border border-violet-900/50">
            REPLAY COMPARISON
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* FIRST RUN */}
          <div className="p-4 rounded-lg bg-[#0b1120] border border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">FIRST RUN</h3>
            <div className={`text-lg font-bold mb-4 ${firstRun.result.includes('BLOCKED') || firstRun.result.includes('RECOVERED') ? 'text-green-400' : 'text-red-400'}`}>
              {firstRun.result}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Risky Decisions</div>
                <div className="text-slate-300 font-bold">{firstRun.riskyDecisions || 0}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Impact</div>
                <div className={`font-bold ${firstRun.impactLevel === 'LOW' ? 'text-green-500' : firstRun.impactLevel === 'HIGH' || firstRun.impactLevel === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>
                  {firstRun.impactLevel || 'NONE'}
                </div>
              </div>
            </div>
          </div>

          {/* REPLAY */}
          <div className="p-4 rounded-lg bg-[#0b1120] border border-violet-900/30">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">REPLAY</h3>
            <div className={`text-lg font-bold mb-4 ${replayRun.result.includes('BLOCKED') || replayRun.result.includes('RECOVERED') ? 'text-green-400' : 'text-red-400'}`}>
              {replayRun.result}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Protective Decisions</div>
                <div className="text-slate-300 font-bold">{replayRun.protectiveDecisions || 0}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Impact</div>
                <div className={`font-bold ${replayRun.impactLevel === 'LOW' ? 'text-green-500' : replayRun.impactLevel === 'HIGH' || replayRun.impactLevel === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>
                  {replayRun.impactLevel || 'NONE'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">WHAT CHANGED?</h3>
        
        <div className="space-y-4">
          {comparison.decisionDifferences.map((diff, idx) => (
            <div key={idx} className="p-4 rounded bg-[#0a0f1c] border border-slate-800">
              <div className="text-sm text-slate-400 mb-3">{diff.situation}</div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 p-3 rounded bg-slate-900/50 border border-slate-800 flex items-start gap-3">
                  {diff.firstRunProtective ? <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" /> : <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />}
                  <div className="text-xs text-slate-300">{diff.firstRunLabel}</div>
                </div>
                
                {diff.isDifferent ? (
                  <ArrowRightLeft size={16} className="text-violet-500 shrink-0 hidden md:block" />
                ) : (
                  <div className="text-[10px] font-bold text-slate-600 tracking-widest uppercase hidden md:block">SAME</div>
                )}
                
                <div className={`flex-1 p-3 rounded flex items-start gap-3 border ${diff.isDifferent ? 'bg-violet-950/10 border-violet-900/30' : 'bg-slate-900/50 border-slate-800'}`}>
                  {diff.replayProtective ? <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" /> : <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />}
                  <div className={`text-xs ${diff.isDifferent ? 'text-white font-medium' : 'text-slate-300'}`}>{diff.replayLabel}</div>
                </div>
              </div>
            </div>
          ))}
          {comparison.decisionDifferences.length === 0 && (
            <div className="text-sm text-slate-500 italic">No interactive decisions were made in these runs.</div>
          )}
        </div>
      </Panel>
    </div>
  );
}
