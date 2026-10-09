import { HolographicDisplay } from './HolographicDisplay';
import type { SimulationRunPlan } from '../../../engine/simulationEngine';
interface EventStreamDisplayProps {
  simulationPlan: SimulationRunPlan | null;
  currentStepIndex: number;
  simulationState: string;
}


export function EventStreamDisplay({ simulationPlan, currentStepIndex, simulationState }: EventStreamDisplayProps) {
  return (
    <HolographicDisplay
      position={[-7, 1, 2]}
      rotation={[0, 0.4, 0]}
      title="EVENT STREAM"
      width="400px"
      height="550px"
      color="#0ea5e9"
      isActive={simulationState !== 'idle'}
    >
      <div className="space-y-4 font-mono overflow-y-auto pr-2 hide-scrollbar h-full">
        {simulationState === 'idle' && (
          <div className="text-slate-500 italic text-sm">Waiting for simulation...</div>
        )}
        {simulationPlan?.stepsToRun.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || simulationState === 'completed';
          const isActive = idx === currentStepIndex && simulationState !== 'completed';
          
          return (
            <div key={idx} className={`flex gap-3 transition-opacity duration-300 ${isActive ? 'opacity-100' : isCompleted ? 'opacity-50' : 'opacity-20'}`}>
              <div className="flex flex-col items-center mt-1">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : isCompleted ? 'bg-slate-500' : 'bg-transparent border border-slate-600'}`} />
                {idx < simulationPlan.stepsToRun.length - 1 && (
                  <div className={`w-px h-full mt-1 ${isCompleted ? 'bg-slate-600' : 'bg-slate-800'}`} />
                )}
              </div>
              <div className="pb-3">
                <div className={`text-xs font-bold tracking-widest uppercase ${isActive ? 'text-cyan-400' : 'text-slate-300'}`}>
                  {step.name}
                </div>
                {isActive && (
                  <div className="text-sm text-slate-400 mt-1 leading-snug">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </HolographicDisplay>
  );
}

interface SecurityStatusDisplayProps {
  controls: any; // We'll pass the controls state here
  defenseImpacts: any[];
  simulationState: string;
}

export function SecurityStatusDisplay({ controls, defenseImpacts, simulationState }: SecurityStatusDisplayProps) {
  const isDefending = defenseImpacts.length > 0;

  return (
    <HolographicDisplay
      position={[7, 1, 2]}
      rotation={[0, -0.4, 0]}
      title="SECURITY STATUS"
      width="400px"
      height="550px"
      color={isDefending ? '#10b981' : '#6366f1'}
      isActive={simulationState !== 'idle'}
    >
      <div className="flex flex-col h-full font-mono">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(controls).map(([key, isActive]) => (
            <div key={key} className={`p-3 rounded border ${isActive ? 'bg-indigo-950/40 border-indigo-500/30' : 'bg-slate-900/40 border-slate-800'}`}>
               <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{key.replace(/_/g, ' ')}</div>
               <div className={`text-sm font-bold ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                 {isActive ? 'ACTIVE' : 'DISABLED'}
               </div>
            </div>
          ))}
        </div>
        
        <div className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-3">DEFENSE IMPACTS</div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {defenseImpacts.length === 0 && (
            <div className="text-slate-600 text-sm italic">No controls engaged yet.</div>
          )}
          {defenseImpacts.map((impact, idx) => (
             <div key={idx} className={`p-3 rounded border-l-2 ${impact.isActive ? 'bg-emerald-950/20 border-emerald-500' : 'bg-red-950/20 border-red-500'}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${impact.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {impact.control.replace(/_/g, ' ')}
                </div>
                <div className="text-sm text-slate-300">{impact.effectDescription}</div>
             </div>
          ))}
        </div>
      </div>
    </HolographicDisplay>
  );
}

interface TelemetryDisplayProps {
  simulationPlan: SimulationRunPlan | null;
  currentStepIndex: number;
  simulationState: string;
}

export function TelemetryDisplay({ simulationPlan, currentStepIndex, simulationState }: TelemetryDisplayProps) {
  const total = simulationPlan?.stepsToRun.length || 0;
  const progress = total > 0 ? (currentStepIndex / total) * 100 : 0;
  
  return (
    <HolographicDisplay
      position={[0, -3.5, 3]}
      rotation={[-0.2, 0, 0]}
      title="TELEMETRY"
      width="600px"
      height="200px"
      color="#3b82f6"
      isActive={simulationState === 'running'}
    >
      <div className="flex gap-8 font-mono h-full items-center">
        <div className="flex-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">SIMULATION PROGRESS</div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
             <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${simulationState === 'completed' ? 100 : progress}%` }} />
          </div>
          <div className="text-xs text-blue-400 font-bold">
            {simulationState === 'completed' ? 'COMPLETED' : `STEP ${currentStepIndex + 1} OF ${total}`}
          </div>
        </div>
        
        <div className="w-px h-16 bg-slate-800" />
        
        <div className="flex-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">THREAT STATE</div>
          <div className={`text-xl font-bold tracking-widest ${simulationState === 'idle' ? 'text-slate-600' : 'text-amber-500'}`}>
            {simulationState === 'idle' ? 'STANDBY' : simulationState === 'completed' ? (simulationPlan?.outcome === 'ATTACK BLOCKED' ? 'MITIGATED' : simulationPlan?.outcome === 'DATA RECOVERED' ? 'RECOVERED' : 'COMPROMISED') : 'ACTIVE PURSUIT'}
          </div>
        </div>
      </div>
    </HolographicDisplay>
  );
}

export function OutcomeDisplay({ state, message, outcome }: { state: string, message: string, outcome: string }) {
  const isBlocked = state === 'BLOCKED';
  const isSuccess = state === 'SUCCESS';
  
  const color = isBlocked ? '#10b981' : isSuccess ? '#3b82f6' : '#ef4444';
  const iconText = isBlocked ? '[ BLOCKED ]' : isSuccess ? '[ RECOVERED ]' : '[ ALERT ]';
  
  return (
    <HolographicDisplay
      position={[0, 2, 0]}
      title="SIMULATION CONCLUDED"
      width="800px"
      height="300px"
      color={color}
      isActive={true}
      glow={true}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
         <div className="text-2xl font-bold tracking-widest uppercase mb-4" style={{ color }}>
           {iconText}
         </div>
         <div className="text-4xl font-bold tracking-widest uppercase mb-4" style={{ color, textShadow: `0 0 20px ${color}` }}>
           {outcome}
         </div>
         <div className="text-lg text-slate-300 max-w-lg">
           {message}
         </div>
      </div>
    </HolographicDisplay>
  );
}
