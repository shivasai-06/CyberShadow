import { useState } from 'react';
import { AlertCircle, Target, FileText, Crosshair, ChevronDown, ChevronUp, ShieldAlert, BookOpen } from 'lucide-react';
import { createFindingInvestigation } from '../../engine/securityInvestigationEngine';
import type { SecurityFinding, SecuritySeverity } from '../../types/security-analysis';
import type { ComprehensiveSimulationResult } from '../../types/results';
import { Panel } from '../ui/Panel';

export function FindingSeverityBadge({ severity }: { severity: SecuritySeverity }) {
  const styles: Record<SecuritySeverity, string> = {
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/20',
    HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    LOW: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[severity]}`}>
      {severity}
    </span>
  );
}

function SecurityFindingCard({ finding }: { finding: SecurityFinding }) {
  const [expanded, setExpanded] = useState(false);
  const investigation = createFindingInvestigation(finding);

  return (
    <div className="border border-slate-800/80 bg-slate-900/50 rounded-lg overflow-hidden transition-colors hover:border-slate-700/80">
      <div 
        className="p-4 cursor-pointer flex items-start gap-4" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mt-0.5 flex-shrink-0">
          <AlertCircle size={18} className="text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-1">
            <h4 className="text-sm font-medium text-slate-200 truncate">{finding.title}</h4>
            <FindingSeverityBadge severity={finding.severity} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Target size={12} className="text-slate-500" />
              {finding.affectedAsset}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText size={12} className="text-slate-500" />
              {finding.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Crosshair size={12} className="text-slate-500" />
              Source: {finding.source}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-slate-500 mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-800/50 bg-slate-900/30">
          <div className="mt-3 space-y-4">
            <div>
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</h5>
              <p className="text-sm text-slate-300 leading-relaxed">{finding.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Root Cause</h5>
                <p className="text-sm text-slate-300 leading-relaxed">{finding.cause}</p>
              </div>
              <div>
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Potential Impact</h5>
                <p className="text-sm text-slate-300 leading-relaxed">{finding.impact}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/50 pt-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert size={12} className="text-cyan-400" />
                  <h5 className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">Defense</h5>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{investigation.defense}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={12} className="text-violet-400" />
                  <h5 className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Why It Matters</h5>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{investigation.whyItMatters}</p>
              </div>
            </div>

            <div className="bg-[#0a0f1c] p-3 rounded border border-slate-800/50 flex justify-between items-center mt-2">
              <div>
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">LEARNING CONNECTION</h5>
                <p className="text-sm font-bold text-white">{investigation.learningConnection}</p>
              </div>
              <div className="text-right">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">RECOMMENDED ACTION</h5>
                <p className="text-sm font-medium text-cyan-400">{investigation.recommendedPractice}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SecurityFindings({ result }: { result: ComprehensiveSimulationResult | null }) {
  if (!result) {
    return (
      <Panel className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle size={32} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-medium text-slate-300 mb-1">No Results Available</h3>
        <p className="text-xs text-slate-500">Run a simulation to view security findings.</p>
      </Panel>
    );
  }

  const { analysis } = result;
  
  if (!analysis || !analysis.findings || analysis.findings.length === 0) {
    return (
      <Panel className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
          <AlertCircle size={24} className="text-green-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-300 mb-1">No Security Findings</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The simulated digital twin did not exhibit any critical vulnerabilities or weaknesses 
          during this scenario run.
        </p>
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Security Findings</h2>
          <p className="text-xs text-slate-400 mt-1">
            Identified weaknesses in the simulated environment.
          </p>
        </div>
        <FindingSeverityBadge severity={analysis.overallSeverity} />
      </div>

      <div className="space-y-3 mt-4">
        {analysis.findings.map(finding => (
          <SecurityFindingCard key={finding.id} finding={finding} />
        ))}
      </div>
    </Panel>
  );
}
