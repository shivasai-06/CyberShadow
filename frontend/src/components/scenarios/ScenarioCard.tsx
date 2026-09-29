import type { ScenarioDefinition } from '../../types/scenarios';
import { ArrowRight, Eye, Play } from 'lucide-react';
import { Button } from '../ui/Button';

interface ScenarioCardProps {
  scenario: ScenarioDefinition;
  onView: () => void;
  onLaunch: () => void;
}

export function ScenarioCard({ scenario, onView, onLaunch }: ScenarioCardProps) {
  return (
    <div className="flex flex-col bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden transition-all hover:border-slate-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.03)] h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{scenario.id.replace('sc_', 'SCENARIO ')}</div>
          <div className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
            scenario.difficulty === 'BEGINNER' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
            scenario.difficulty === 'INTERMEDIATE' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
            'text-red-400 border-red-500/30 bg-red-500/10'
          }`}>
            {scenario.difficulty}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white tracking-wide mb-1">{scenario.title}</h3>
        <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-4">
          {scenario.category}
        </div>
        
        <p className="text-xs text-slate-400 mb-6 flex-1 line-clamp-3">
          {scenario.description}
        </p>
        
        <div className="space-y-4">
          <div>
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">ATTACK PATH</div>
            <div className="flex flex-wrap items-center gap-1 text-[9px] text-slate-300 font-mono uppercase">
              {scenario.attackPath.slice(0, 3).map((node, i) => (
                <div key={i} className="flex items-center">
                  <span className="px-1.5 py-0.5 bg-[#060a14] border border-slate-800 rounded">{node}</span>
                  {i < Math.min(scenario.attackPath.length, 3) - 1 && <ArrowRight size={10} className="mx-1 text-slate-600" />}
                </div>
              ))}
              {scenario.attackPath.length > 3 && (
                <div className="flex items-center">
                  <ArrowRight size={10} className="mx-1 text-slate-600" />
                  <span className="text-slate-500">+{scenario.attackPath.length - 3}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">ASSETS</div>
              <div className="flex flex-wrap gap-1">
                {scenario.affectedAssets.map((asset, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded-sm">
                    {asset.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">CONTROLS</div>
              <div className="flex flex-wrap gap-1">
                {scenario.defensiveControls.slice(0, 2).map((control, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 bg-cyan-950/30 text-cyan-500 border border-cyan-900/50 rounded-sm">
                    {control.name}
                  </span>
                ))}
                {scenario.defensiveControls.length > 2 && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-slate-500 rounded-sm">+{scenario.defensiveControls.length - 2}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#060a14] border-t border-slate-800/80 p-4 grid grid-cols-2 gap-3">
        <Button variant="ghost" onClick={onView} className="text-[10px] uppercase tracking-widest gap-2 justify-center border border-slate-800 hover:border-slate-600">
          <Eye size={14} /> VIEW SCENARIO
        </Button>
        <Button variant="primary" onClick={onLaunch} className="text-[10px] uppercase tracking-widest gap-2 justify-center">
          <Play size={14} fill="currentColor" /> LAUNCH
        </Button>
      </div>
    </div>
  );
}
