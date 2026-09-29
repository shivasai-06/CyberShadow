import type { SecurityControlDef } from '../../types/security';

interface SecurityControlCardProps {
  control: SecurityControlDef;
  isActive: boolean;
  onToggle: (active: boolean) => void;
  onClick: () => void;
  isSelected: boolean;
}

export function SecurityControlCard({ control, isActive, onToggle, onClick, isSelected }: SecurityControlCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-lg border transition-all cursor-pointer ${
        isSelected 
          ? 'bg-[#060a14] border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
          : 'bg-[#0b1120] border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-white tracking-wide uppercase">{control.name}</h4>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(!isActive);
          }}
          className={`flex items-center w-10 h-5 rounded-full p-0.5 transition-colors ${
            isActive ? 'bg-cyan-500' : 'bg-slate-700'
          }`}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
            isActive ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>
      
      <div className="mb-4">
        <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
          isActive ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
        }`}>
          {isActive ? 'ON' : 'OFF'}
        </span>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        {control.description}
      </p>
      
      <div className="pt-4 border-t border-slate-800/80">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">SIMULATION EFFECT</div>
        <p className="text-[10px] text-cyan-400 font-mono leading-relaxed">
          {control.effect}
        </p>
      </div>
    </div>
  );
}
