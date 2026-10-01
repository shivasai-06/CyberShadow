import type { SecurityLearningImpact } from '../types/security-learning';
import type { SecurityPracticeTask } from '../types/security-practice';

// Hardcoded deterministic practice mappings based on skill mapping
const PRACTICE_TEMPLATES: Record<string, Partial<SecurityPracticeTask>> = {
  'phishing_awareness': {
    title: 'Identify the Phishing Red Flags',
    objective: 'Identify which characteristics of a fictional message indicate a phishing attempt.',
    question: 'A fictional employee receives an urgent email demanding credential verification via a link. What is the most appropriate fictional defensive action?',
    options: [
      { id: 'a', text: 'Click the link to verify credentials.', isCorrect: false, explanation: 'Clicking unverified links leads to simulated compromise.' },
      { id: 'b', text: 'Report the email and do not click the link.', isCorrect: true, explanation: 'Reporting protects the fictional organization and avoids credential exposure.' },
      { id: 'c', text: 'Reply to the sender to ask if it is real.', isCorrect: false, explanation: 'Replying confirms an active email address to the simulated attacker.' },
      { id: 'd', text: 'Forward it to all colleagues for awareness.', isCorrect: false, explanation: 'Forwarding spreads the fictional threat.' }
    ],
    difficulty: 'BEGINNER',
    practiceType: 'DECISION'
  },
  'authentication_security': {
    title: 'Choose the Stronger Authentication Defense',
    objective: 'Choose the appropriate fictional security control for preventing an account takeover.',
    question: 'A fictional employee receives an unexpected login request after entering credentials into a simulated phishing page. Which control would provide an additional protection layer?',
    options: [
      { id: 'a', text: 'Disable backups', isCorrect: false, explanation: 'Backups do not prevent authentication attacks.' },
      { id: 'b', text: 'Enable MFA', isCorrect: true, explanation: 'Multi-Factor Authentication adds a critical layer to block fictional account takeover even if credentials are exposed.' },
      { id: 'c', text: 'Disable security awareness', isCorrect: false, explanation: 'Security awareness is a defense, disabling it is harmful.' },
      { id: 'd', text: 'Remove password requirements', isCorrect: false, explanation: 'Removing password requirements weakens security.' }
    ],
    difficulty: 'INTERMEDIATE',
    practiceType: 'DECISION'
  },
  'password_security': {
    title: 'Evaluate Password Security',
    objective: 'Identify which fictional password configuration provides stronger protection.',
    question: 'Which of the following simulated password policies is most resilient to a fictional brute-force attack?',
    options: [
      { id: 'a', text: '8 characters, lowercase only.', isCorrect: false, explanation: 'Weak and easily brute-forced in simulations.' },
      { id: 'b', text: '16 characters, mixed case, numbers, and symbols.', isCorrect: true, explanation: 'Length and complexity increase the computational difficulty of simulated brute-force.' },
      { id: 'c', text: 'Dictionary words only.', isCorrect: false, explanation: 'Vulnerable to simulated dictionary attacks.' },
      { id: 'd', text: 'No password, use only username.', isCorrect: false, explanation: 'Provides zero simulated protection.' }
    ],
    difficulty: 'BEGINNER',
    practiceType: 'IDENTIFICATION'
  },
  'cloud_security': {
    title: 'Review Simulated Cloud Exposure',
    objective: 'Identify which fictional privacy configuration reduces unnecessary data exposure.',
    question: 'In a fictional cloud environment, a storage bucket contains sensitive customer data. Which configuration prevents simulated unauthorized access?',
    options: [
      { id: 'a', text: 'Public Read/Write', isCorrect: false, explanation: 'Exposes data to any simulated actor.' },
      { id: 'b', text: 'Private (IAM Restricted)', isCorrect: true, explanation: 'Restricting access via IAM correctly limits fictional exposure.' },
      { id: 'c', text: 'Obscure bucket name', isCorrect: false, explanation: 'Security by obscurity is easily bypassed in simulations.' },
      { id: 'd', text: 'Public Read only', isCorrect: false, explanation: 'Still exposes the fictional sensitive data.' }
    ],
    difficulty: 'INTERMEDIATE',
    practiceType: 'DEFENSIVE_SCENARIO'
  },
  'social_engineering_defense': {
    title: 'Respond to a Social Engineering Attempt',
    objective: 'Choose the safest response to a fictional social-engineering scenario.',
    question: 'A simulated caller claims to be from IT and asks for a password to "fix an urgent issue." What is the best fictional response?',
    options: [
      { id: 'a', text: 'Provide the password to resolve the issue.', isCorrect: false, explanation: 'Leads directly to simulated credential exposure.' },
      { id: 'b', text: 'Refuse and hang up, then verify independently with IT.', isCorrect: true, explanation: 'Independent verification blocks the simulated social engineering path.' },
      { id: 'c', text: 'Ask them to email the request.', isCorrect: false, explanation: 'Still entertains the fictional attacker.' },
      { id: 'd', text: 'Give a fake password to trick them.', isCorrect: false, explanation: 'Unnecessary engagement in a simulated scenario.' }
    ],
    difficulty: 'BEGINNER',
    practiceType: 'DECISION'
  },
  'backup_recovery': {
    title: 'Choose the Correct Recovery Strategy',
    objective: 'Select the appropriate fictional backup/recovery response after simulated data loss.',
    question: 'A fictional ransomware attack has encrypted critical files. What is the most reliable simulated recovery method if a backup control is active?',
    options: [
      { id: 'a', text: 'Pay the fictional ransom.', isCorrect: false, explanation: 'Does not guarantee recovery and encourages further simulated attacks.' },
      { id: 'b', text: 'Restore from an isolated, offline backup.', isCorrect: true, explanation: 'Offline backups reliably restore data without paying the simulated ransom.' },
      { id: 'c', text: 'Restart the computer.', isCorrect: false, explanation: 'Does not decrypt simulated files.' },
      { id: 'd', text: 'Delete the encrypted files and start over.', isCorrect: false, explanation: 'Results in permanent simulated data loss.' }
    ],
    difficulty: 'INTERMEDIATE',
    practiceType: 'DEFENSIVE_SCENARIO'
  },
  'endpoint_security': {
    title: 'Endpoint Security Defense',
    objective: 'Select the appropriate control to block simulated malware.',
    question: 'A fictional user accidentally downloads a malicious attachment. What control provides the best simulated endpoint protection?',
    options: [
      { id: 'a', text: 'Automatic Updates (Patching)', isCorrect: true, explanation: 'Keeps systems resistant to known simulated exploits.' },
      { id: 'b', text: 'Changing the file extension', isCorrect: false, explanation: 'Does not block simulated execution.' },
      { id: 'c', text: 'Ignoring the file', isCorrect: false, explanation: 'Leaving malware on the system risks future simulated compromise.' },
      { id: 'd', text: 'Sending the file to IT via email', isCorrect: false, explanation: 'Spreads the simulated threat.' }
    ],
    difficulty: 'INTERMEDIATE',
    practiceType: 'DECISION'
  },
  'email_security': {
    title: 'Email Security Posture',
    objective: 'Identify best practices for simulated email defense.',
    question: 'Which of the following helps filter out simulated malicious emails before they reach the user?',
    options: [
      { id: 'a', text: 'Email Security Gateway', isCorrect: true, explanation: 'Blocks simulated threats at the network edge.' },
      { id: 'b', text: 'Strong Passwords', isCorrect: false, explanation: 'Protects authentication, not email delivery.' },
      { id: 'c', text: 'Disabling the internet', isCorrect: false, explanation: 'Impractical defensive strategy.' },
      { id: 'd', text: 'Opening all attachments carefully', isCorrect: false, explanation: 'Still relies on the user, risking simulated compromise.' }
    ],
    difficulty: 'BEGINNER',
    practiceType: 'IDENTIFICATION'
  },
  'privacy_protection': {
    title: 'Privacy Configuration',
    objective: 'Reduce unnecessary data exposure in a fictional environment.',
    question: 'To prevent simulated reconnaissance, how should a fictional digital profile be configured?',
    options: [
      { id: 'a', text: 'Public with all details', isCorrect: false, explanation: 'Maximizes simulated exposure.' },
      { id: 'b', text: 'Private with minimal necessary information', isCorrect: true, explanation: 'Minimizes the simulated attack surface.' },
      { id: 'c', text: 'Fake name but real address', isCorrect: false, explanation: 'Still exposes critical simulated data.' },
      { id: 'd', text: 'No profile at all', isCorrect: false, explanation: 'Impractical if the fictional scenario requires usage.' }
    ],
    difficulty: 'BEGINNER',
    practiceType: 'DECISION'
  },
  'security_awareness': {
    title: 'Apply Security Awareness',
    objective: 'Use security awareness to block a simulated attack path.',
    question: 'A simulated system popup claims you have a virus and provides a phone number. What is the correct awareness-driven action?',
    options: [
      { id: 'a', text: 'Call the number immediately.', isCorrect: false, explanation: 'Engages with the simulated scam.' },
      { id: 'b', text: 'Close the browser and run a legitimate antivirus scan.', isCorrect: true, explanation: 'Ignores the simulated lure and verifies system health safely.' },
      { id: 'c', text: 'Click the popup to learn more.', isCorrect: false, explanation: 'Risks downloading simulated malware.' },
      { id: 'd', text: 'Provide payment info to the popup.', isCorrect: false, explanation: 'Results in simulated financial compromise.' }
    ],
    difficulty: 'BEGINNER',
    practiceType: 'KNOWLEDGE_CHECK'
  }
};

