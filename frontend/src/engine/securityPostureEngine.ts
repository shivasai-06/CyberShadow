import type { HistoryRecord } from '../types/history';
import type { SecurityPosture, DefenseCoverageItem, RecurringWeakness, SecurityTrend, DefenseStatus } from '../types/security-posture';
import { runSecurityAnalysis } from './securityAnalysisEngine';
import { createFindingInvestigation } from './securityInvestigationEngine';

const DEFENSE_CONTROLS = [
  { name: 'MFA', scenarios: ['sc_phishing'], skill: 'Authentication Security' },
  { name: 'Password Strength', scenarios: ['sc_password'], skill: 'Password Security' },
  { name: 'Automatic Updates', scenarios: ['sc_attachment'], skill: 'Endpoint Security' },
  { name: 'Backup', scenarios: ['sc_ransomware'], skill: 'Backup & Recovery' },
  { name: 'Privacy', scenarios: ['sc_cloud', 'sc_social'], skill: 'Cloud Security' }, // simplified
  { name: 'Security Awareness', scenarios: ['sc_phishing', 'sc_attachment', 'sc_social'], skill: 'Phishing Awareness' }
];

const SEVERITY_LEVELS: Record<string, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
};

export function buildSecurityPosture(historyRecords: HistoryRecord[]): SecurityPosture {
  let totalFindings = 0;
  const severityBreakdown = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  const categoryBreakdown: Record<string, number> = {};
  
  const weaknessMap: Record<string, RecurringWeakness> = {};
  const defenseMap: Record<string, { protected: number; vulnerable: number }> = {};
  
  DEFENSE_CONTROLS.forEach(d => {
    defenseMap[d.name] = { protected: 0, vulnerable: 0 };
  });

  const analyzedRecords = historyRecords.filter(r => r.result !== undefined); // Only valid completed records

  analyzedRecords.forEach(record => {
    // We derive analysis from the record deterministically
    let analysis;
    try {
      analysis = runSecurityAnalysis(record);
    } catch {
      // Safely ignore legacy records that cannot be analyzed (e.g., missing defensesActive array)
      return;
    }
    
    // Aggregate findings
    analysis.findings.forEach(finding => {
      totalFindings++;
      
      severityBreakdown[finding.severity]++;
      
      categoryBreakdown[finding.category] = (categoryBreakdown[finding.category] || 0) + 1;
      
      const investigation = createFindingInvestigation(finding);
      
      if (!weaknessMap[finding.title]) {
        weaknessMap[finding.title] = {
          id: finding.title.toLowerCase().replace(/\s+/g, '_'),
          title: finding.title,
          category: finding.category,
          occurrenceCount: 0,
          affectedAssets: [],
          highestSeverity: finding.severity,
          explanation: investigation.whyItMatters,
          relatedSkill: investigation.learningConnection,
          recommendedPractice: investigation.recommendedPractice
        };
      }
      
      const weakness = weaknessMap[finding.title];
      weakness.occurrenceCount++;
      if (!weakness.affectedAssets.includes(finding.affectedAsset)) {
        weakness.affectedAssets.push(finding.affectedAsset);
      }
      
      if (SEVERITY_LEVELS[finding.severity] > SEVERITY_LEVELS[weakness.highestSeverity]) {
        weakness.highestSeverity = finding.severity;
      }
    });
    
    // Map defenses based on the analysis or record
    // We can infer which defense was tested based on the scenario
    const scenarioControls = DEFENSE_CONTROLS.filter(d => d.scenarios.includes(record.scenarioId));
    
    scenarioControls.forEach(ctrl => {
      // Did it protect or was it vulnerable?
      const isProtected = analysis.positiveControls.some(pc => pc.toUpperCase().includes(ctrl.name.toUpperCase()));
      const isVulnerable = analysis.findings.length > 0; // if finding generated, the scenario was compromised
      
      if (isProtected) {
        defenseMap[ctrl.name].protected++;
      } else if (isVulnerable) {
        defenseMap[ctrl.name].vulnerable++;
      }
    });
    
    // Also capture explicitly mentioned positive controls that might not strictly match the scenario mapping
    analysis.positiveControls.forEach(pc => {
      const match = DEFENSE_CONTROLS.find(d => pc.toUpperCase().includes(d.name.toUpperCase()));
      if (match && !scenarioControls.includes(match)) {
        defenseMap[match.name].protected++;
      }
    });
  });

  // Calculate defense coverage array
  const defenseCoverage: DefenseCoverageItem[] = DEFENSE_CONTROLS.map(ctrl => {
    const data = defenseMap[ctrl.name];
    let status: DefenseStatus = 'NOT TESTED';
    
    if (data.protected === 0 && data.vulnerable === 0) {
      status = 'NOT TESTED';
    } else if (data.vulnerable >= 2 || (data.vulnerable > 0 && data.protected === 0)) {
      status = 'NEEDS PRACTICE';
    } else if (data.protected >= 2 && data.vulnerable === 0) {
      status = 'STRONG';
    } else {
      status = 'ACTIVE';
    }
    
    return {
      controlName: ctrl.name,
      relatedScenarios: ctrl.scenarios,
      protectedOutcomesObserved: data.protected,
      vulnerableOutcomesObserved: data.vulnerable,
      status,
      learningSkill: ctrl.skill
    };
  });

  // Filter weaknesses to those that are recurring (>= 2) or just keep all active
  const allWeaknesses = Object.values(weaknessMap).sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  const recurringWeaknesses = allWeaknesses.filter(w => w.occurrenceCount >= 2);
  const activeWeaknesses = allWeaknesses.length;

  // Calculate recent trend
  let recentTrend: SecurityTrend = 'INSUFFICIENT DATA';
  if (analyzedRecords.length >= 3) {
    // Sort by date (assuming historyRecords are newest first, if not we should sort, but history is usually newest first)
    const sorted = [...analyzedRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recent = sorted.slice(0, 3);
    const recentFindings = recent.reduce((sum, r) => {
      try { return sum + runSecurityAnalysis(r).findings.length; } catch { return sum; }
    }, 0);
    const recentProtected = recent.reduce((sum, r) => {
      try { return sum + runSecurityAnalysis(r).positiveControls.length; } catch { return sum; }
    }, 0);
    
    if (recentFindings === 0 && recentProtected > 0) {
      recentTrend = 'IMPROVING';
    } else if (recentFindings >= 3) {
      recentTrend = 'NEEDS PRACTICE';
    } else {
      recentTrend = 'MIXED';
    }
  }

  // Practice priorities
  const practicePriorities: string[] = [];
  recurringWeaknesses.slice(0, 2).forEach(w => {
    practicePriorities.push(`Reinforce ${w.relatedSkill} to mitigate ${w.title.toLowerCase()}`);
  });
  defenseCoverage.filter(d => d.status === 'NEEDS PRACTICE').forEach(d => {
    if (!practicePriorities.some(p => p.includes(d.learningSkill))) {
      practicePriorities.push(`Practice ${d.learningSkill} decisions`);
    }
  });

  return {
    totalAnalyzedSimulations: analyzedRecords.length,
    totalFindings,
    activeWeaknesses,
    recurringWeaknesses,
    defenseCoverage,
    severityBreakdown,
    categoryBreakdown,
    recentTrend,
    practicePriorities
  };
}
