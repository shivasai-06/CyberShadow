import type { LearningObjective } from '../../types/scenarios';

interface ScenarioLearningProps {
  objectives: LearningObjective[];
}

export function ScenarioLearning({ objectives }: ScenarioLearningProps) {
  return (
    <div>
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">LEARNING OBJECTIVES</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {objectives.map((obj, i) => (
          <div key={obj.id} className="bg-[#060a14] p-4 rounded-lg border border-violet-900/30 border-t-violet-500/50">
            <div className="text-[10px] font-mono text-violet-400 mb-2">0{i + 1}</div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wide mb-2">{obj.title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">{obj.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
