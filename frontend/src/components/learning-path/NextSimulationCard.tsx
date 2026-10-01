import { useNavigate } from 'react-router-dom';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Play, ShieldAlert } from 'lucide-react';
import type { PracticeRecommendation } from '../../types/learning';

interface NextSimulationCardProps {
  recommendation: PracticeRecommendation;
}

export function NextSimulationCard({ recommendation }: NextSimulationCardProps) {
  const navigate = useNavigate();

  return (
    <Panel className="bg-gradient-to-br from-[#0b1120] to-cyan-950/20 border-cyan-900/40 p-6 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <Play size={14} /> NEXT SIMULATION
        </h2>
        
        <div className="mb-2">
          <div className="text-3xl font-bold text-white tracking-wide mb-3">{recommendation.scenarioTitle}</div>
          <div className="inline-block px-3 py-1 bg-cyan-950/50 border border-cyan-900 text-[10px] font-bold text-cyan-400 uppercase tracking-widest rounded mb-6">
            {recommendation.recommendedDifficulty}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">TARGET SKILL</div>
            <div className="text-sm font-medium text-slate-300">{recommendation.targetSkillName}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SUGGESTED ACTION</div>
            <div className="text-sm font-medium text-slate-300">{recommendation.suggestedAction}</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-800/80">
        <Button 
          variant="primary" 
          className="flex-1 justify-center gap-2"
          onClick={() => navigate(`/simulation?scenario=${recommendation.scenarioId}`)}
        >
          <Play size={16} fill="currentColor" /> START STANDARD
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1 justify-center gap-2 text-violet-300 border-violet-900 hover:bg-violet-950/30"
          onClick={() => navigate(`/simulation?scenario=${recommendation.scenarioId}&mode=challenge`)}
        >
          <ShieldAlert size={16} /> START CHALLENGE
        </Button>
      </div>
    </Panel>
  );
}
