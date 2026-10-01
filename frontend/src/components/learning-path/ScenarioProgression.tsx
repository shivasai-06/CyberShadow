import { useNavigate } from 'react-router-dom';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Play, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import type { HistoryRecord } from '../../types/history';
import type { PracticeRecommendation } from '../../types/learning';
import { SIMULATION_SCENARIOS } from '../../data/simulationScenarios';

interface ScenarioProgressionProps {
  history: HistoryRecord[];
  primaryRecommendation: PracticeRecommendation;
}

const DIFFICULTY_ORDER = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export function ScenarioProgression({ history, primaryRecommendation }: ScenarioProgressionProps) {
  const navigate = useNavigate();
  
  const scenariosByDifficulty = SIMULATION_SCENARIOS.reduce((acc, scenario) => {
    const d = scenario.difficulty.toUpperCase();
    if (!acc[d]) acc[d] = [];
    acc[d].push(scenario);
    return acc;
  }, {} as Record<string, typeof SIMULATION_SCENARIOS>);

  const getScenarioStatus = (scenarioId: string) => {
    if (primaryRecommendation.scenarioId === scenarioId) return 'RECOMMENDED';
    
    const scenarioHistory = history.filter(r => r.scenarioId === scenarioId);
    if (scenarioHistory.length === 0) return 'NOT STARTED';
    
    // Check if it was played recently and needs reinforcement
    const lastRun = scenarioHistory[0];
    if (lastRun && (lastRun.riskyDecisions ?? 0) > 0 && Date.now() - new Date(lastRun.date).getTime() < 86400000 * 7) {
      return 'IN PRACTICE';
    }
    
    return 'PRACTICED';
  };

  const getDifficultyGuidance = () => {
    if (history.length === 0) return { title: 'BUILD FOUNDATION', text: 'Complete additional simulations to develop your learning profile.' };
    
    if (primaryRecommendation.type === 'NEXT_DIFFICULTY') {
      return { title: 'NEXT DIFFICULTY AVAILABLE', text: 'An intermediate or advanced scenario is available for continued practice.' };
    }
    
    if (primaryRecommendation.type === 'REINFORCEMENT') {
      return { title: 'REINFORCEMENT RECOMMENDED', text: 'Repeat a related simulation before progressing to build confidence.' };
    }

    if (primaryRecommendation.type === 'WEAK_SKILL') {
       return { title: 'SKILL FOCUS REQUIRED', text: 'Focus on your current recommended scenario to build foundational skills.' };
    }

    return { title: 'CONTINUE PRACTICE', text: 'Follow your recommended learning path to progress.' };
  };

  const guidance = getDifficultyGuidance();
  const hasExploredAll = SIMULATION_SCENARIOS.every(s => getScenarioStatus(s.id) === 'PRACTICED' || getScenarioStatus(s.id) === 'IN PRACTICE' || getScenarioStatus(s.id) === 'RECOMMENDED');
  const hasHistory = history.length > 0;

  return (
    <Panel className="bg-[#060a14] border-slate-800/80 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">SCENARIO PROGRESSION</h3>
        
        {hasExploredAll ? (
          <div className="text-right max-w-[280px]">
            <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-1"><CheckCircle2 size={12}/> CORE SCENARIO LIBRARY EXPLORED</div>
            <p className="text-[10px] text-slate-400">You have practiced across the available fictional scenarios. Continue with reinforcement, challenge mode, replay comparison, or lower-mastery skills.</p>
          </div>
        ) : hasHistory && (
          <div className="text-right max-w-[280px]">
            <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-1"><AlertCircle size={12}/> {guidance.title}</div>
            <p className="text-[10px] text-slate-400">{guidance.text}</p>
          </div>
        )}
      </div>
      
      <div className="space-y-8">
        {DIFFICULTY_ORDER.map(difficulty => {
          const scenarios = scenariosByDifficulty[difficulty] || [];
          if (scenarios.length === 0) return null;
          
          return (
            <div key={difficulty}>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800/50 pb-2">
                {difficulty}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.map(scenario => {
                  const status = getScenarioStatus(scenario.id);
                  const isRecommended = status === 'RECOMMENDED';
                  const isPracticed = status === 'PRACTICED';
                  const isInPractice = status === 'IN PRACTICE';
                  
                  const hasReplay = history.some(r => r.scenarioId === scenario.id && r.runType === 'REPLAY');
                  
                  return (
                    <div key={scenario.id} className={`p-4 rounded-lg border flex flex-col justify-between ${
                      isRecommended ? 'bg-cyan-950/20 border-cyan-900/50' : 
                      isPracticed ? 'bg-slate-900/30 border-slate-800' :
                      isInPractice ? 'bg-amber-950/10 border-amber-900/30' :
                      'bg-[#0b1120] border-slate-800/50 opacity-60 hover:opacity-100 transition-opacity'
                    }`}>
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-sm font-bold text-slate-200">{scenario.name}</h5>
                          <div className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                            isRecommended ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800' :
                            isPracticed ? 'text-green-500' :
                            isInPractice ? 'text-amber-500' :
                            'text-slate-500'
                          }`}>
                            {status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 mt-auto">
                        <Button 
                          variant={isRecommended ? 'primary' : 'ghost'} 
                          size="sm"
                          className={isRecommended ? '' : 'text-slate-400 hover:text-white bg-slate-800/30'}
                          onClick={() => navigate(`/simulation?scenario=${scenario.id}`)}
                        >
                          <Play size={12} className="mr-2" /> {isRecommended ? 'START SIMULATION' : 'LAUNCH'}
                        </Button>
                        
                        {hasReplay && (
                          <div className="mt-2 pt-2 border-t border-slate-800/50 text-[10px]">
                            <div className="flex items-center gap-2 text-violet-400 mb-2 font-medium tracking-wide">
                              <RotateCcw size={12} /> REPLAY AVAILABLE
                            </div>
                            <Button variant="ghost" size="sm" className="w-full text-[9px] text-slate-400" onClick={() => navigate('/history')}>
                              OPEN HISTORY
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
