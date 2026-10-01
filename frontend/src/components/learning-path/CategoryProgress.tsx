import { Panel } from '../ui/Panel';
import type { LearningProfile, SkillCategory } from '../../types/learning';

interface CategoryProgressProps {
  profile: LearningProfile;
}

const CATEGORIES: SkillCategory[] = [
  'IDENTITY',
  'SOCIAL ENGINEERING',
  'ENDPOINT',
  'CLOUD',
  'RESILIENCE'
];

export function CategoryProgress({ profile }: CategoryProgressProps) {
  const allSkills = Object.values(profile.skills);
  
  return (
    <Panel className="bg-[#060a14] border-slate-800/80 p-6 h-full">
      <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">CATEGORY PROGRESS</h3>
      
      <div className="space-y-6">
        {CATEGORIES.map(category => {
          const categorySkills = allSkills.filter(s => s.category === category);
          const totalMastery = categorySkills.reduce((sum, s) => sum + s.mastery, 0);
          const avgMastery = categorySkills.length > 0 ? totalMastery / categorySkills.length : 0;
          const practiced = categorySkills.some(s => s.simulationsCompleted > 0);
          
          return (
            <div key={category} className="pb-6 border-b border-slate-800/50 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">{category}</div>
                <div className="text-[9px] font-bold tracking-widest uppercase text-right">
                  {!practiced ? (
                    <span className="text-slate-500">MORE PRACTICE NEEDED</span>
                  ) : (
                    <span className="text-cyan-400 font-mono">{Math.round(avgMastery)}% PROGRESS</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {categorySkills.map(skill => (
                  <span key={skill.id} className="text-[9px] px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-400 uppercase tracking-wider">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
