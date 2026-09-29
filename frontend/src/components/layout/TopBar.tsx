import { ShieldCheck } from 'lucide-react';

export function TopBar() {
  return (
    <div className="h-14 border-b border-gray-800 bg-[#030712]/90 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 tracking-widest uppercase">
        <span className="text-gray-500">CYBERSHADOW</span>
        <span className="text-gray-700">/</span>
        <span className="text-gray-300">SECURITY SIMULATION CENTER</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-gray-900/50 rounded border border-gray-800">
          <ShieldCheck size={14} className="text-amber-500" />
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">SIMULATION ONLY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="text-[11px] font-bold text-green-400 tracking-widest uppercase">SANDBOX ONLINE</span>
        </div>
      </div>
    </div>
  );
}
