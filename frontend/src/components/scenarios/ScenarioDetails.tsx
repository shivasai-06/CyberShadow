import type { ScenarioDefinition } from '../../types/scenarios';
import { Button } from '../ui/Button';
import { ArrowLeft, Play, ShieldAlert } from 'lucide-react';
import { ScenarioAttackPath } from './ScenarioAttackPath';
import { ScenarioAssets } from './ScenarioAssets';
import { ScenarioDefenses } from './ScenarioDefenses';
import { ScenarioLearning } from './ScenarioLearning';

interface ScenarioDetailsProps {
  scenario: ScenarioDefinition;
  onBack: () => void;
  onLaunch: () => void;
}

export function ScenarioDetails({ scenario, onBack, onLaunch }: ScenarioDetailsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" onClick={onBack} className="px-2 py-1 gap-2 text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> BACK TO LIBRARY
        </Button>
      </div>

      <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden">
        <div className="p-8 md:p-10 border-b border-slate-800/80 bg-gradient-to-br from-[#0b1120] to-[#060a14] relative">
          <div className="absolute right-0 top-0 p-10 opacity-5 pointer-events-none text-cyan-500">
            <ShieldAlert size={200} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{scenario.id.replace('sc_', 'SCENARIO ')}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">{scenario.category}</span>
                <span className="text-slate-600">•</span>
                <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                  scenario.difficulty === 'BEGINNER' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                  scenario.difficulty === 'INTERMEDIATE' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                  'text-red-400 border-red-500/30 bg-red-500/10'
                }`}>
                  {scenario.difficulty}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-white tracking-wide mb-4">{scenario.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-2xl">
                {scenario.description}
              </p>
              
              <div className="flex items-center gap-4">
                <Button variant="primary" onClick={onLaunch} className="gap-2 px-8">
                  <Play size={16} fill="currentColor" /> LAUNCH SIMULATION
                </Button>
              </div>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-5 md:w-72 mt-4 md:mt-0">
              <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">SIMULATION OUTCOME</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {scenario.simulationOutcome}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-10">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">ATTACK PATH</h4>
            <ScenarioAttackPath path={scenario.attackPath} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <ScenarioAssets assets={scenario.affectedAssets} />
            <ScenarioDefenses controls={scenario.defensiveControls} />
          </div>
          
          <ScenarioLearning objectives={scenario.learningObjectives} />
        </div>
      </div>
    </div>
  );
}
