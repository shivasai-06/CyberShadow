import { ShieldCheck, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { healthApi } from '../../services/healthApi';

export function TopBar({ toggleSidebar, isSidebarOpen }: { toggleSidebar?: () => void, isSidebarOpen?: boolean }) {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true); // assume true initially

  useEffect(() => {
    let mounted = true;

    const checkHealth = async () => {
      try {
        await healthApi.getBackendHealth();
        if (mounted) setIsBackendOnline(true);
      } catch {
        if (mounted) setIsBackendOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-14 border-b border-gray-800 bg-[#030712]/90 backdrop-blur flex items-center justify-between pl-14 pr-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded transition-colors"
            title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}
        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 tracking-widest uppercase">
          <span className="text-gray-500 font-bold sm:font-normal">CYBERSHADOW</span>
          <span className="hidden sm:inline text-gray-700">/</span>
          <span className="hidden sm:inline text-gray-300">SECURITY SIMULATION CENTER</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-gray-900/50 rounded border border-gray-800">
          <ShieldCheck size={14} className="text-amber-500" />
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">SIMULATION ONLY</span>
        </div>

        <div
          className="flex items-center justify-center px-2 py-1 cursor-default"
          title={isBackendOnline ? "Backend Online" : "Backend Offline"}
          aria-label={isBackendOnline ? "Backend Online" : "Backend Offline"}
        >
          {isBackendOnline ? (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          )}
        </div>
      </div>
    </div>
  );
}
