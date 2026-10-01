import { Panel } from '../ui/Panel';
import type { LearningProfile } from '../../types/learning';

interface SkillProgressGridProps {
  profile: LearningProfile;
}

function getMasteryLabel(mastery: number): string {
  if (mastery < 20) return 'INTRODUCED';
  if (mastery < 40) return 'DEVELOPING';
  if (mastery < 60) return 'PRACTICING';
  if (mastery < 80) return 'CONFIDENT';
  return 'STRONG';
}

export function SkillProgressGrid({ profile }: SkillProgressGridProps) {
  const skills = Object.values(profile.skills).sort((a, b) => b.mastery - a.mastery);

  return (
    <Panel className="bg-[#060a14] border-slate-800/80 p-6">
      <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">SKILL PROGRESS</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map(skill => {
          const label = getMasteryLabel(skill.mastery);
          const isHigh = skill.mastery >= 80;
          const isMedium = skill.mastery >= 40 && skill.mastery < 80;
          
          return (
            <div key={skill.id} className="p-4 rounded-lg bg-[#0b1120] border border-slate-800/80 flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-200">{skill.name}</h4>
                  <span className="text-xs font-mono text-cyan-400">{Math.round(skill.mastery)}%</span>
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">{skill.category}</div>
              </div>
              
              <div>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest mb-1.5">
                  <span className={isHigh ? 'text-green-400' : isMedium ? 'text-amber-400' : 'text-slate-400'}>{label}</span>
                  <span className="text-slate-500">{skill.simulationsCompleted} SIMS</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isHigh ? 'bg-green-500' : isMedium ? 'bg-amber-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${Math.max(2, skill.mastery)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
