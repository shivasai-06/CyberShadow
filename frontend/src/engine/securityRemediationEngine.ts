import type { SecurityFinding } from '../types/security-analysis';
import type { RemediationAction } from '../types/security-remediation';
import type { HistoryRecord } from '../types/history';

interface RemediationMapping {
  title: string;
  description: string;
  relatedControl: string;
  relatedScenarioId: string;
}

const FINDING_TO_REMEDIATION: Record<string, RemediationMapping> = {
  'Phishing Exposure': {
    title: 'Practice Phishing Verification',
    description: 'The simulation demonstrated how credential exposure can lead to account takeover. Practice identifying and verifying unexpected requests.',
    relatedControl: 'Security Awareness',
    relatedScenarioId: 'sc_phishing'
  },
  'Authentication Weakness': {
    title: 'Strengthen Authentication Protection',
    description: 'Lack of strong authentication allowed exposed credentials to be used for account takeover. Enable MFA and enforce strong passwords.',
    relatedControl: 'MFA',
    relatedScenarioId: 'sc_phishing' // also sc_password, handled below dynamically if needed, but mostly phishing
  },
  'Endpoint Vulnerability': {
    title: 'Secure Endpoint and Attachments',
    description: 'A malicious attachment was executed. Enable Automatic Updates and practice safe attachment handling.',
    relatedControl: 'Automatic Updates',
    relatedScenarioId: 'sc_attachment'
  },
  'Cloud Data Exposure': {
    title: 'Review Simulated Privacy Controls',
    description: 'Cloud storage was left open to public access. Enable Privacy controls to audit and restrict public access.',
    relatedControl: 'Privacy',
    relatedScenarioId: 'sc_cloud'
  },
  'Social Engineering Vulnerability': {
    title: 'Enhance Social Engineering Defenses',
    description: 'The user complied with a fraudulent request. Practice verifying urgent requests out-of-band.',
    relatedControl: 'Security Awareness',
    relatedScenarioId: 'sc_social'
  },
  'Data Loss Risk': {
    title: 'Implement Backup & Recovery',
    description: 'Simulated data was permanently lost due to a destructive attack. Maintain offline or immutable backups.',
    relatedControl: 'Backup',
    relatedScenarioId: 'sc_ransomware'
  }
};

/**
 * Deterministically creates a RemediationAction from a SecurityFinding.
 * Returns null if no mapping exists for the finding title.
 */
export function createRemediationFromFinding(finding: SecurityFinding): Omit<RemediationAction, 'status' | 'createdAt' | 'id'> | null {
  // Special case for Authentication Weakness from sc_password
  let mapping = FINDING_TO_REMEDIATION[finding.title];
  
  if (finding.title === 'Authentication Weakness' && finding.cause.includes('Password strength')) {
    mapping = {
      title: 'Practice Password Security',
      description: 'A weak password was easily guessed. Use strong, unique passwords and enable Password Strength controls.',
      relatedControl: 'Password Strength',
      relatedScenarioId: 'sc_password'
    };
  }

  if (!mapping) {
    return null; // No remediation mapping defined
  }

  return {
    findingId: finding.id,
    findingTitle: finding.title,
    title: mapping.title,
    description: mapping.description,
    relatedControl: mapping.relatedControl,
    relatedScenarioId: mapping.relatedScenarioId,
    affectedAsset: finding.affectedAsset,
    source: 'simulation'
  };
}

/**
 * Evaluates completed simulation records against open remediations.
 * Returns the list of remediations with updated statuses.
 */
export function validateRemediations(
  remediations: RemediationAction[],
  historyRecords: HistoryRecord[]
): RemediationAction[] {
  // Create a copy to update
  return remediations.map(rem => {
    if (rem.status === 'VALIDATED') {
      return rem; // Already validated
    }

    // Find any completed record matching the related scenario that occurred AFTER the remediation was created
    const createdTime = new Date(rem.createdAt).getTime();
    
    // Sort records newest first
    const sortedRecords = [...historyRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const record of sortedRecords) {
      const recordTime = new Date(record.date).getTime();
      if (recordTime <= createdTime) continue; // Only care about simulations after finding
      
      if (record.scenarioId === rem.relatedScenarioId) {
        // Did it succeed?
        // Note: For Data Loss, 'DATA RECOVERED' is a success. Otherwise 'ATTACK BLOCKED' is success.
        const isSuccess = record.result === 'ATTACK BLOCKED' || record.result === 'DATA RECOVERED';
        
        // Did they use the related control?
        const usedControl = 
          record.controlResponsible?.toLowerCase() === rem.relatedControl.toLowerCase().replace(' ', '_') || 
          record.defensesActive.some(d => d.toUpperCase() === rem.relatedControl.toUpperCase()) ||
          (rem.relatedControl === 'Security Awareness' && record.decisionsMade?.some(d => d.isProtective));
          
        if (isSuccess && usedControl) {
          // Validated!
          return {
            ...rem,
            status: 'VALIDATED',
            validatedAt: record.date,
            validationRunId: record.id
          };
        } else {
          // They tried, but failed, or didn't use the right control
          return {
            ...rem,
            status: 'IN_PROGRESS'
          };
        }
      }
    }
    
    return rem;
  });
}
