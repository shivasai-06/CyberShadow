import { Panel } from '../ui/Panel';
import { Target, TrendingUp } from 'lucide-react';
import type { PracticeRecommendation, LearningProfile } from '../../types/learning';

interface CurrentFocusProps {
  recommendation: PracticeRecommendation;
  profile: LearningProfile;
}

function getMasteryLabel(mastery: number): string {
  if (mastery < 20) return 'INTRODUCED';
  if (mastery < 40) return 'DEVELOPING';
  if (mastery < 60) return 'PRACTICING';
  if (mastery < 80) return 'CONFIDENT';
  return 'STRONG';
}

export function CurrentFocus({ recommendation, profile }: CurrentFocusProps) {
  const skill = profile.skills[recommendation.targetSkillId];
  if (!skill) return null;

  const masteryLabel = getMasteryLabel(skill.mastery);
  
  return (
    <Panel className="bg-[#060a14] border-violet-900/40 p-6 relative overflow-hidden h-full">
      <div className="absolute -right-4 -top-4 p-8 opacity-5 pointer-events-none text-violet-500">
        <Target size={120} />
      </div>
      
      <h2 className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <Target size={14} /> CURRENT FOCUS
      </h2>
      
      <div className="space-y-6 relative z-10">
        <div>
          <div className="text-2xl font-bold text-white mb-2">{skill.name}</div>
          <div className="text-sm text-slate-400">{skill.category}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#0b1120] border border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SIMULATED MASTERY</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-mono text-cyan-400">{Math.round(skill.mastery)}</span>
              <span className="text-sm text-slate-500 mb-1">/ 100</span>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-[#0b1120] border border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">STATUS</div>
            <div className={`text-sm font-bold uppercase tracking-wider ${
              masteryLabel === 'STRONG' || masteryLabel === 'CONFIDENT' ? 'text-green-400' :
              masteryLabel === 'PRACTICING' ? 'text-amber-400' : 'text-slate-300'
            }`}>
              {masteryLabel}
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded bg-violet-950/20 border border-violet-900/30">
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <TrendingUp size={12} /> RECOMMENDED BECAUSE
          </div>
          <p className="text-sm text-violet-200/80 leading-relaxed">
            {recommendation.reason}
          </p>
        </div>
      </div>
    </Panel>
  );
}
