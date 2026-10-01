import type { LearningProfile, Skill, SimulationLearningUpdate } from '../types/learning';
import type { HistoryRecord, LearningInsight } from '../types/history';

export const INITIAL_SKILLS: Record<string, Skill> = {
  phishing_awareness: {
    id: 'phishing_awareness',
    name: 'Phishing Awareness',
    category: 'SOCIAL ENGINEERING',
    description: 'Identifying and responding to deceptive emails and messages.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  },
  authentication_security: {
    id: 'authentication_security',
    name: 'Authentication Security',
    category: 'IDENTITY',
    description: 'Securing identities through MFA and strong authentication mechanisms.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  },
  password_security: {
    id: 'password_security',
    name: 'Password Security',
    category: 'IDENTITY',
    description: 'Creating and managing strong, unique passwords.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  },
  email_security: {
    id: 'email_security',
    name: 'Email Security',
    category: 'ENDPOINT',
    description: 'Defending against malicious attachments and email-based threats.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  },
  endpoint_security: {
    id: 'endpoint_security',
    name: 'Endpoint Security',
    category: 'ENDPOINT',
    description: 'Protecting devices and endpoints from malware and unauthorized access.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  },
  cloud_security: {
    id: 'cloud_security',
    name: 'Cloud Security',
    category: 'CLOUD',
    description: 'Securing cloud resources and configuring proper access controls.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  },
  privacy_protection: {
    id: 'privacy_protection',
    name: 'Privacy Protection',
    category: 'CLOUD',
    description: 'Safeguarding sensitive data from unauthorized exposure.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  },
  social_engineering: {
    id: 'social_engineering',
    name: 'Social Engineering Defense',
    category: 'SOCIAL ENGINEERING',
    description: 'Recognizing and stopping psychological manipulation and fraud.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  },
  backup_recovery: {
    id: 'backup_recovery',
    name: 'Backup & Recovery',
    category: 'RESILIENCE',
    description: 'Maintaining robust backups and recovery strategies against data loss.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  },
  security_awareness: {
    id: 'security_awareness',
    name: 'Security Awareness',
    category: 'SOCIAL ENGINEERING',
    description: 'General vigilance and reporting of suspicious activities.',
    mastery: 0,
    simulationsCompleted: 0,
    successfulDefenses: 0,
    riskyDecisions: 0,
    recommendedDifficulty: 'Beginner'
  }
};

export function initializeLearningProfile(): LearningProfile {
  return {
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    overallMastery: 0,
    totalSimulations: 0
  };
}

export const SCENARIO_TO_SKILLS: Record<string, string[]> = {
  'sc_phishing': ['phishing_awareness', 'authentication_security', 'security_awareness'],
  'sc_attachment': ['email_security', 'endpoint_security', 'security_awareness'],
  'sc_password': ['password_security', 'authentication_security'],
  'sc_cloud': ['cloud_security', 'privacy_protection'],
  'sc_social': ['social_engineering', 'security_awareness', 'privacy_protection'],
  'sc_ransomware': ['backup_recovery', 'endpoint_security']
};

export function calculateMasteryChange(
  record: HistoryRecord
): number {
  let change = 0;
  
  // Base point for completion
  change += 2;
  
  // Difficulty multiplier logic could be used here. For simplicity:
  const diffMultiplier = record.difficulty === 'ADVANCED' ? 1.5 : (record.difficulty === 'INTERMEDIATE' ? 1.2 : 1.0);

  if (record.result === 'ATTACK BLOCKED' || record.result === 'DATA SECURED' || record.result === 'DATA RECOVERED' || record.result === 'PHISHING IDENTIFIED' || record.result === 'ATTACHMENT REPORTED' || record.result === 'SUCCESSFUL RESTORE') {
    change += 4 * diffMultiplier;
  }

  // Penalize or reward based on decisions
  if (record.protectiveDecisions && record.protectiveDecisions > 0) {
    change += (2 * record.protectiveDecisions * diffMultiplier);
  }
  
  if (record.riskyDecisions && record.riskyDecisions > 0) {
    // Risky decisions reduce the gain.
    change -= (3 * record.riskyDecisions);
  }

  // Ensure we don't go negative on a single update unless they really messed up? Let's just limit to min 0 gain, except if they did risky things maybe it drops by 1.
  // Actually, let's allow small negative changes for repeated risky decisions.
  change = Math.round(change);
  
  return change;
}

export function updateLearningProfile(
  profile: LearningProfile,
  record: HistoryRecord
): { newProfile: LearningProfile, update: SimulationLearningUpdate } {
  const newProfile = { ...profile, skills: { ...profile.skills } };
  newProfile.totalSimulations += 1;
  
  const relevantSkills = SCENARIO_TO_SKILLS[record.scenarioId] || [];
  const deltas = [];

  for (const skillId of relevantSkills) {
    if (!newProfile.skills[skillId]) continue;
    const skill = { ...newProfile.skills[skillId] };
    
    const change = calculateMasteryChange(record);
    const oldMastery = skill.mastery;
    skill.mastery = Math.max(0, Math.min(100, skill.mastery + change));
    
    // Update trend based on change
    if (change > 2) skill.trend = 'improving';
    else if (change < 0) skill.trend = 'needs practice';
    else skill.trend = 'stable';
    
    skill.simulationsCompleted += 1;
    if (record.result.includes('BLOCKED') || record.result.includes('SECURED') || record.result.includes('RECOVERED') || record.result.includes('IDENTIFIED') || record.result.includes('REPORTED')) {
      skill.successfulDefenses += 1;
    }
    if (record.riskyDecisions && record.riskyDecisions > 0) {
      skill.riskyDecisions += record.riskyDecisions;
    }
    
    skill.lastPracticed = record.date;
    
    newProfile.skills[skillId] = skill;
    deltas.push({ skillId, skillName: skill.name, masteryChange: skill.mastery - oldMastery });
  }

  // Recalculate overall mastery
  const allSkills = Object.values(newProfile.skills);
  const totalMastery = allSkills.reduce((sum, s) => sum + s.mastery, 0);
  newProfile.overallMastery = Math.round(totalMastery / allSkills.length);
  
  // Notice: practiceNext calculation is now moved out and will be done by recommendation engine separately or inside SimulationLab.
  // Actually, wait, `SimulationLearningUpdate` has `practiceNext?: PracticeRecommendation`. Let's populate it here using the new engine.
  // We need the full history for the recommendation engine, but here we only have the single record.
  // We can just omit practiceNext here and let SimulationLab set it, OR we can accept history here.
  // Let's pass history to updateLearningProfile or let SimulationLab handle the practiceNext.
  
  return { newProfile, update: { deltas } };
}

export function getMasteryLabel(mastery: number): string {
  if (mastery < 25) return 'INTRODUCED';
  if (mastery < 50) return 'DEVELOPING';
  if (mastery < 75) return 'PRACTICING';
  if (mastery < 90) return 'CONFIDENT';
  return 'STRONG';
}

export function generateLearningInsights(profile: LearningProfile): LearningInsight[] {
  const allSkills = Object.values(profile.skills);
  const insights: LearningInsight[] = [];
  
  if (allSkills.length === 0 || profile.totalSimulations === 0) {
    return insights;
  }
  
  // 1. Identify strongest skill
  const strongest = [...allSkills].sort((a, b) => b.mastery - a.mastery)[0];
  if (strongest && strongest.mastery >= 50) {
    insights.push({
      id: 'strength',
      title: 'Strong Skill Identified',
      description: `You have developed strong simulated mastery in ${strongest.name}. You consistently make protective decisions in this area.`
    });
  }

  // 2. Identify area needing improvement
  const weakest = [...allSkills]
    .filter(s => s.simulationsCompleted > 0)
    .sort((a, b) => {
      if (b.riskyDecisions !== a.riskyDecisions) return b.riskyDecisions - a.riskyDecisions;
      return a.mastery - b.mastery;
    })[0];
    
  if (weakest && (weakest.mastery < 40 || weakest.riskyDecisions > 0)) {
    insights.push({
      id: 'improvement',
      title: 'Area for Improvement',
      description: `Simulations indicate a need for more practice in ${weakest.name}. ${weakest.riskyDecisions > 0 ? 'Review your past risky decisions to understand the correct approach.' : 'Consider running simulations focused on this area.'}`
    });
  }
  
  // 3. Identify general trend
  const totalRisky = allSkills.reduce((sum, s) => sum + s.riskyDecisions, 0);
  const totalSims = profile.totalSimulations;
  
  if (totalRisky === 0 && totalSims >= 3) {
    insights.push({
      id: 'trend_good',
      title: 'Consistent Defense',
      description: 'You have shown excellent judgment by avoiding risky decisions across your recent simulations. Your proactive defense is strong.'
    });
  } else if (totalRisky > totalSims && totalSims > 0) {
    insights.push({
      id: 'trend_risky',
      title: 'High Risk Tolerance',
      description: 'You tend to make risky decisions during simulations, relying heavily on automated controls to save you. Try focusing more on proactive defense.'
    });
  } else if (insights.length < 3) {
    insights.push({
      id: 'progress',
      title: 'Steady Progress',
      description: 'You are making steady progress in your cybersecurity simulation training. Keep exploring different scenarios to build a robust skill set.'
    });
  }

  return insights.slice(0, 3);
}
