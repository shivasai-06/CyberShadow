import type { SecurityFinding } from '../types/security-analysis';
import type { SecurityFindingInvestigation } from '../types/security-investigation';

export function createFindingInvestigation(finding: SecurityFinding): SecurityFindingInvestigation {
  let defense = '';
  let whyItMatters = '';
  let learningConnection = '';
  let recommendedPractice = finding.recommendation;

  if (finding.title === 'Phishing Exposure') {
    defense = 'Security Awareness training and verifying unexpected requests independently could have prevented the user from clicking the malicious link.';
    whyItMatters = 'Social engineering is a primary initial access vector. Even strong technical controls can be bypassed if users hand over credentials.';
    learningConnection = 'Phishing Awareness';
  } else if (finding.title === 'Authentication Weakness' && finding.category === 'SOCIAL ENGINEERING') { // wait, I set category to IDENTITY SECURITY for MFA in Phase 5.0
    // I'll just check title
  }
  
  if (finding.title === 'Authentication Weakness') {
    if (finding.cause.includes('MFA')) {
      defense = 'Multi-Factor Authentication (MFA) requires a second form of verification, blocking attackers even if they steal the password.';
      whyItMatters = 'Passwords are frequently exposed in breaches or through phishing. A second factor is the most effective way to secure an identity.';
      learningConnection = 'Authentication Security';
    } else {
      defense = 'Password Strength policies ensure that passwords cannot be easily guessed or brute-forced by automated tools.';
      whyItMatters = 'Weak passwords are the path of least resistance for attackers running automated credential stuffing or brute-force scripts.';
      learningConnection = 'Password Security';
    }
  } else if (finding.title === 'Endpoint Vulnerability') {
    defense = 'Automatic Updates patch known vulnerabilities, and endpoint security controls can prevent malicious attachments from executing.';
    whyItMatters = 'Endpoints are the frontline of defense. Unpatched vulnerabilities allow simple malware to gain a foothold and establish persistence.';
    learningConnection = 'Endpoint Security';
  } else if (finding.title === 'Cloud Data Exposure') {
    defense = 'Privacy and access controls restrict who can view cloud data, preventing public exposure.';
    whyItMatters = 'Cloud misconfigurations are discovered rapidly by automated scanners on the internet. Proper access controls are critical.';
    learningConnection = 'Cloud Security';
  } else if (finding.title === 'Social Engineering Vulnerability') {
    defense = 'Security Awareness, independent out-of-band verification, and Privacy controls (to limit reconnaissance) stop targeted attacks.';
    whyItMatters = 'Targeted social engineering exploits human trust and authority, completely bypassing traditional technical perimeters.';
    learningConnection = 'Social Engineering Defense';
  } else if (finding.title === 'Data Loss Risk') {
    defense = 'Offline, immutable Backups ensure that data can be recovered even if a destructive attack encrypts the primary systems.';
    whyItMatters = 'Ransomware and destructive attacks assume you have no other way to get your data back. Backups are the ultimate safety net.';
    learningConnection = 'Backup & Recovery';
  }

  return {
    finding,
    whatHappened: finding.description,
    whyItHappened: finding.cause,
    affectedAsset: finding.affectedAsset,
    impact: finding.impact,
    defense: defense || 'A relevant security control could have mitigated this.',
    whyItMatters: whyItMatters || 'Cybersecurity controls exist to reduce risk and protect assets.',
    learningConnection: learningConnection || 'Security Awareness',
    recommendedPractice
  };
}
