import type { LearningProgressMetrics } from '../../types/history';

interface LearningProgressProps {
  metrics: LearningProgressMetrics;
}

export function LearningProgress({ metrics }: LearningProgressProps) {
  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6 h-full">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">LEARNING PROGRESS</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#060a14] p-4 rounded border border-slate-800 text-center">
          <div className="text-2xl font-bold text-cyan-400 mb-1">{metrics.simulationsCompleted}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SIMULATIONS</div>
        </div>
        <div className="bg-[#060a14] p-4 rounded border border-slate-800 text-center">
          <div className="text-2xl font-bold text-violet-400 mb-1">{metrics.learningObjectivesCompleted}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">OBJECTIVES</div>
        </div>
        <div className="bg-[#060a14] p-4 rounded border border-slate-800 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{metrics.attacksBlocked}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">BLOCKED</div>
        </div>
        <div className="bg-[#060a14] p-4 rounded border border-slate-800 text-center">
          <div className="text-2xl font-bold text-slate-300 mb-1">{metrics.scenariosExplored}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SCENARIOS</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">CATEGORY MASTERY</h4>
        
        {metrics.categoryProgress.map((cp, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest">
              <span className="text-slate-400">{cp.category}</span>
              <span className="text-cyan-500">{cp.percentage}%</span>
            </div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 rounded-full"
                style={{ width: `${cp.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
