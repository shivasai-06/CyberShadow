import type { SimulationReportData } from '../types/reports';

export const MOCK_REPORT_DATA: SimulationReportData = {
  overview: {
    simulationsCompleted: 25,
    attacksBlocked: 18,
    simulatedCompromises: 7,
    scenariosExplored: 5,
    learningObjectives: 12
  },
  scenarioPerformance: [
    { scenarioName: 'Phishing → Account Takeover', simulations: 8, blocked: 6, compromised: 2 },
    { scenarioName: 'Weak Password', simulations: 5, blocked: 3, compromised: 2 },
    { scenarioName: 'Malicious Attachment', simulations: 6, blocked: 5, compromised: 1 },
    { scenarioName: 'Cloud Data Exposure', simulations: 3, blocked: 2, compromised: 1 },
    { scenarioName: 'Social Engineering', simulations: 3, blocked: 2, compromised: 1 }
  ],
  defenseImpacts: [
    {
      controlName: 'MFA',
      status: 'ENABLED',
      blockedCount: 7,
      explanation: 'In these fictional scenarios, MFA introduced an additional verification step that stopped the simulated account takeover path.'
    },
    {
      controlName: 'Password Strength',
      status: 'ENABLED',
      blockedCount: 4,
      explanation: 'Enforcing fictional password complexity mitigated the simulated brute-force attempts early in the attack path.'
    },
    {
      controlName: 'Automatic Updates',
      status: 'ENABLED',
      blockedCount: 3,
      explanation: 'Simulated endpoint updates prevented the execution of malicious payloads associated with attachment scenarios.'
    },
    {
      controlName: 'Security Awareness',
      status: 'ENABLED',
      blockedCount: 4,
      explanation: 'Simulated user awareness prevented the initial interaction with fictional social engineering traps.'
    }
  ],
  insights: [
    {
      id: 'i1',
      category: 'Identity Protection',
      description: 'Authentication controls significantly changed the simulated outcome in account-focused scenarios.'
    },
    {
      id: 'i2',
      category: 'Social Engineering',
      description: 'User interaction was a key transition point in several fictional attack paths.'
    },
    {
      id: 'i3',
      category: 'Endpoint Defense',
      description: 'Keeping simulated systems updated changed the outcome of selected attachment scenarios.'
    },
    {
      id: 'i4',
      category: 'Security Awareness',
      description: 'Recognizing suspicious behavior earlier shortened several simulated attack paths.'
    }
  ],
  attackPaths: [
    {
      id: 'p1',
      scenarioName: 'PHISHING',
      path: ['FAKE LOGIN', 'CREDENTIAL EXPOSURE', 'MFA'],
      blockedAt: 'MFA'
    },
    {
      id: 'p2',
      scenarioName: 'MALICIOUS ATTACHMENT',
      path: ['USER OPENS FILE', 'SIMULATED EXECUTION', 'AUTOMATIC UPDATES'],
      blockedAt: 'AUTOMATIC UPDATES'
    }
  ],
  recommendations: [
    {
      id: 'r1',
      title: 'Explore Identity Defense',
      description: 'Try additional account takeover scenarios and compare MFA enabled vs disabled.',
      actionText: 'EXPLORE SCENARIOS',
      route: '/scenarios'
    },
    {
      id: 'r2',
      title: 'Practice Defense Controls',
      description: 'Run the same simulation with different controls and compare the fictional outcomes.',
      actionText: 'RUN SIMULATION',
      route: '/simulation'
    }
  ]
};
