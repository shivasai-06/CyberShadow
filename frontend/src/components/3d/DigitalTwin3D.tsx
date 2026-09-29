

export function DigitalTwin3D() {
  return (
    <div className="w-full h-[500px] bg-gray-950 rounded-xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner shadow-cyan-900/10">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVMMDAgMzkuNXoiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTM5LjUgMEwzOS41IDQweiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-30" />
      
      {/* Center glowing element */}
      <div className="relative">
        <div className="absolute -inset-10 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="w-32 h-32 border border-cyan-500/30 rounded-full flex items-center justify-center bg-gray-900/50 backdrop-blur-md relative z-10 animate-pulse">
          <div className="w-24 h-24 border border-violet-500/30 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-cyan-900/50 rounded-full flex items-center justify-center text-cyan-400 font-mono text-xs">
              TWIN_ID
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center z-10">
        <h3 className="text-xl font-bold text-gray-200">3D DIGITAL TWIN</h3>
        <p className="text-gray-500 text-sm mt-2">SIMULATION ENVIRONMENT</p>
        <p className="text-xs text-amber-500/70 mt-4 border border-amber-500/20 px-3 py-1 rounded-full bg-amber-500/10">
          3D Engine Initializing (Phase 3)
        </p>
      </div>
    </div>
  );
}
