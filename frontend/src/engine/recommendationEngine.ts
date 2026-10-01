import type { LearningProfile, PracticeRecommendation, SkillCategory } from '../types/learning';
import type { HistoryRecord } from '../types/history';
import type { SimulationScenario } from '../types/simulation';
import type { ScenarioDifficulty } from '../types/scenarios';
import { SIMULATION_SCENARIOS } from '../data/simulationScenarios';
import { SCENARIO_TO_SKILLS } from './learningEngine';

export function generatePracticeRecommendations(
  profile: LearningProfile,
  history: HistoryRecord[]
): PracticeRecommendation[] {
  const recommendations: PracticeRecommendation[] = [];
  const allSkills = Object.values(profile.skills);
  
  if (allSkills.length === 0 || profile.totalSimulations === 0) {
    // Empty/new learner state
    const startingScenario = SIMULATION_SCENARIOS[0];
    const startingSkillId = SCENARIO_TO_SKILLS[startingScenario.id]?.[0] || 'phishing_awareness';
    const startingSkill = profile.skills[startingSkillId];
    
    recommendations.push({
      scenarioId: startingScenario.id,
      scenarioTitle: startingScenario.name,
      reason: 'Complete a few simulations to build your personalized practice path.',
      targetSkillId: startingSkillId,
      targetSkillName: startingSkill?.name || 'Security Awareness',
      currentMastery: 0,
      recommendedDifficulty: 'BEGINNER',
      priority: 100,
      type: 'NEW_CATEGORY',
      suggestedAction: 'Start Learning Path'
    });
    
    return recommendations;
  }
  
  // Rule A — Weak skill
  const weakestSkill = [...allSkills]
    .filter(s => s.simulationsCompleted > 0)
    .sort((a, b) => a.mastery - b.mastery)[0];
    
  if (weakestSkill && weakestSkill.mastery < 50) {
    const targetScenarioId = getScenarioForSkill(weakestSkill.id);
    const targetScenario = SIMULATION_SCENARIOS.find((s: SimulationScenario) => s.id === targetScenarioId);
    
    if (targetScenario) {
      recommendations.push({
        scenarioId: targetScenario.id,
        scenarioTitle: targetScenario.name,
        reason: 'Your recent simulations show this skill needs more practice.',
        targetSkillId: weakestSkill.id,
        targetSkillName: weakestSkill.name,
        currentMastery: weakestSkill.mastery,
        recommendedDifficulty: 'BEGINNER', // fallback to Beginner for weak skill
        priority: 90,
        type: 'WEAK_SKILL',
        suggestedAction: 'Practice Next'
      });
    }
  }

  // Rule B — Repeated risky decisions
  const mostRiskySkill = [...allSkills]
    .filter(s => s.riskyDecisions > 0)
    .sort((a, b) => b.riskyDecisions - a.riskyDecisions)[0];
    
  if (mostRiskySkill && mostRiskySkill.riskyDecisions >= 2) {
    // Check if we didn't just recommend this exact scenario for rule A
    const targetScenarioId = getScenarioForSkill(mostRiskySkill.id);
    if (!recommendations.some(r => r.scenarioId === targetScenarioId)) {
      const targetScenario = SIMULATION_SCENARIOS.find((s: SimulationScenario) => s.id === targetScenarioId);
      if (targetScenario) {
        recommendations.push({
          scenarioId: targetScenario.id,
          scenarioTitle: targetScenario.name,
          reason: 'Repeated risky decisions detected in this area.',
          targetSkillId: mostRiskySkill.id,
          targetSkillName: mostRiskySkill.name,
          currentMastery: mostRiskySkill.mastery,
          recommendedDifficulty: 'BEGINNER',
          priority: 85,
          type: 'REPEAT_PRACTICE',
          suggestedAction: 'Reinforce'
        });
      }
    }
  }

  // Rule D — Category exploration
  const categoryPracticeCounts: Record<SkillCategory, number> = {
    'IDENTITY': 0,
    'SOCIAL ENGINEERING': 0,
    'ENDPOINT': 0,
    'CLOUD': 0,
    'RESILIENCE': 0
  };
  
  allSkills.forEach(s => {
    categoryPracticeCounts[s.category] += s.simulationsCompleted;
  });
  
  const underPracticedCategory = (Object.keys(categoryPracticeCounts) as SkillCategory[])
    .sort((a, b) => categoryPracticeCounts[a] - categoryPracticeCounts[b])[0];
    
  if (underPracticedCategory && categoryPracticeCounts[underPracticedCategory] === 0) {
    const unpracticedSkill = allSkills.find(s => s.category === underPracticedCategory);
    if (unpracticedSkill) {
      const targetScenarioId = getScenarioForSkill(unpracticedSkill.id);
      if (!recommendations.some(r => r.scenarioId === targetScenarioId)) {
        const targetScenario = SIMULATION_SCENARIOS.find((s: SimulationScenario) => s.id === targetScenarioId);
        if (targetScenario) {
          recommendations.push({
            scenarioId: targetScenario.id,
            scenarioTitle: targetScenario.name,
            reason: `${underPracticedCategory} is currently one of your least-practiced skills.`,
            targetSkillId: unpracticedSkill.id,
            targetSkillName: unpracticedSkill.name,
            currentMastery: unpracticedSkill.mastery,
            recommendedDifficulty: 'BEGINNER',
            priority: 70,
            type: 'NEW_CATEGORY',
            suggestedAction: 'Explore'
          });
        }
      }
    }
  }

  // Rule C — Successful practice (adaptive difficulty) & Rule E — Reinforcement
  const lastRecord = history[0];
  if (lastRecord) {
    const lastScenario = SIMULATION_SCENARIOS.find((s: SimulationScenario) => s.id === lastRecord.scenarioId);
    if (lastScenario && !recommendations.some(r => r.scenarioId === lastScenario.id)) {
      const relevantSkills = SCENARIO_TO_SKILLS[lastScenario.id] || [];
      const primarySkillId = relevantSkills[0];
      const primarySkill = profile.skills[primarySkillId];
      
      if (primarySkill) {
        if (lastRecord.protectiveDecisions && lastRecord.protectiveDecisions > 0 && (!lastRecord.riskyDecisions || lastRecord.riskyDecisions === 0)) {
          // Rule C
          const nextDifficulty = determineNextDifficulty(lastRecord.difficulty);
          if (nextDifficulty) {
             recommendations.push({
                scenarioId: lastScenario.id,
                scenarioTitle: lastScenario.name,
                reason: 'You consistently perform well here. Try a harder simulation.',
                targetSkillId: primarySkill.id,
                targetSkillName: primarySkill.name,
                currentMastery: primarySkill.mastery,
                recommendedDifficulty: nextDifficulty,
                priority: 80,
                type: 'NEXT_DIFFICULTY',
                suggestedAction: 'Challenge'
             });
          }
        } else if (lastRecord.riskyDecisions && lastRecord.riskyDecisions > 0) {
          // Rule E
          recommendations.push({
            scenarioId: lastScenario.id,
            scenarioTitle: lastScenario.name,
            reason: 'Performance was mixed. Recommend repeating this scenario to build confidence.',
            targetSkillId: primarySkill.id,
            targetSkillName: primarySkill.name,
            currentMastery: primarySkill.mastery,
            recommendedDifficulty: lastRecord.difficulty,
            priority: 75,
            type: 'REINFORCEMENT',
            suggestedAction: 'Reinforce'
          });
        }
      }
    }
  }

  // Fallback: recommend random unpracticed scenario
  if (recommendations.length < 3) {
    const unpracticedSkills = allSkills.filter(s => s.simulationsCompleted === 0);
    for (const skill of unpracticedSkills) {
      if (recommendations.length >= 3) break;
      const targetScenarioId = getScenarioForSkill(skill.id);
      if (!recommendations.some(r => r.scenarioId === targetScenarioId)) {
        const targetScenario = SIMULATION_SCENARIOS.find((s: SimulationScenario) => s.id === targetScenarioId);
        if (targetScenario) {
          recommendations.push({
            scenarioId: targetScenario.id,
            scenarioTitle: targetScenario.name,
            reason: 'This skill has not been practiced yet.',
            targetSkillId: skill.id,
            targetSkillName: skill.name,
            currentMastery: skill.mastery,
            recommendedDifficulty: 'BEGINNER',
            priority: 50,
            type: 'NEW_CATEGORY',
            suggestedAction: 'Explore'
          });
        }
      }
    }
  }

  return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 3);
}

function getScenarioForSkill(skillId: string): string {
  for (const [scenarioId, skills] of Object.entries(SCENARIO_TO_SKILLS)) {
    if (skills.includes(skillId)) {
      return scenarioId;
    }
  }
  return SIMULATION_SCENARIOS[0].id;
}

function determineNextDifficulty(current: ScenarioDifficulty): ScenarioDifficulty | null {
  if (current === 'BEGINNER') return 'INTERMEDIATE';
  if (current === 'INTERMEDIATE') return 'ADVANCED';
  return null; // Advanced is max
}
