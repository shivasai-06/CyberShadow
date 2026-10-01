import { GraduationCap } from 'lucide-react';

export function LearningPathHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <div className="text-[10px] font-bold text-violet-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
          <GraduationCap size={12} /> MY LEARNING PATH
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Learning Path</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          A personalized simulation path based on your practice history.
        </p>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">SIMULATION LEARNING ONLY</span>
        </div>
        <div className="text-[9px] font-mono text-slate-500 tracking-widest uppercase text-right">
          FICTIONAL SCENARIOS · SYNTHETIC DATA<br/>NO REAL SYSTEMS AFFECTED
        </div>
      </div>
    </div>
  );
}
