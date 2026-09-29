import type { AttackPathInsight } from '../../types/reports';
import { ArrowDown } from 'lucide-react';

interface AttackPathAnalysisProps {
  paths: AttackPathInsight[];
}

export function AttackPathAnalysis({ paths }: AttackPathAnalysisProps) {
  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">ATTACK PATH ANALYSIS</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paths.map(insight => (
          <div key={insight.id} className="bg-[#060a14] border border-slate-800 rounded-lg p-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
              {insight.scenarioName} PATH
            </h4>
            
            <div className="flex flex-col items-center">
              {insight.path.map((node, idx) => {
                const isBlockedNode = node === insight.blockedAt;
                
                return (
                  <div key={idx} className="flex flex-col items-center w-full">
                    <div className={`px-4 py-2 border rounded text-[10px] font-bold tracking-wide uppercase w-full max-w-[200px] text-center ${
                      isBlockedNode 
                        ? 'bg-green-950/30 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                        : 'bg-[#0b1120] border-slate-700 text-slate-300'
                    }`}>
                      {node}
                    </div>
                    {idx < insight.path.length - 1 && (
                      <ArrowDown size={14} className="my-3 text-slate-700" />
                    )}
                    {isBlockedNode && (
                      <>
                        <ArrowDown size={14} className="my-3 text-green-500/50" />
                        <div className="px-4 py-2 bg-green-950/20 border border-green-900/50 rounded text-[10px] font-bold tracking-wide uppercase text-green-500 w-full max-w-[200px] text-center">
                          BLOCKED
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
