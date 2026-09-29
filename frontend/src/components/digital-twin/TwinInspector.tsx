import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import type { TwinAsset } from '../../types/digital-twin';
import { Info, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TwinInspectorProps {
  asset: TwinAsset | null;
}

export function TwinInspector({ asset }: TwinInspectorProps) {
  const navigate = useNavigate();

  if (!asset) {
    return (
      <Panel className="h-full min-h-[300px] flex flex-col items-center justify-center text-center">
        <Info size={32} className="text-slate-700 mb-4" />
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">SELECT AN ASSET TO INSPECT</h3>
        <p className="text-xs text-slate-500 max-w-xs">Click on any node in the Digital Twin topology to view detailed properties and simulation paths.</p>
      </Panel>
    );
  }

  return (
    <Panel className="h-full flex flex-col relative overflow-hidden border-cyan-900/30">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Target size={120} />
      </div>
      
      <div className="relative z-10 flex-1">
        <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2">ASSET INSPECTOR</div>
        <h2 className="text-2xl font-bold text-white mb-1">{asset.name}</h2>
        <div className="text-[11px] text-slate-400 font-mono tracking-widest uppercase mb-6 pb-4 border-b border-slate-800/80">
          {asset.type}
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">STATUS</div>
            <div className={`text-xs font-bold tracking-widest uppercase ${
              asset.status === 'PROTECTED' ? 'text-green-400' :
              asset.status === 'EXPOSED' ? 'text-red-400' : 'text-amber-400'
            }`}>
              {asset.status}
            </div>
          </div>
          
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">CONNECTIONS</div>
            <div className="text-sm font-medium text-slate-200">{asset.connections}</div>
          </div>
          
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">ROLE</div>
            <div className="text-sm font-medium text-slate-200">{asset.role}</div>
          </div>
          
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">SIMULATION EXPOSURE</div>
            <div className={`text-xs font-bold tracking-widest uppercase ${
              asset.simulationExposure === 'HIGH' ? 'text-red-400' :
              asset.simulationExposure === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'
            }`}>
              {asset.simulationExposure}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-800/80">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">POTENTIAL SCENARIOS</div>
            <ul className="space-y-2">
              {asset.potentialScenarios.map((sc, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                  <div className="w-1 h-1 bg-cyan-500 rounded-full" /> {sc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 pt-6 mt-auto">
        <Button variant="secondary" className="w-full text-[10px] uppercase tracking-widest" onClick={() => navigate('/scenarios')}>
          VIEW RELATED SCENARIOS
        </Button>
      </div>
    </Panel>
  );
}
