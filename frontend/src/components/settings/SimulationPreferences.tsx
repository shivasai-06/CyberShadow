import type { AppSettings, SimulationSpeed } from '../../types/settings';
import { SettingsToggle } from './SettingsToggle';

interface SimulationPreferencesProps {
  simulation: AppSettings['simulation'];
  onChange: (sim: AppSettings['simulation']) => void;
}

export function SimulationPreferences({ simulation, onChange }: SimulationPreferencesProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">DEFAULT SIMULATION SPEED</label>
        <div className="flex bg-[#060a14] p-1 rounded border border-slate-800 w-fit">
          {(['Slow', 'Normal', 'Fast'] as SimulationSpeed[]).map(s => (
            <button
              key={s}
              onClick={() => onChange({ ...simulation, speed: s })}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                simulation.speed === s ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-slate-300 border border-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-800/50 pt-2 border-t border-slate-800/50">
        <SettingsToggle
          label="Auto-Advance Simulation"
          description="Automatically progress through fictional attack steps."
          checked={simulation.autoAdvance}
          onChange={(val) => onChange({ ...simulation, autoAdvance: val })}
        />
        <SettingsToggle
          label="Pause Between Critical Events"
          description="Pause at important fictional attack transitions so the learner can understand what happened."
          checked={simulation.pauseAtCriticalEvents}
          onChange={(val) => onChange({ ...simulation, pauseAtCriticalEvents: val })}
        />
        <SettingsToggle
          label="Show Simulated Risk"
          description="Display fictional risk indicators during simulations."
          checked={simulation.showSimulatedRisk}
          onChange={(val) => onChange({ ...simulation, showSimulatedRisk: val })}
        />
      </div>
    </div>
  );
}
