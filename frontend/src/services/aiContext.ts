import type { AIAgentContext } from '../types/ai';
import type { HistoryRecord } from '../types/history';
import type { LearningProfile, PracticeRecommendation } from '../types/learning';
import type { ScenarioDefinition } from '../types/scenarios';
import type { AppSettings } from '../types/settings';

export function buildAIAgentContext(
  settings?: AppSettings,
  learningProfile?: LearningProfile,
  history?: HistoryRecord[],
  currentScenario?: ScenarioDefinition,
  recommendation?: PracticeRecommendation,
  currentSimulation?: Partial<HistoryRecord>
): AIAgentContext {
  const context: AIAgentContext = {};

  // Learner Context
  if (settings) {
    context.learner = {
      profile: "Alex Vance", // Fixed fictional persona
      experienceLevel: settings.learning.difficulty,
      learningMode: settings.learning.mode
    };
  }

  // Current Scenario Context
  if (currentScenario) {
    context.currentScenario = {
      id: currentScenario.id,
      title: currentScenario.title,
      category: currentScenario.category,
      difficulty: currentScenario.difficulty
    };
  }

  // Current Simulation Context
  if (currentSimulation) {
    context.currentSimulation = {
      outcome: currentSimulation.result,
      protectiveDecisions: currentSimulation.protectiveDecisions,
      riskyDecisions: currentSimulation.riskyDecisions,
      skillsPracticed: currentSimulation.skillsPracticed,
      defensesActive: currentSimulation.defensesActive
    };
  }

  // Learning Context
  if (learningProfile) {
    const sortedSkills = Object.values(learningProfile.skills).sort((a, b) => b.mastery - a.mastery);
    context.learning = {
      overallMastery: learningProfile.overallMastery,
      topSkills: sortedSkills.slice(0, 3).map(s => `${s.name} (${Math.round(s.mastery)})`),
      weakSkills: sortedSkills.slice().reverse().slice(0, 3).map(s => `${s.name} (${Math.round(s.mastery)})`)
    };
  }

  // Recommendations
  if (recommendation) {
    context.recommendations = {
      recommendedNextPractice: recommendation.scenarioTitle,
      recommendedReason: recommendation.reason,
      recommendedDifficulty: recommendation.recommendedDifficulty
    };
  }

  // Recent History
  if (history && history.length > 0) {
    context.recentHistory = history.slice(0, 3).map(h => ({
      scenarioName: h.scenarioName,
      difficulty: h.difficulty,
      result: h.result,
      risk: h.risk
    }));
  }

  return context;
}
