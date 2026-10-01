import { useCyberShadow } from '../../contexts/CyberShadowContext';

export function ReportLearningImpactSummary() {
  const { securityLearningImpacts } = useCyberShadow();

  if (securityLearningImpacts.length === 0) return null;

  const demonstrated = securityLearningImpacts.filter(i => i.learningState === 'DEMONSTRATED');
  const developing = securityLearningImpacts.filter(i => i.learningState === 'DEVELOPING');
  const reinforce = securityLearningImpacts.filter(i => i.learningState === 'REINFORCE');

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">LEARNING IMPACT SUMMARY</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#060a14] border border-slate-800 rounded p-4 text-center">
            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Demonstrated</div>
            <div className="text-3xl text-emerald-500 font-light">{demonstrated.length}</div>
          </div>
          <div className="bg-[#060a14] border border-slate-800 rounded p-4 text-center">
            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Developing</div>
            <div className="text-3xl text-amber-500 font-light">{developing.length}</div>
          </div>
          <div className="bg-[#060a14] border border-slate-800 rounded p-4 text-center">
            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Needs Reinforcement</div>
            <div className="text-3xl text-rose-500 font-light">{reinforce.length}</div>
          </div>
        </div>

        <div className="space-y-3">
          {securityLearningImpacts.slice(0, 8).map(impact => (
            <div key={impact.id} className="p-3 bg-slate-900/30 border border-slate-800 rounded flex justify-between items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-slate-200 font-medium mb-1">{impact.skillName}</div>
                <div className="text-xs text-slate-400">{impact.explanation}</div>
              </div>
              <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border whitespace-nowrap ${
                impact.learningState === 'DEMONSTRATED' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' :
                impact.learningState === 'DEVELOPING' ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' :
                'bg-rose-950/40 text-rose-400 border-rose-900/30'
              }`}>
                {impact.learningState}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
