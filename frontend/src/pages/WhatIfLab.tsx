import { useState, useMemo } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ArrowDown, Check, X } from 'lucide-react';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { SIMULATION_SCENARIOS } from '../data/simulationScenarios';
import { calculateSimulationPath, type SimulationRunPlan } from '../engine/simulationEngine';

const defaultRiskyDecisions = {
  dec_phishing_1: 'opt_phishing_risky',
  dec_attachment_1: 'opt_attach_risky',
  dec_password_1: 'opt_pwd_risky',
  dec_cloud_1: 'opt_cloud_risky',
  dec_social_1: 'opt_soc_risky',
  dec_ransomware_1: 'opt_ran_risky'
};

export function WhatIfLab() {
  const { securityControls } = useCyberShadow();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState(SIMULATION_SCENARIOS[0].id);

  const scenario = useMemo(() => SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0], [selectedScenarioId]);

  const beforeControls = useMemo(() => ({ ...securityControls, mfa: false }), [securityControls]);
  const afterControls = useMemo(() => ({ ...securityControls, mfa: mfaEnabled }), [securityControls, mfaEnabled]);

  const beforePlan = useMemo(() => calculateSimulationPath(scenario as any, beforeControls, defaultRiskyDecisions), [scenario, beforeControls]);
  const afterPlan = useMemo(() => calculateSimulationPath(scenario as any, afterControls, defaultRiskyDecisions), [scenario, afterControls]);

  const renderPath = (plan: SimulationRunPlan) => {
    return (
      <div className="w-full max-w-[240px] space-y-4 relative">
        {plan.stepsToRun.map((step, idx) => {
          const isLast = idx === plan.stepsToRun.length - 1;
          let boxStyle = "p-3 border border-gray-700 rounded-lg bg-gray-900/50 text-gray-300 text-sm";

          if (isLast) {
            if (plan.isBlocked) {
              boxStyle = "p-4 border border-green-500/50 rounded-lg bg-green-950/30 text-green-400 font-bold shadow-[0_0_20px_rgba(34,197,94,0.15)]";
            } else {
              boxStyle = "p-4 border border-red-500/50 rounded-lg bg-red-950/30 text-red-400 font-bold shadow-[0_0_20px_rgba(239,68,68,0.15)]";
            }
          } else if (idx > 0 && idx < plan.stepsToRun.length - 1) {
             boxStyle = "p-3 border border-amber-500/30 rounded-lg bg-amber-950/20 text-amber-400 text-sm";
          }

          return (
            <div key={step.id || idx}>
              <div className={boxStyle}>{step.name}</div>
              {!isLast && <ArrowDown className="mx-auto text-gray-600 mt-4" />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="What-If Lab"
        description="Compare outcomes by toggling security controls on the digital twin."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Panel>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Select Scenario</h3>
            <select
              className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
            >
              {SIMULATION_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Panel>

          <Panel>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Current Configuration</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Backup</span>
                <span className={securityControls.backup ? "text-green-400" : "text-red-400"}>{securityControls.backup ? "ON" : "OFF"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Updates</span>
                <span className={securityControls.automatic_updates ? "text-green-400" : "text-red-400"}>{securityControls.automatic_updates ? "ON" : "OFF"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Privacy</span>
                <span className={securityControls.privacy ? "text-green-400" : "text-red-400"}>{securityControls.privacy ? "ON" : "OFF"}</span>
              </div>
            </div>
          </Panel>

          <Panel className="border-cyan-500/30">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wider">Change Security Control</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-200 mb-2">Multi-Factor Authentication (MFA)</p>
                <div className="flex bg-gray-950 rounded-lg border border-gray-800 p-1">
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-md transition-colors ${!mfaEnabled ? 'bg-red-900/50 text-red-400' : 'text-gray-500 hover:text-gray-300'}`}
                    onClick={() => setMfaEnabled(false)}
                  >
                    <X size={16} /> OFF
                  </button>
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-md transition-colors ${mfaEnabled ? 'bg-green-900/50 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
                    onClick={() => setMfaEnabled(true)}
                  >
                    <Check size={16} /> ON
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-3">
          <Panel className="h-full min-h-[600px] flex flex-col">
            <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
              SIMULATED COUNTERFACTUAL RESULT
            </h2>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-800 transform -translate-x-1/2" />

              <div className="flex flex-col items-center text-center">
                <div className="mb-8">
                  <StatusBadge status="neutral" label="BEFORE" className="mb-2" />
                  <h3 className="text-xl font-bold text-gray-200">MFA OFF</h3>
                </div>

                {renderPath(beforePlan)}

                <div className="mt-8 text-xs text-gray-400 max-w-[240px]">
                  {beforePlan.finalExplanation}
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-8">
                  <StatusBadge status="info" label="AFTER" className="mb-2" />
                  <h3 className="text-xl font-bold text-cyan-400">MFA ON</h3>
                </div>

                <div className="w-full flex flex-col items-center transition-all duration-500" style={{ opacity: mfaEnabled ? 1 : 0.3 }}>
                  {renderPath(afterPlan)}

                  <div className="mt-8 text-xs text-gray-400 max-w-[240px]">
                    {afterPlan.finalExplanation}
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
