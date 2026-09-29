import { useState } from 'react';
import { Database, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface DataPrivacySettingsProps {
  onClearData: () => void;
}

export function DataPrivacySettings({ onClearData }: DataPrivacySettingsProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
        CyberShadow currently uses local fictional simulation data for this learning environment.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#060a14] p-4 rounded border border-slate-800">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">SIMULATION DATA</div>
          <div className="text-sm font-bold text-cyan-400 tracking-widest uppercase">LOCAL MOCK DATA</div>
        </div>
        <div className="bg-[#060a14] p-4 rounded border border-slate-800">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">REAL SYSTEM ACCESS</div>
          <div className="text-sm font-bold text-green-400 tracking-widest uppercase">NONE</div>
        </div>
        <div className="bg-[#060a14] p-4 rounded border border-slate-800">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">EXTERNAL ACTIONS</div>
          <div className="text-sm font-bold text-green-400 tracking-widest uppercase">NONE</div>
        </div>
        <div className="bg-[#060a14] p-4 rounded border border-slate-800">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">DATA COLLECTION</div>
          <div className="text-sm font-bold text-slate-400 tracking-widest uppercase">NOT ACTIVE</div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        {!showConfirm ? (
          <Button variant="secondary" onClick={() => setShowConfirm(true)} className="gap-2 text-[10px] uppercase tracking-widest text-slate-300">
            <Database size={14} /> CLEAR LOCAL SIMULATION DATA
          </Button>
        ) : (
          <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-amber-500" />
              <div>
                <div className="text-xs font-bold text-amber-500 uppercase tracking-widest">CLEAR SIMULATION DATA?</div>
                <div className="text-[10px] text-amber-400/80 uppercase tracking-widest mt-0.5">This will remove local fictional learning history from this session.</div>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="ghost" onClick={() => setShowConfirm(false)} className="flex-1 md:flex-none text-[10px] uppercase tracking-widest">
                CANCEL
              </Button>
              <Button variant="secondary" onClick={() => { onClearData(); setShowConfirm(false); }} className="flex-1 md:flex-none text-[10px] uppercase tracking-widest text-red-400 border-red-900/50 hover:bg-red-900/30">
                CLEAR DATA
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
