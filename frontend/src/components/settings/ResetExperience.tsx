import { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { Button } from '../ui/Button';

interface ResetExperienceProps {
  onReset: () => void;
}

export function ResetExperience({ onReset }: ResetExperienceProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
        Reset CyberShadow's local learning preferences and fictional simulation state to the default configuration.
      </p>

      {!showConfirm ? (
        <Button variant="secondary" onClick={() => setShowConfirm(true)} className="gap-2 text-[10px] uppercase tracking-widest text-red-400 border-red-900/30 hover:bg-red-900/20">
          <AlertOctagon size={14} /> RESET EXPERIENCE
        </Button>
      ) : (
        <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertOctagon size={18} className="text-red-500" />
            <div>
              <div className="text-xs font-bold text-red-500 uppercase tracking-widest">CONFIRM RESET?</div>
              <div className="text-[10px] text-red-400/80 uppercase tracking-widest mt-0.5">This resets all preferences to defaults. Does not delete real data.</div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="ghost" onClick={() => setShowConfirm(false)} className="flex-1 md:flex-none text-[10px] uppercase tracking-widest text-slate-300">
              CANCEL
            </Button>
            <Button variant="primary" onClick={() => { onReset(); setShowConfirm(false); }} className="flex-1 md:flex-none text-[10px] uppercase tracking-widest bg-red-600 hover:bg-red-500 border-red-500 text-white">
              YES, RESET
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
