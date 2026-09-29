import type { HistoryRecord, LearningProgressMetrics, LearningInsight } from '../types/history';

export const MOCK_HISTORY_RECORDS: HistoryRecord[] = [
  {
    id: 'hist_01',
    scenarioId: 'sc_01',
    scenarioName: 'PHISHING → ACCOUNT TAKEOVER',
    category: 'SOCIAL ENGINEERING',
    difficulty: 'BEGINNER',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    duration: '45s',
    result: 'ATTACK BLOCKED',
    risk: 'LOW',
    defensesActive: ['MFA ENABLED', 'Security Awareness ENABLED'],
    explanation: 'The simulated credential exposure reached an MFA checkpoint and the fictional attack path was stopped.',
    learningPoints: [
      'MFA prevented the simulated account takeover after credential exposure.',
      'A layered defense approach effectively mitigates single points of failure.',
      'The attack path was terminated early, minimizing potential impact.'
    ],
    attackPath: ['MESSAGE', 'USER INTERACTION', 'FAKE LOGIN', 'CREDENTIAL EXPOSURE', 'MFA CHALLENGE', 'ATTACK BLOCKED'],
    completedSteps: 6
  },
  {
    id: 'hist_02',
    scenarioId: 'sc_03',
    scenarioName: 'WEAK PASSWORD',
    category: 'IDENTITY',
    difficulty: 'BEGINNER',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    duration: '20s',
    result: 'SIMULATED COMPROMISE',
    risk: 'HIGH',
    defensesActive: ['MFA DISABLED'],
    explanation: 'The fictional attack path reached the account because the simulated identity lacked an additional authentication control and used easily guessed credentials.',
    learningPoints: [
      'Weak credentials allowed the fictional attack path to continue.',
      'Without MFA, brute force or credential guessing results in direct compromise.',
      'Identity security requires multiple strong authentication factors.'
    ],
    attackPath: ['WEAK PASSWORD', 'LOGIN ATTEMPT', 'AUTHENTICATION', 'ACCOUNT ACCESS', 'SIMULATED COMPROMISE'],
    completedSteps: 5
  },
  {
    id: 'hist_03',
    scenarioId: 'sc_02',
    scenarioName: 'MALICIOUS ATTACHMENT',
    category: 'ENDPOINT',
    difficulty: 'INTERMEDIATE',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    duration: '35s',
    result: 'ATTACK BLOCKED',
    risk: 'MEDIUM',
    defensesActive: ['Automatic Updates ENABLED', 'Endpoint Protection ENABLED'],
    explanation: 'The simulated endpoint protection quarantined the file before execution could complete, stopping the simulated payload.',
    learningPoints: [
      'Endpoint protection identified and blocked the simulated threat at the point of execution.',
      'Keeping systems patched reduces the likelihood of successful automated exploitation.',
      'Layered endpoint controls are critical when perimeter defenses are bypassed.'
    ],
    attackPath: ['EMAIL', 'ATTACHMENT', 'USER INTERACTION', 'ENDPOINT QUARANTINE', 'ATTACK BLOCKED'],
    completedSteps: 5
  }
];

export const MOCK_LEARNING_PROGRESS: LearningProgressMetrics = {
  simulationsCompleted: 12,
  scenariosExplored: 4,
  attacksBlocked: 8,
  learningObjectivesCompleted: 15,
  categoryProgress: [
    { category: 'IDENTITY', percentage: 80 },
    { category: 'SOCIAL ENGINEERING', percentage: 60 },
    { category: 'ENDPOINT', percentage: 40 },
    { category: 'CLOUD', percentage: 20 },
    { category: 'DATA', percentage: 0 }
  ]
};

export const MOCK_LEARNING_INSIGHTS: LearningInsight[] = [
  {
    id: 'ins_1',
    title: 'DEFENSE AWARENESS',
    description: 'You have explored how authentication controls affect simulated account attacks.'
  },
  {
    id: 'ins_2',
    title: 'SOCIAL ENGINEERING',
    description: 'You have completed multiple fictional phishing and social-engineering scenarios.'
  },
  {
    id: 'ins_3',
    title: 'DEFENSE EFFECTIVENESS',
    description: 'Your simulations demonstrate how changing security controls can change the simulated outcome.'
  }
];
