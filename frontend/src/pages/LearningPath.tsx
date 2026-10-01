import { useCyberShadow } from '../contexts/CyberShadowContext';
import { generatePracticeRecommendations } from '../engine/recommendationEngine';
import { LearningPathHeader } from '../components/learning-path/LearningPathHeader';
import { CurrentFocus } from '../components/learning-path/CurrentFocus';
import { NextSimulationCard } from '../components/learning-path/NextSimulationCard';
import { MasteryProgression } from '../components/learning-path/MasteryProgression';
import { SkillProgressGrid } from '../components/learning-path/SkillProgressGrid';
import { CategoryProgress } from '../components/learning-path/CategoryProgress';
import { ScenarioProgression } from '../components/learning-path/ScenarioProgression';
import { RemediationPrompt } from '../components/learning-path/RemediationPrompt';
import { SecurityLearningSignals } from '../components/learning-path/SecurityLearningSignals';
import { SecurityPracticeCard } from '../components/security-practice/SecurityPracticeCard';

export function LearningPath() {
  const { learningProfile, history, remediations, securityPractices } = useCyberShadow();
  
  const openCount = remediations.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length;
  
  // Generate recommendations to drive Current Focus and Next Simulation
  const recommendations = generatePracticeRecommendations(learningProfile, history);
  const primaryRecommendation = recommendations[0];
  
  const recommendedPractice = securityPractices.find(p => p.status === 'AVAILABLE');

  return (
    <div className="space-y-8 pb-12 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <LearningPathHeader />
      
      {!primaryRecommendation ? (
        <div className="p-8 text-center text-slate-400 bg-[#0b1120] rounded border border-slate-800">
          Complete a simulation to see your personalized learning path.
        </div>
      ) : (
        <>
          <RemediationPrompt openCount={openCount} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CurrentFocus recommendation={primaryRecommendation} profile={learningProfile} />
            <NextSimulationCard recommendation={primaryRecommendation} />
          </div>

          <MasteryProgression />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SkillProgressGrid profile={learningProfile} />
              <SecurityLearningSignals />
              {recommendedPractice && (
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">ADAPTIVE PRACTICE</h3>
                  <SecurityPracticeCard practice={recommendedPractice} />
                </div>
              )}
              <ScenarioProgression history={history} primaryRecommendation={primaryRecommendation} />
            </div>
            
            <div className="lg:col-span-1">
              <CategoryProgress profile={learningProfile} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
