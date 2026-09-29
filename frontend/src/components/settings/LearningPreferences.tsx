import type { AppSettings, DifficultyPreference, LearningMode } from '../../types/settings';
import { SettingsToggle } from './SettingsToggle';

interface LearningPreferencesProps {
  learning: AppSettings['learning'];
  onChange: (learning: AppSettings['learning']) => void;
}

export function LearningPreferences({ learning, onChange }: LearningPreferencesProps) {
  
  const handleDifficulty = (d: DifficultyPreference) => onChange({ ...learning, difficulty: d });
  const handleMode = (m: LearningMode) => onChange({ ...learning, mode: m });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">DIFFICULTY PREFERENCE</label>
          <div className="flex bg-[#060a14] p-1 rounded border border-slate-800 w-fit">
            {(['Beginner', 'Intermediate', 'Advanced', 'Adaptive'] as DifficultyPreference[]).map(d => (
              <button
                key={d}
                onClick={() => handleDifficulty(d)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                  learning.difficulty === d ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-300 border border-transparent'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">LEARNING MODE</label>
          <div className="flex bg-[#060a14] p-1 rounded border border-slate-800 w-fit">
            {(['Guided', 'Exploration', 'Challenge'] as LearningMode[]).map(m => (
              <button
                key={m}
                onClick={() => handleMode(m)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                  learning.mode === m ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-slate-400 hover:text-slate-300 border border-transparent'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-800/50 pt-2 border-t border-slate-800/50">
        <SettingsToggle
          label="Show Learning Explanations"
          description="Show explanations after simulated attack steps."
          checked={learning.showExplanations}
          onChange={(val) => onChange({ ...learning, showExplanations: val })}
        />
        <SettingsToggle
          label="Show Attack Paths"
          description="Display the fictional attack path during simulations."
          checked={learning.showAttackPaths}
          onChange={(val) => onChange({ ...learning, showAttackPaths: val })}
        />
        <SettingsToggle
          label="Show Safety Notices"
          description="Keep simulation safety labels visible throughout the experience."
          checked={learning.showSafetyNotices}
          onChange={(val) => onChange({ ...learning, showSafetyNotices: val })}
        />
      </div>
    </div>
  );
}
