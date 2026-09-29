import type { SimulationScenario } from '../../types/simulation';

interface SimulationScenarioSelectorProps {
  scenarios: SimulationScenario[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SimulationScenarioSelector({ scenarios, selectedId, onSelect }: SimulationScenarioSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">SELECT A SCENARIO</h2>
        <p className="text-xs text-slate-500">Choose a fictional scenario to explore inside the isolated CyberShadow environment.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map(scenario => {
          const isSelected = selectedId === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario.id)}
              className={`text-left flex flex-col p-5 rounded-lg border transition-all h-full ${
                isSelected 
                  ? 'bg-[#060a14] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : 'bg-[#0b1120] border-slate-800/80 hover:border-slate-700 hover:bg-[#060a14]'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-white tracking-wide">{scenario.name}</h3>
                <div className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                  scenario.difficulty === 'BEGINNER' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                  scenario.difficulty === 'INTERMEDIATE' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                  'text-red-400 border-red-500/30 bg-red-500/10'
                }`}>
                  {scenario.difficulty}
                </div>
              </div>
              
              <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-3">
                {scenario.category}
              </div>
              
              <p className="text-xs text-slate-500 mb-6 flex-1">
                {scenario.description}
              </p>
              
              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">ATTACK STAGES</div>
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-400 font-mono">
                  {scenario.steps.map((step, idx) => (
                    <span key={step.id} className="flex items-center">
                      {step.name}
                      {idx < scenario.steps.length - 1 && <span className="mx-1.5 text-slate-600">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
