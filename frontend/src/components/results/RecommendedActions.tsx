import { Shield, ShieldCheck, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import type { ComprehensiveSimulationResult } from '../../types/results';
import { createRemediationFromFinding } from '../../engine/securityRemediationEngine';
import { useCyberShadow } from '../../contexts/CyberShadowContext';
import type { ControlId } from '../../types/security';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';

function RecommendedActionCard({
  action,
  controlId,
  isApplied,
  onApply
}: {
  action: ReturnType<typeof createRemediationFromFinding>;
  controlId: ControlId | null;
  isApplied: boolean;
  onApply: () => void;
}) {
  if (!action) return null;

  return (
    <div className="border border-slate-800/80 bg-slate-900/50 rounded-lg overflow-hidden transition-colors hover:border-slate-700/80 p-5">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-cyan-400" />
            <h4 className="text-sm font-bold text-white">{action.title}</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">{action.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#060a14] p-3 rounded border border-slate-800/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Related Finding</span>
              <span className="text-slate-300">{action.findingTitle}</span>
            </div>
            <div className="bg-[#060a14] p-3 rounded border border-slate-800/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Affected Control</span>
              <span className="text-slate-300">{action.relatedControl}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col shrink-0 min-w-[200px] bg-[#060a14] p-4 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current</span>
              <span className={`font-bold ${isApplied ? 'text-green-400' : 'text-red-400'}`}>
                {isApplied ? 'ON' : 'OFF'}
              </span>
            </div>
            <ArrowRight size={14} className="text-slate-600" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recommended</span>
              <span className="font-bold text-green-400">ON</span>
            </div>
          </div>

          {isApplied ? (
            <div className="flex items-center justify-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 py-2 rounded text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 size={14} />
              Applied
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full justify-center text-xs" 
              onClick={onApply}
              disabled={!controlId}
            >
              Apply Change
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function RecommendedActions({ result }: { result: ComprehensiveSimulationResult | null }) {
  const { securityControls, updateSecurityControl } = useCyberShadow();

  if (!result || !result.analysis || !result.analysis.findings) {
    return null;
  }

  // Generate actions from findings
  const actions = result.analysis.findings
    .map(f => createRemediationFromFinding(f))
    .filter(a => a !== null) as NonNullable<ReturnType<typeof createRemediationFromFinding>>[];

  // Deduplicate actions by relatedControl to avoid showing the same recommendation twice
  const uniqueActionsMap = new Map<string, typeof actions[0]>();
  actions.forEach(a => {
    if (!uniqueActionsMap.has(a.relatedControl)) {
      uniqueActionsMap.set(a.relatedControl, a);
    }
  });
  const uniqueActions = Array.from(uniqueActionsMap.values());

  if (uniqueActions.length === 0) {
    return (
      <Panel className="flex flex-col items-center justify-center py-8 text-center mt-6">
        <ShieldCheck size={24} className="text-green-500 mb-2" />
        <h3 className="text-sm font-medium text-slate-300">No Required Actions</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          No additional defensive actions were generated. The synthetic digital twin's current security posture is satisfactory for this scenario.
        </p>
      </Panel>
    );
  }

  const getControlId = (controlName: string): ControlId | null => {
    const mapping: Record<string, ControlId> = {
      'mfa': 'mfa',
      'password strength': 'password_strength',
      'automatic updates': 'automatic_updates',
      'backup': 'backup',
      'privacy': 'privacy',
      'security awareness': 'security_awareness'
    };
    return mapping[controlName.toLowerCase()] || null;
  };

  return (
    <Panel className="mt-6">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Shield size={16} className="text-cyan-500" />
          Recommended Actions
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Apply these defensive changes to the simulated digital twin to prevent these findings in future runs.
        </p>
      </div>

      <div className="space-y-4">
        {uniqueActions.map(action => {
          const controlId = getControlId(action.relatedControl);
          const isApplied = controlId ? securityControls[controlId] : false;
          
          return (
            <RecommendedActionCard 
              key={action.title} 
              action={action} 
              controlId={controlId}
              isApplied={isApplied}
              onApply={() => {
                if (controlId) {
                  updateSecurityControl(controlId, true);
                }
              }}
            />
          );
        })}
      </div>
    </Panel>
  );
}
