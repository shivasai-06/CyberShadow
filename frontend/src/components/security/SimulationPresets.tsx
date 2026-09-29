import type { PresetType } from '../../types/security';
import { Settings2 } from 'lucide-react';

interface SimulationPresetsProps {
  onApplyPreset: (preset: PresetType) => void;
  activePreset: PresetType | null;
}

export function SimulationPresets({ onApplyPreset, activePreset }: SimulationPresetsProps) {
  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 size={16} className="text-cyan-500" />
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SIMULATION PRESET</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
          activePreset === 'BALANCED' ? 'bg-cyan-950/20 border-cyan-500/50' : 'bg-[#060a14] border-slate-800 hover:border-slate-700'
        }`} onClick={() => onApplyPreset('BALANCED')}>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase mb-2">BALANCED</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-4 min-h-[30px]">
            Moderate defensive configuration for standard simulations.
          </p>
          <div className={`text-[9px] font-bold uppercase tracking-widest ${activePreset === 'BALANCED' ? 'text-cyan-400' : 'text-slate-600'}`}>
            {activePreset === 'BALANCED' ? 'APPLIED' : 'APPLY PRESET'}
          </div>
        </div>

        <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
          activePreset === 'HIGH_PROTECTION' ? 'bg-green-950/20 border-green-500/50' : 'bg-[#060a14] border-slate-800 hover:border-slate-700'
        }`} onClick={() => onApplyPreset('HIGH_PROTECTION')}>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase mb-2">HIGH PROTECTION</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-4 min-h-[30px]">
            Most controls enabled to observe blocked outcomes.
          </p>
          <div className={`text-[9px] font-bold uppercase tracking-widest ${activePreset === 'HIGH_PROTECTION' ? 'text-green-400' : 'text-slate-600'}`}>
            {activePreset === 'HIGH_PROTECTION' ? 'APPLIED' : 'APPLY PRESET'}
          </div>
        </div>

        <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
          activePreset === 'TEST_VULNERABILITIES' ? 'bg-amber-950/20 border-amber-500/50' : 'bg-[#060a14] border-slate-800 hover:border-slate-700'
        }`} onClick={() => onApplyPreset('TEST_VULNERABILITIES')}>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase mb-2">TEST VULNERABILITIES</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-4 min-h-[30px]">
            Several controls disabled to allow attacks to progress.
          </p>
          <div className={`text-[9px] font-bold uppercase tracking-widest ${activePreset === 'TEST_VULNERABILITIES' ? 'text-amber-400' : 'text-slate-600'}`}>
            {activePreset === 'TEST_VULNERABILITIES' ? 'APPLIED' : 'APPLY PRESET'}
          </div>
        </div>

      </div>
    </div>
  );
}
