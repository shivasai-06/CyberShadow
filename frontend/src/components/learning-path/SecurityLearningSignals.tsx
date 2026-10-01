import { useCyberShadow } from '../../contexts/CyberShadowContext';

export function SecurityLearningSignals() {
  const { securityLearningImpacts } = useCyberShadow();

  if (securityLearningImpacts.length === 0) {
    return (
      <div className="p-6 bg-[#0b1120] border border-slate-800 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Security-Driven Learning</h2>
        <div className="text-slate-400 text-sm italic">
          No security-driven learning signals yet. Complete simulations and validation runs to see learning impacts.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0b1120] border border-slate-800 rounded-lg">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Security-Driven Learning</h2>
      <div className="space-y-4">
        {securityLearningImpacts.map(impact => (
          <div key={impact.id} className="p-4 bg-slate-900/50 border border-slate-800/50 rounded flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">{impact.skillName}</span>
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                impact.learningState === 'DEMONSTRATED' ? 'bg-emerald-500/10 text-emerald-400' :
                impact.learningState === 'DEVELOPING' ? 'bg-amber-500/10 text-amber-400' :
                'bg-rose-500/10 text-rose-400'
              }`}>
                {impact.learningState}
              </span>
            </div>
            <p className="text-sm text-slate-400">{impact.explanation}</p>
            <p className="text-xs text-slate-500 mt-2">
              <span className="font-semibold text-slate-400">Recommendation:</span> {impact.recommendedAction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