export function generateAdaptivePractices(
  impacts: SecurityLearningImpact[],
  completedPractices: SecurityPracticeTask[]
): SecurityPracticeTask[] {
  const newPractices: SecurityPracticeTask[] = [];

  // Sort impacts to prioritize REINFORCE, then DEVELOPING. DEMONSTRATED optionally if needed, but skipped for now.
  const priorityOrder = { 'REINFORCE': 1, 'DEVELOPING': 2, 'DEMONSTRATED': 3, 'INSUFFICIENT_DATA': 4 };
  
  const sortedImpacts = [...impacts].sort((a, b) => priorityOrder[a.learningState] - priorityOrder[b.learningState]);

  for (const impact of sortedImpacts) {
    if (impact.learningState === 'INSUFFICIENT_DATA' || impact.learningState === 'DEMONSTRATED') {
      continue;
    }

    const template = PRACTICE_TEMPLATES[impact.skillId];
    if (!template) {
      // Fallback generic template if skill not found
      continue;
    }

    // Check if we already have an active or passed practice for this impact's exact remediation/skill
    const existing = completedPractices.find(p => p.source === impact.id);
    if (existing && (existing.status === 'AVAILABLE' || existing.result === 'PASSED')) {
      continue;
    }
    
    // Check if there is an uncompleted practice in newPractices for this skill already to avoid duplicates
    if (newPractices.find(p => p.skillId === impact.skillId)) {
        continue;
    }

    const task: SecurityPracticeTask = {
      id: `prac_${Date.now()}_${impact.id}`,
      skillId: impact.skillId,
      skillName: impact.skillName,
      category: 'ADAPTIVE_DEFENSE',
      scenarioId: impact.remediationId || 'unknown', // Storing remediationId or scenarioId as context
      scenarioName: `Related to ${impact.skillName}`,
      title: template.title || 'Security Practice',
      description: impact.explanation,
      objective: template.objective || 'Complete the defensive exercise.',
      difficulty: template.difficulty || 'BEGINNER',
      practiceType: template.practiceType || 'DECISION',
      status: 'AVAILABLE',
      source: impact.id,
      createdAt: new Date().toISOString(),
      question: template.question || '',
      options: template.options || []
    };

    newPractices.push(task);
  }

  return newPractices;
}
