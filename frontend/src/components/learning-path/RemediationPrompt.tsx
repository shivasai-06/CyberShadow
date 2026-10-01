import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface RemediationPromptProps {
  openCount: number;
}

export function RemediationPrompt({ openCount }: RemediationPromptProps) {
  const navigate = useNavigate();
  
  if (openCount === 0) return null;

  return (
    <div className="bg-orange-950/20 border border-orange-900/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <Target className="text-orange-500" size={24} />
        <div>
          <h3 className="text-orange-400 font-bold text-sm tracking-wide">ACTION REQUIRED</h3>
          <p className="text-slate-300 text-xs mt-0.5">You have {openCount} pending simulated remediation {openCount === 1 ? 'action' : 'actions'} from previous scenarios.</p>
        </div>
      </div>
      <Button 
        variant="secondary" 
        className="text-[10px] uppercase tracking-widest gap-2 bg-orange-950/50 hover:bg-orange-900/50 border-orange-900/50 text-orange-200"
        onClick={() => navigate('/security/remediation')}
      >
        VIEW REMEDIATIONS <ArrowRight size={14} />
      </Button>
    </div>
  );
}
