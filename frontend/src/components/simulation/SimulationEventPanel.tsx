import type { SimulationStep } from '../../types/simulation';
import { Panel } from '../ui/Panel';
import { Activity } from 'lucide-react';

interface SimulationEventPanelProps {
  currentStep: SimulationStep | null;
  isActive: boolean;
}

export function SimulationEventPanel({ currentStep, isActive }: SimulationEventPanelProps) {
  if (!currentStep) {
    return (
      <Panel className="flex flex-col h-full opacity-50">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">CURRENT EVENT</div>
        <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
          Waiting for simulation to start...
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="flex flex-col h-full border-cyan-900/30">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CURRENT EVENT</div>
        <div className="flex items-center gap-1.5">
          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />}
          <span className={`text-[9px] font-bold tracking-widest uppercase ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
            {isActive ? 'SIMULATED' : 'PAUSED'}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white tracking-wide mb-3">{currentStep.name}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">
        {currentStep.description}
      </p>

      <div className="mt-auto pt-4 border-t border-slate-800/80 bg-[#060a14] -mx-6 -mb-6 p-6 rounded-b-lg">
        <div className="flex items-center gap-2 mb-2 text-violet-400">
          <Activity size={14} />
          <h4 className="text-[10px] font-bold uppercase tracking-widest">WHY THIS MATTERS</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {currentStep.learningContext}
        </p>
      </div>
    </Panel>
  );
}
