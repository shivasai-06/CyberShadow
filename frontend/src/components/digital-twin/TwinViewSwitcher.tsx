import { Map, Cuboid } from 'lucide-react';

interface TwinViewSwitcherProps {
  view: '2D' | '3D';
  onViewChange: (view: '2D' | '3D') => void;
}

export function TwinViewSwitcher({ view, onViewChange }: TwinViewSwitcherProps) {
  return (
    <div className="inline-flex items-center bg-[#060a14] border border-slate-800/80 rounded-md p-1">
      <button
        onClick={() => onViewChange('2D')}
        className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-colors ${
          view === '2D' 
            ? 'bg-slate-800 text-cyan-400 shadow-[0_0_10px_rgba(0,0,0,0.2)]' 
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <Map size={14} /> 2D TOPOLOGY
      </button>
      <button
        onClick={() => onViewChange('3D')}
        className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-colors ${
          view === '3D' 
            ? 'bg-slate-800 text-violet-400 shadow-[0_0_10px_rgba(0,0,0,0.2)]' 
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <Cuboid size={14} /> 3D ENVIRONMENT
      </button>
    </div>
  );
}
