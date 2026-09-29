import type { SimulationScenario, SimulationState } from '../../types/simulation';
import { ArrowDown } from 'lucide-react';

interface SimulationWorkspaceProps {
  scenario: SimulationScenario;
  currentState: SimulationState;
  currentStepIndex: number;
  simulationResult: 'COMPROMISED' | 'BLOCKED' | null;
}

export function SimulationWorkspace({ scenario, currentState, currentStepIndex, simulationResult }: SimulationWorkspaceProps) {
  return (
    <div className="flex-1 bg-[#060a14] rounded-lg border border-slate-800/80 p-8 flex flex-col items-center justify-center relative min-h-[400px]">
      <div className="absolute top-4 left-4">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SIMULATION ACTIVE</div>
        <div className="text-sm font-bold text-white tracking-wide">{scenario.name}</div>
      </div>
      
      <div className="text-center mb-8">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">ATTACK PATH</h3>
        
        <div className="flex flex-col items-center">
          {scenario.steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex || simulationResult !== null;
            const isActive = idx === currentStepIndex && currentState === 'running';
            
            let statusStyles = "border-slate-800/80 bg-[#0b1120] text-slate-500";
            let glow = "";
            
            if (isActive) {
              statusStyles = "border-cyan-500 bg-cyan-950/30 text-cyan-400";
              glow = "shadow-[0_0_15px_rgba(6,182,212,0.2)]";
            } else if (isCompleted) {
              if (simulationResult === 'BLOCKED' && idx === currentStepIndex) {
                statusStyles = "border-green-500 bg-green-950/30 text-green-400";
                glow = "shadow-[0_0_15px_rgba(34,197,94,0.2)]";
              } else if (simulationResult === 'COMPROMISED' && idx === scenario.steps.length - 1) {
                statusStyles = "border-red-500 bg-red-950/30 text-red-400";
                glow = "shadow-[0_0_15px_rgba(239,68,68,0.2)]";
              } else {
                statusStyles = "border-slate-700 bg-slate-900/50 text-slate-300";
              }
            }

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-64 p-4 rounded-xl border text-center transition-all duration-500 ${statusStyles} ${glow}`}>
                  <p className="text-sm font-medium tracking-wide uppercase">{step.name}</p>
                </div>
                
                {idx < scenario.steps.length - 1 && (
                  <ArrowDown 
                    className={`my-3 transition-colors duration-500 ${isCompleted && !simulationResult ? 'text-cyan-500/50' : 'text-slate-800'}`} 
                    size={20} 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
