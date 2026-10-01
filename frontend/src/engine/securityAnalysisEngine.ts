import type { HistoryRecord } from '../types/history';
import type { SecurityAnalysisResult, SecurityFinding, SecuritySeverity } from '../types/security-analysis';

export function runSecurityAnalysis(record: HistoryRecord): SecurityAnalysisResult {
  const findings: SecurityFinding[] = [];
  const positiveControls: string[] = [];
  const affectedAssets = new Set<string>();

  const isCompromised = record.result === 'SIMULATED COMPROMISE' || record.result === 'DATA LOSS';
  
  if (record.scenarioId === 'sc_phishing') {
    affectedAssets.add('Fictional User Account');
    if (isCompromised) {
      findings.push({
        id: `f_phish_${Date.now()}`,
        title: 'Phishing Exposure',
        description: 'The simulated user fell for a phishing email, exposing credentials.',
        severity: 'HIGH',
        category: 'SOCIAL ENGINEERING',
        affectedAsset: 'Fictional User Account',
        cause: 'The simulated user interacted with a malicious link.',
        impact: 'The phishing scenario reached simulated account takeover.',
        recommendation: 'Verify unexpected requests independently.',
        source: 'simulation'
      });
      if (!record.defensesActive.some(d => d.includes('MFA'))) {
        findings.push({
          id: `f_mfa_${Date.now()}`,
          title: 'Authentication Weakness',
          description: 'Lack of MFA allowed exposed credentials to be used for account takeover.',
          severity: 'HIGH',
          category: 'IDENTITY SECURITY',
          affectedAsset: 'Fictional User Account',
          cause: 'MFA was disabled during the simulation.',
          impact: 'The simulated adversary successfully logged in with stolen credentials.',
          recommendation: 'Enable MFA to add an additional authentication barrier.',
          source: 'simulation'
        });
      }
    } else {
      if (record.controlResponsible === 'mfa' || record.defensesActive.some(d => d.includes('MFA'))) {
        positiveControls.push('MFA blocked simulated account takeover');
      }
      if (record.decisionsMade?.some(d => d.isProtective)) {
        positiveControls.push('Verification prevented simulated phishing impact');
      }
    }
  } else if (record.scenarioId === 'sc_attachment') {
    affectedAssets.add('Laptop');
    if (isCompromised) {
      findings.push({
        id: `f_attach_${Date.now()}`,
        title: 'Endpoint Vulnerability',
        description: 'A malicious attachment was executed on the endpoint.',
        severity: 'HIGH',
        category: 'ENDPOINT SECURITY',
        affectedAsset: 'Laptop',
        cause: 'The user opened an unknown attachment and updates were missing.',
        impact: 'The simulated malware achieved persistence on the endpoint.',
        recommendation: 'Enable Automatic Updates and report suspicious files.',
        source: 'simulation'
      });
    } else {
      if (record.controlResponsible === 'automatic_updates' || record.defensesActive.some(d => d.includes('AUTOMATIC UPDATES'))) {
        positiveControls.push('Automatic Updates blocked the simulated exploit');
      }
      if (record.decisionsMade?.some(d => d.isProtective) || record.controlResponsible === 'security_awareness' || record.defensesActive.some(d => d.includes('SECURITY AWARENESS'))) {
        positiveControls.push('Security Awareness prevented the simulated attachment impact');
      }
    }
  } else if (record.scenarioId === 'sc_password') {
    affectedAssets.add('Fictional User Account');
    if (isCompromised) {
      findings.push({
        id: `f_pwd_${Date.now()}`,
        title: 'Authentication Weakness',
        description: 'A weak password was easily guessed by the simulated adversary.',
        severity: 'HIGH',
        category: 'IDENTITY SECURITY',
        affectedAsset: 'Fictional User Account',
        cause: 'Password strength control was disabled or a weak password was chosen.',
        impact: 'The simulated account was compromised via brute force.',
        recommendation: 'Use strong, unique passwords and enable Password Strength controls.',
        source: 'simulation'
      });
    } else {
      if (record.controlResponsible === 'password_strength' || record.defensesActive.some(d => d.includes('PASSWORD STRENGTH'))) {
         positiveControls.push('Password Strength reduced simulated credential exposure');
      }
      if (record.decisionsMade?.some(d => d.isProtective)) {
        positiveControls.push('Strong password decision prevented brute force');
      }
    }
  } else if (record.scenarioId === 'sc_cloud') {
    affectedAssets.add('Cloud Storage');
    if (isCompromised) {
      findings.push({
        id: `f_cloud_${Date.now()}`,
        title: 'Cloud Data Exposure',
        description: 'Cloud storage was left open to public access.',
        severity: 'CRITICAL',
        category: 'CLOUD SECURITY',
        affectedAsset: 'Cloud Storage',
        cause: 'Privacy/access controls were disabled or misconfigured.',
        impact: 'Sensitive fictional data was discovered and downloaded.',
        recommendation: 'Enable Privacy controls to audit and restrict public access.',
        source: 'simulation'
      });
    } else {
      if (record.controlResponsible === 'privacy' || record.defensesActive.some(d => d.includes('PRIVACY')) || record.decisionsMade?.some(d => d.isProtective)) {
        positiveControls.push('Privacy controls prevented simulated cloud exposure');
      }
    }
  } else if (record.scenarioId === 'sc_social') {
    affectedAssets.add('Fictional User Account');
    if (isCompromised) {
      findings.push({
        id: `f_social_${Date.now()}`,
        title: 'Social Engineering Vulnerability',
        description: 'The user complied with a fraudulent request.',
        severity: 'HIGH',
        category: 'SOCIAL ENGINEERING',
        affectedAsset: 'Fictional User Account',
        cause: 'The user authorized a fraudulent transaction based on a personalized lure.',
        impact: 'The simulated social engineering attack bypassed technical controls.',
        recommendation: 'Verify urgent requests out-of-band and minimize public information.',
        source: 'simulation'
      });
    } else {
      if (record.controlResponsible === 'privacy' || record.defensesActive.some(d => d.includes('PRIVACY'))) {
        positiveControls.push('Privacy controls limited reconnaissance');
      }
      if (record.decisionsMade?.some(d => d.isProtective) || record.controlResponsible === 'security_awareness' || record.defensesActive.some(d => d.includes('SECURITY AWARENESS'))) {
        positiveControls.push('Verification prevented simulated social engineering impact');
      }
    }
  } else if (record.scenarioId === 'sc_ransomware') {
    affectedAssets.add('Laptop');
    if (isCompromised) {
      findings.push({
        id: `f_loss_${Date.now()}`,
        title: 'Data Loss Risk',
        description: 'Fictional data was permanently lost due to a destructive attack.',
        severity: 'CRITICAL',
        category: 'ENDPOINT SECURITY',
        affectedAsset: 'Laptop',
        cause: 'No backup strategy was implemented.',
        impact: 'Simulated data was encrypted and could not be recovered.',
        recommendation: 'Maintain offline or immutable backups.',
        source: 'simulation'
      });
    } else if (record.result === 'DATA RECOVERED' || record.controlResponsible === 'backup' || record.defensesActive.some(d => d.includes('BACKUP')) || record.decisionsMade?.some(d => d.isProtective)) {
      positiveControls.push('Backup enabled simulated recovery');
    }
  }

  let overallSeverity: SecuritySeverity = 'LOW';
  
  if (findings.length > 0) {
    const severities = findings.map(f => f.severity);
    if (severities.includes('CRITICAL')) overallSeverity = 'CRITICAL';
    else if (severities.includes('HIGH')) overallSeverity = 'HIGH';
    else if (severities.includes('MEDIUM')) overallSeverity = 'MEDIUM';
    else overallSeverity = 'LOW';
  }

  let summary = '';
  if (findings.length === 0) {
    summary = 'The simulation demonstrated effective defensive control(s). No simulated vulnerabilities were successfully exploited.';
  } else {
    summary = `The simulation identified ${findings.length} potential security weakness(es) leading to simulated compromise.`;
  }

  return {
    findings,
    overallSeverity,
    affectedAssets: Array.from(affectedAssets),
    positiveControls: Array.from(new Set(positiveControls)),
    summary
  };
}
