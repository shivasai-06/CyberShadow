import { useCyberShadow } from '../../contexts/CyberShadowContext';
import { BookOpen } from 'lucide-react';

export function SecurityLearningImpactOverview() {
  const { securityLearningImpacts } = useCyberShadow();

  if (securityLearningImpacts.length === 0) return null;

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={16} className="text-teal-500" />
        <h2 className="text-[11px] font-bold text-teal-500 uppercase tracking-widest">SECURITY → LEARNING</h2>
      </div>
      <p className="text-sm text-slate-400 mb-2">
        Security simulations provide evidence that updates your learning path.
      </p>
      
      <div className="space-y-3">
        {securityLearningImpacts.slice(0, 5).map(impact => (
          <div key={impact.id} className="p-3 bg-slate-900/50 border border-slate-800/50 rounded flex items-center justify-between gap-4">
            <div className="flex flex-col min-w-0">
              <div className="text-sm font-medium text-slate-200 truncate">{impact.skillName}</div>
              <div className="text-xs text-slate-500 truncate">{impact.explanation}</div>
            </div>
            <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest whitespace-nowrap ${
              impact.learningState === 'DEMONSTRATED' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
              impact.learningState === 'DEVELOPING' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' :
              'bg-rose-950/40 text-rose-400 border border-rose-900/30'
            }`}>
              {impact.learningState}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
