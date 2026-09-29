import { Box } from 'lucide-react';

export function DigitalTwin3D() {
  return (
    <div className="relative w-full h-[500px] bg-[#030712] rounded-lg border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center">
      {/* CSS 3D Perspective Grid Placeholder */}
      <div className="absolute inset-0 perspective-1000">
        <div className="absolute top-1/2 left-0 w-full h-[200%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PHBhdGggZD0iTTAgMGg4MHY4MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDc5LjVMODAgNzkuNXoiIHN0cm9rZT0icmdiYSg2LCAxODIsIDIxMiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTc5LjUgMEw3OS41IDgweiIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-40" 
             style={{ transform: 'rotateX(60deg) translateY(-20%)', transformOrigin: 'top center' }} />
      </div>
      
      {/* Central Identity Marker */}
      <div className="relative z-10 w-24 h-24 flex items-center justify-center mb-8">
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-violet-500/20 animate-[spin_3s_linear_infinite_reverse]" />
        <Box size={40} className="text-cyan-400 opacity-80" />
      </div>
      
      <div className="relative z-10 text-center">
        <h3 className="text-white font-bold tracking-[0.2em] mb-2">3D DIGITAL TWIN</h3>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-1">SIMULATION ENVIRONMENT</p>
        <div className="inline-block mt-4 px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded text-[10px] font-bold text-violet-400 tracking-widest uppercase">
          COMING IN 3D PHASE
        </div>
      </div>
    </div>
  );
}
