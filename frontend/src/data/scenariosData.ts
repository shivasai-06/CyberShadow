import type { ScenarioDefinition } from '../types/scenarios';

export const MOCK_SCENARIOS_DATA: ScenarioDefinition[] = [
  {
    id: 'sc_01',
    title: 'PHISHING → ACCOUNT TAKEOVER',
    category: 'SOCIAL ENGINEERING',
    difficulty: 'BEGINNER',
    description: 'Explore how a fictional phishing message can lead to credential exposure and account compromise when defensive controls are weak.',
    attackPath: ['MESSAGE', 'USER INTERACTION', 'FAKE LOGIN', 'CREDENTIAL EXPOSURE', 'ACCOUNT TAKEOVER'],
    affectedAssets: [{ name: 'Email' }, { name: 'Identity' }, { name: 'Cloud Account' }],
    defensiveControls: [
      { name: 'MFA', description: 'Adds an additional fictional authentication checkpoint to the simulation.' },
      { name: 'Security Awareness', description: 'Simulates training that reduces the likelihood of user interaction.' },
      { name: 'Password Strength', description: 'Requires complex passwords, mitigating simple brute force.' }
    ],
    learningObjectives: [
      { id: 'l1', title: 'RECOGNIZE THE ATTACK PATH', description: 'See how social engineering leads to technical compromise.' },
      { id: 'l2', title: 'IDENTIFY THE WEAK POINT', description: 'Understand that credential exposure is the critical junction.' },
      { id: 'l3', title: 'UNDERSTAND HOW DEFENSE CHANGES THE OUTCOME', description: 'Observe how MFA blocks access even if a password is stolen.' }
    ],
    simulationOutcome: 'Without MFA, the attack succeeds. With MFA, it is blocked.'
  },
  {
    id: 'sc_02',
    title: 'MALICIOUS ATTACHMENT',
    category: 'ENDPOINT',
    difficulty: 'INTERMEDIATE',
    description: 'Explore a fictional attachment scenario and understand how endpoint defenses can change the simulated outcome.',
    attackPath: ['EMAIL', 'ATTACHMENT', 'USER INTERACTION', 'ENDPOINT EXPOSURE', 'SIMULATED IMPACT'],
    affectedAssets: [{ name: 'Email' }, { name: 'Laptop' }, { name: 'Identity' }],
    defensiveControls: [
      { name: 'Automatic Updates', description: 'Simulates a patched environment resisting known exploits.' },
      { name: 'Security Awareness', description: 'Simulates user caution regarding unexpected attachments.' },
      { name: 'Endpoint Protection', description: 'Simulates anti-malware actively blocking file execution.' }
    ],
    learningObjectives: [
      { id: 'l1', title: 'UNDERSTAND DELIVERY MECHANISMS', description: 'See how email attachments can bypass network perimeter defenses.' },
      { id: 'l2', title: 'OBSERVE ENDPOINT EXPOSURE', description: 'Watch the simulated progression from download to execution.' },
      { id: 'l3', title: 'EVALUATE ENDPOINT CONTROLS', description: 'Learn how execution controls can stop the threat locally.' }
    ],
    simulationOutcome: 'Without endpoint protection, the simulated malware executes. With it, the payload is quarantined.'
  },
  {
    id: 'sc_03',
    title: 'WEAK PASSWORD',
    category: 'IDENTITY',
    difficulty: 'BEGINNER',
    description: 'Understand how weak authentication choices can increase the simulated risk of account compromise.',
    attackPath: ['WEAK PASSWORD', 'LOGIN ATTEMPT', 'AUTHENTICATION', 'ACCOUNT ACCESS', 'SIMULATED COMPROMISE'],
    affectedAssets: [{ name: 'Identity' }, { name: 'Cloud Account' }],
    defensiveControls: [
      { name: 'Password Strength', description: 'Enforces complexity and length requirements.' },
      { name: 'MFA', description: 'Adds an additional fictional authentication checkpoint.' },
      { name: 'Security Awareness', description: 'Simulates user knowledge of password best practices.' }
    ],
    learningObjectives: [
      { id: 'l1', title: 'RECOGNIZE AUTHENTICATION RISKS', description: 'Understand how easily guessable passwords lead to direct access.' },
      { id: 'l2', title: 'IDENTIFY MITIGATION STRATEGIES', description: 'Learn how complexity and secondary factors mitigate the risk.' },
      { id: 'l3', title: 'OBSERVE SIMULATED COMPROMISE', description: 'Watch how quickly a brute force attack can succeed.' }
    ],
    simulationOutcome: 'A weak password leads to rapid fictional compromise unless MFA is active.'
  },
  {
    id: 'sc_04',
    title: 'CLOUD DATA EXPOSURE',
    category: 'CLOUD',
    difficulty: 'INTERMEDIATE',
    description: 'Explore how a fictional cloud configuration weakness can expose simulated data.',
    attackPath: ['CONFIGURATION', 'EXPOSURE', 'DATA ACCESS', 'SIMULATED DATA EXPOSURE'],
    affectedAssets: [{ name: 'Cloud Storage' }, { name: 'Identity' }],
    defensiveControls: [
      { name: 'Privacy', description: 'Simulates data minimization and obfuscation policies.' },
      { name: 'Access Controls', description: 'Simulates strict IAM and bucket policies.' },
      { name: 'Backup', description: 'Provides resilience against data destruction or ransomware.' }
    ],
    learningObjectives: [
      { id: 'l1', title: 'IDENTIFY MISCONFIGURATIONS', description: 'Understand how simple settings can expose entire buckets.' },
      { id: 'l2', title: 'RECOGNIZE IMPACT', description: 'See how exposed data can be accessed without authentication.' },
      { id: 'l3', title: 'APPLY ACCESS CONTROLS', description: 'Learn how proper permissions block unauthorized reads.' }
    ],
    simulationOutcome: 'Misconfigured buckets expose data globally. Strict IAM rules block unauthorized simulated access.'
  },
  {
    id: 'sc_05',
    title: 'SOCIAL ENGINEERING',
    category: 'SOCIAL ENGINEERING',
    difficulty: 'INTERMEDIATE',
    description: 'Experience a fictional social-engineering scenario and examine how human awareness changes the simulation.',
    attackPath: ['SOCIAL MESSAGE', 'USER TRUST', 'INTERACTION', 'INFORMATION EXPOSURE', 'SIMULATED IMPACT'],
    affectedAssets: [{ name: 'Social Account' }, { name: 'Identity' }, { name: 'Email' }],
    defensiveControls: [
      { name: 'Security Awareness', description: 'Simulates an alert user recognizing manipulative tactics.' },
      { name: 'MFA', description: 'Protects the underlying account if information is exposed.' },
      { name: 'Privacy', description: 'Limits public information used for targeting.' }
    ],
    learningObjectives: [
      { id: 'l1', title: 'UNDERSTAND MANIPULATION', description: 'See how trust is leveraged in a simulated attack.' },
      { id: 'l2', title: 'IDENTIFY TARGETING', description: 'Learn how public information enables tailored attacks.' },
      { id: 'l3', title: 'EVALUATE HUMAN FIREWALL', description: 'Observe how awareness training stops the attack early.' }
    ],
    simulationOutcome: 'Without awareness, the user yields info. With awareness, the interaction is terminated safely.'
  },
  {
    id: 'sc_06',
    title: 'DATA LOSS',
    category: 'DATA',
    difficulty: 'ADVANCED',
    description: 'Explore a fictional data-loss scenario and understand how backup and recovery controls change the simulated outcome.',
    attackPath: ['DATA EVENT', 'LOSS', 'RECOVERY CHECK', 'SIMULATED IMPACT'],
    affectedAssets: [{ name: 'Laptop' }, { name: 'Cloud Storage' }, { name: 'Backup' }],
    defensiveControls: [
      { name: 'Backup', description: 'Simulates the presence of offline, immutable backups.' },
      { name: 'Privacy', description: 'Simulates data minimization to reduce exposure scope.' },
      { name: 'Automatic Updates', description: 'Simulates patching to prevent initial destructive malware.' }
    ],
    learningObjectives: [
      { id: 'l1', title: 'UNDERSTAND DESTRUCTIVE EVENTS', description: 'See how data can be lost due to malware or user error.' },
      { id: 'l2', title: 'EVALUATE RESILIENCE', description: 'Learn how backups provide a recovery path.' },
      { id: 'l3', title: 'OBSERVE RECOVERY', description: 'Watch the simulated recovery process restore operations.' }
    ],
    simulationOutcome: 'Without backups, data is permanently lost. With backups, a full recovery is simulated.'
  }
];
