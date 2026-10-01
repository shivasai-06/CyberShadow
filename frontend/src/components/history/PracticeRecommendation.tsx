import { useNavigate } from 'react-router-dom';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Play, Activity, AlertTriangle, Lightbulb, RefreshCw, Star } from 'lucide-react';
import type { PracticeRecommendation as PracticeRecommendationType } from '../../types/learning';

interface PracticeRecommendationProps {
  recommendation: PracticeRecommendationType;
  compact?: boolean;
}

export function PracticeRecommendation({ recommendation, compact = false }: PracticeRecommendationProps) {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/simulation?scenario=${recommendation.scenarioId}`);
  };

  const IconMap = {
    WEAK_SKILL: AlertTriangle,
    REPEAT_PRACTICE: RefreshCw,
    NEXT_DIFFICULTY: Star,
    NEW_CATEGORY: Lightbulb,
    REINFORCEMENT: Activity
  };

  const Icon = IconMap[recommendation.type] || Activity;

  if (compact) {
    return (
      <Panel className="bg-cyan-950/10 border-cyan-900/30 flex items-start gap-4 p-4">
        <div className="p-2 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-800/50 shrink-0">
          <Icon size={16} />
        </div>
        <div className="flex-1">
          <h3 className="text-[10px] font-bold text-cyan-400 tracking-wide uppercase mb-1">RECOMMENDED PRACTICE</h3>
          <div className="text-sm font-bold text-white mb-1">{recommendation.scenarioTitle}</div>
          <p className="text-sm text-cyan-100/70 mb-2">{recommendation.reason}</p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">
            <span>Skill: {recommendation.targetSkillName}</span>
            <span>Difficulty: {recommendation.recommendedDifficulty}</span>
          </div>
          <Button variant="primary" size="sm" onClick={handleStart} className="text-[10px] uppercase tracking-widest gap-2">
            <Play size={12} fill="currentColor" /> {recommendation.suggestedAction}
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="bg-[#0b1120] border-slate-800/80 p-5 flex flex-col h-full group hover:border-cyan-900/50 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} className="text-cyan-500" />
        <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">YOUR NEXT SIMULATION</h3>
      </div>
      
      <div className="mb-4">
        <h4 className="text-lg font-bold text-white mb-1">{recommendation.scenarioTitle}</h4>
        <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">Recommended for {recommendation.targetSkillName}</div>
      </div>
      
      <div className="bg-[#060a14] rounded border border-slate-800/50 p-4 mb-6 flex-1">
        <div className="mb-4">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">SIMULATED MASTERY</div>
          <div className="text-xl text-white font-light">{recommendation.currentMastery} <span className="text-sm text-slate-500">/ 100</span></div>
        </div>
        
        <div className="mb-4">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">WHY</div>
          <div className="text-xs text-slate-300 leading-relaxed">{recommendation.reason}</div>
        </div>
        
        <div>
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">DIFFICULTY</div>
          <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{recommendation.recommendedDifficulty}</div>
        </div>
      </div>
      
      <Button variant="primary" className="w-full gap-2 text-xs uppercase tracking-widest" onClick={handleStart}>
        <Play size={14} fill="currentColor" /> START SIMULATION
      </Button>
    </Panel>
  );
}
