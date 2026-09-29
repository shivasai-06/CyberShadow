import { Button } from '../ui/Button';
import { MonitorPlay, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SecurityQuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-4 mt-8">
      <Button variant="secondary" onClick={() => navigate('/digital-twin')} className="gap-2 text-[10px] uppercase tracking-widest">
        <MonitorPlay size={14} className="text-cyan-500" /> OPEN DIGITAL TWIN
      </Button>
      <Button variant="primary" onClick={() => navigate('/simulation')} className="gap-2 text-[10px] uppercase tracking-widest">
        <Play size={14} fill="currentColor" /> RUN SIMULATION
      </Button>
      <Button variant="secondary" onClick={() => navigate('/scenarios')} className="gap-2 text-[10px] uppercase tracking-widest">
        <BookOpen size={14} className="text-violet-500" /> EXPLORE SCENARIOS
      </Button>
    </div>
  );
}
