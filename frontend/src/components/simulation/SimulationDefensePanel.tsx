import { Panel } from '../ui/Panel';

interface SimulationDefensePanelProps {
  mfaEnabled: boolean;
  onMfaToggle: (enabled: boolean) => void;
  isSimulating: boolean;
}

export function SimulationDefensePanel({ mfaEnabled, onMfaToggle, isSimulating }: SimulationDefensePanelProps) {
  return (
    <Panel className="flex flex-col h-full">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">ACTIVE DEFENSE CONTROLS</div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-[#060a14] rounded border border-slate-800/60">
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">MFA</span>
          <div className="flex items-center bg-[#030712] rounded border border-slate-800 p-0.5">
            <button 
              disabled={isSimulating}
              onClick={() => onMfaToggle(true)}
              className={`px-3 py-1 text-[9px] font-bold tracking-widest rounded-sm transition-colors ${
                mfaEnabled ? 'bg-green-500/20 text-green-400' : 'text-slate-500 hover:text-slate-300'
              } ${isSimulating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ON
            </button>
            <button 
              disabled={isSimulating}
              onClick={() => onMfaToggle(false)}
              className={`px-3 py-1 text-[9px] font-bold tracking-widest rounded-sm transition-colors ${
                !mfaEnabled ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-slate-300'
              } ${isSimulating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              OFF
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#060a14] rounded border border-slate-800/60 opacity-60">
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">PASSWORD STRENGTH</span>
          <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase">MEDIUM</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#060a14] rounded border border-slate-800/60 opacity-60">
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">SECURITY AWARENESS</span>
          <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase">MEDIUM</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#060a14] rounded border border-slate-800/60 opacity-60">
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">BACKUP</span>
          <span className="text-[9px] font-bold tracking-widest text-green-400 uppercase">ON</span>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
          SIMULATION CONTROL: Changes only affect this fictional simulation.
        </p>
      </div>
    </Panel>
  );
}
