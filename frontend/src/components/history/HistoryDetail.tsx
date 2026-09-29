import type { HistoryRecord } from '../../types/history';
import { Button } from '../ui/Button';
import { ArrowLeft, Play, ArrowDown, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HistoryDetailProps {
  record: HistoryRecord;
  onBack: () => void;
}

export function HistoryDetail({ record, onBack }: HistoryDetailProps) {
  const navigate = useNavigate();
  const isBlocked = record.result === 'ATTACK BLOCKED';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" onClick={onBack} className="px-2 py-1 gap-2 text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> BACK TO HISTORY
        </Button>
      </div>

      <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className={`p-8 md:p-10 border-b border-slate-800/80 relative ${
          isBlocked ? 'bg-gradient-to-br from-[#0b1120] to-green-950/20' : 'bg-gradient-to-br from-[#0b1120] to-red-950/20'
        }`}>
          <div className={`absolute right-0 top-0 p-10 opacity-5 pointer-events-none ${isBlocked ? 'text-green-500' : 'text-red-500'}`}>
            {isBlocked ? <ShieldCheck size={200} /> : <ShieldAlert size={200} />}
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SIMULATION SUMMARY</div>
              <h2 className="text-3xl font-bold text-white tracking-wide mb-4">{record.scenarioName}</h2>
              
              <div className="flex flex-wrap gap-6 text-xs mb-8">
                <div>
                  <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px] mr-2">DATE</span>
                  <span className="text-slate-300 font-mono">{new Date(record.date).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px] mr-2">DURATION</span>
                  <span className="text-slate-300 font-mono">{record.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px] mr-2">DIFFICULTY</span>
                  <span className="text-slate-300 font-mono">{record.difficulty}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="primary" onClick={() => navigate('/simulation')} className="gap-2 px-6">
                  <Play size={14} fill="currentColor" /> RUN THIS SCENARIO AGAIN
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[200px]">
              <div className={`p-5 rounded-lg border ${isBlocked ? 'bg-green-950/30 border-green-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">RESULT</div>
                <div className={`text-sm font-bold tracking-wider ${isBlocked ? 'text-green-400' : 'text-red-400'}`}>{record.result}</div>
              </div>
              
              <div className="p-5 rounded-lg bg-[#060a14] border border-slate-800">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">SIMULATED RISK</div>
                <div className={`text-sm font-bold tracking-wider ${
                  record.risk === 'LOW' ? 'text-green-400' :
                  record.risk === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
                }`}>{record.risk}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">WHAT HAPPENED</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-[#060a14] p-5 rounded-lg border border-slate-800">
                {record.explanation}
              </p>
            </section>
            
            <section>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">WHAT YOU LEARNED</h4>
              <div className="space-y-3">
                {record.learningPoints.map((point, i) => (
                  <div key={i} className="flex gap-3 bg-[#060a14] p-4 rounded-lg border border-violet-900/30 border-l-2 border-l-violet-500">
                    <span className="text-[10px] font-mono text-violet-400 mt-0.5">0{i + 1}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">DEFENSE CONFIGURATION</h4>
              <div className="flex flex-wrap gap-2">
                {record.defensesActive.map((defense, i) => (
                  <span key={i} className={`px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-widest ${
                    defense.includes('ENABLED') ? 'bg-cyan-950/30 border-cyan-900/50 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}>
                    {defense}
                  </span>
                ))}
              </div>
              <p className="text-[9px] text-amber-500/70 font-mono tracking-widest uppercase mt-4">
                SIMULATION CONTROLS ONLY. Does NOT modify real systems.
              </p>
            </section>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">ATTACK PATH</h4>
            <div className="bg-[#060a14] p-6 rounded-lg border border-slate-800 flex flex-col items-center">
              {record.attackPath.map((node, idx) => {
                const isFinal = idx === record.attackPath.length - 1;
                let nodeStyle = "bg-[#0b1120] border-slate-700 text-slate-300";
                
                if (isFinal) {
                  nodeStyle = isBlocked 
                    ? "bg-green-950/30 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                    : "bg-red-950/30 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
                } else if (idx < record.completedSteps - 1) {
                  nodeStyle = "bg-cyan-950/10 border-slate-600 text-slate-400";
                }

                return (
                  <div key={idx} className="flex flex-col items-center w-full">
                    <div className={`px-4 py-3 border rounded text-[10px] font-bold tracking-wide uppercase w-full max-w-[220px] text-center transition-colors ${nodeStyle}`}>
                      {node}
                    </div>
                    {!isFinal && (
                      <ArrowDown size={14} className="my-2 text-slate-700" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
