import type { TwinSecurityControl } from '../../types/digital-twin';
import { Panel } from '../ui/Panel';

interface SecurityControlsProps {
  controls: TwinSecurityControl[];
  onControlChange: (id: string, newState: string) => void;
}

export function SecurityControls({ controls, onControlChange }: SecurityControlsProps) {
  return (
    <Panel className="h-full flex flex-col">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">SECURITY CONTROLS</div>
      
      <div className="space-y-2 flex-1">
        {controls.map(control => (
          <div key={control.id} className="p-3 bg-[#060a14] border border-slate-800/60 rounded-md transition-colors hover:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">{control.name}</span>
              
              {control.type === 'toggle' ? (
                <div className="flex items-center bg-[#030712] rounded border border-slate-800 p-0.5">
                  <button 
                    onClick={() => onControlChange(control.id, 'ON')}
                    className={`px-2 py-0.5 text-[9px] font-bold tracking-widest rounded-sm transition-colors ${
                      control.state === 'ON' ? 'bg-green-500/20 text-green-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    ON
                  </button>
                  <button 
                    onClick={() => onControlChange(control.id, 'OFF')}
                    className={`px-2 py-0.5 text-[9px] font-bold tracking-widest rounded-sm transition-colors ${
                      control.state === 'OFF' ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    OFF
                  </button>
                </div>
              ) : (
                <div className="flex items-center bg-[#030712] rounded border border-slate-800 p-0.5">
                  <button 
                    onClick={() => onControlChange(control.id, 'LOW')}
                    className={`px-2 py-0.5 text-[9px] font-bold tracking-widest rounded-sm transition-colors ${
                      control.state === 'LOW' ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    LOW
                  </button>
                  <button 
                    onClick={() => onControlChange(control.id, 'MEDIUM')}
                    className={`px-2 py-0.5 text-[9px] font-bold tracking-widest rounded-sm transition-colors ${
                      control.state === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    MED
                  </button>
                  <button 
                    onClick={() => onControlChange(control.id, 'HIGH')}
                    className={`px-2 py-0.5 text-[9px] font-bold tracking-widest rounded-sm transition-colors ${
                      control.state === 'HIGH' ? 'bg-green-500/20 text-green-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    HIGH
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-slate-500 leading-snug">{control.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
          Changes update local simulation defense state only.
        </p>
      </div>
    </Panel>
  );
}
