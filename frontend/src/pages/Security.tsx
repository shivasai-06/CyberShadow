import { useState, useMemo } from 'react';
import { ShieldAlert, BookOpen } from 'lucide-react';
import type { ControlId, SecurityControlDef, SecurityPostureMetrics, PresetType } from '../types/security';
import { SecurityPosture } from '../components/security/SecurityPosture';
import { SecurityControlCard } from '../components/security/SecurityControlCard';
import { WhatChangesPanel } from '../components/security/WhatChangesPanel';
import { DefenseCoverage } from '../components/security/DefenseCoverage';
import { SimulationPresets } from '../components/security/SimulationPresets';
import { SecurityQuickActions } from '../components/security/SecurityQuickActions';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { HistoricalPosture } from '../components/security-analysis/HistoricalPosture';

const SECURITY_CONTROLS: SecurityControlDef[] = [
  {
    id: 'mfa',
    name: 'MULTI-FACTOR AUTHENTICATION',
    description: 'Adds an additional verification step to fictional identity attack scenarios.',
    effect: 'Can block simulated account takeover paths after credential exposure.',
    beforePath: ['CREDENTIAL EXPOSURE', 'ACCOUNT TAKEOVER'],
    afterPath: ['CREDENTIAL EXPOSURE', 'MFA CHALLENGE', 'ATTACK BLOCKED']
  },
  {
    id: 'password_strength',
    name: 'PASSWORD STRENGTH',
    description: 'Represents stronger credential protection in fictional identity scenarios.',
    effect: 'Can prevent weak-password attack paths from progressing.',
    beforePath: ['WEAK CREDENTIAL', 'BRUTE FORCE', 'ACCOUNT TAKEOVER'],
    afterPath: ['WEAK CREDENTIAL', 'BRUTE FORCE', 'ATTACK BLOCKED']
  },
  {
    id: 'automatic_updates',
    name: 'AUTOMATIC UPDATES',
    description: 'Represents a regularly updated simulated endpoint.',
    effect: 'Can block selected fictional attachment or endpoint paths.',
    beforePath: ['MALICIOUS ATTACHMENT', 'EXECUTION', 'SYSTEM COMPROMISE'],
    afterPath: ['MALICIOUS ATTACHMENT', 'EXECUTION', 'ATTACK BLOCKED']
  },
  {
    id: 'backup',
    name: 'BACKUP',
    description: 'Represents protected recovery data in the simulation environment.',
    effect: 'Can reduce the impact of selected fictional data-loss scenarios.',
    beforePath: ['RANSOMWARE', 'DATA ENCRYPTION', 'DATA LOSS'],
    afterPath: ['RANSOMWARE', 'DATA ENCRYPTION', 'ATTACK BLOCKED']
  },
  {
    id: 'privacy',
    name: 'PRIVACY',
    description: 'Represents stronger privacy controls around fictional digital assets.',
    effect: 'Can reduce exposure in selected social and data scenarios.',
    beforePath: ['PUBLIC PROFILE', 'RECONNAISSANCE', 'TARGET IDENTIFIED'],
    afterPath: ['PUBLIC PROFILE', 'RECONNAISSANCE', 'ATTACK BLOCKED']
  },
  {
    id: 'security_awareness',
    name: 'SECURITY AWARENESS',
    description: 'Represents a user trained to recognize suspicious fictional activity.',
    effect: 'Can interrupt selected social-engineering paths earlier.',
    beforePath: ['PHISHING EMAIL', 'USER CLICKS LINK', 'PAYLOAD DELIVERY'],
    afterPath: ['PHISHING EMAIL', 'USER REPORTS EMAIL', 'ATTACK BLOCKED']
  }
];

export function Security() {
  const { securityControls: controlsState, activePreset, updateSecurityControl, applySecurityPreset, securityPosture } = useCyberShadow();
  const [selectedControlId, setSelectedControlId] = useState<ControlId>('mfa');

  // Calculate metrics based on controls
  const metrics = useMemo<SecurityPostureMetrics>(() => {
    const activeCount = Object.values(controlsState).filter(Boolean).length;
    const total = SECURITY_CONTROLS.length;
    const coverage = Math.round((activeCount / total) * 100);
    
    let risk: SecurityPostureMetrics['simulatedRisk'] = 'MEDIUM';
    if (coverage >= 80) risk = 'LOW';
    if (coverage <= 33) risk = 'HIGH';
    if (coverage === 0) risk = 'CRITICAL';

    const maxPaths = 12; // Arbitrary fictional total paths
    const blocked = Math.floor((coverage / 100) * maxPaths);
    const vulnerable = maxPaths - blocked;

    return {
      coveragePercent: coverage,
      activeControls: activeCount,
      totalControls: total,
      simulatedRisk: risk,
      vulnerablePaths: vulnerable,
      blockedPaths: blocked
    };
  }, [controlsState]);

  const handleToggleControl = (id: ControlId, value: boolean) => {
    updateSecurityControl(id, value);
    setSelectedControlId(id); // Focus the clicked control
  };

  const handleApplyPreset = (preset: PresetType) => {
    applySecurityPreset(preset);
  };

  const selectedControl = SECURITY_CONTROLS.find(c => c.id === selectedControlId)!;

  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* PAGE HEADER & SAFETY */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <ShieldAlert size={12} /> SECURITY CENTER
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Center</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Configure defensive controls for your fictional CyberShadow simulations. Changes here affect CyberShadow simulations only.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">SIMULATION ONLY</span>
          </div>
          <div className="text-[9px] font-mono text-slate-500 tracking-widest uppercase text-right">
            FICTIONAL CONTROLS<br/>NO REAL SYSTEMS AFFECTED
          </div>
        </div>
      </div>

      <SecurityPosture metrics={metrics} />

      {/* HISTORICAL SECURITY POSTURE (PHASE 5.2) */}
      <div className="mt-12 mb-12 border-t border-slate-800/80 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <ShieldAlert size={12} /> HISTORICAL POSTURE
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Simulation Posture Trends</h2>
            <p className="text-sm text-slate-400">
              Deterministic aggregate of your completed simulation history.
            </p>
          </div>
        </div>
        <HistoricalPosture posture={securityPosture} />
      </div>

      <SimulationPresets activePreset={activePreset} onApplyPreset={handleApplyPreset} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CONTROLS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">DEFENSIVE CONTROLS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECURITY_CONTROLS.map(control => (
              <SecurityControlCard
                key={control.id}
                control={control}
                isActive={controlsState[control.id]}
                isSelected={selectedControlId === control.id}
                onToggle={(val) => handleToggleControl(control.id, val)}
                onClick={() => setSelectedControlId(control.id)}
              />
            ))}
          </div>
        </div>

        {/* WHAT CHANGES PANEL */}
        <div className="lg:col-span-1">
          <WhatChangesPanel control={selectedControl} isActive={controlsState[selectedControl.id]} />
        </div>
        
      </div>

      <DefenseCoverage />

      {/* EDUCATIONAL NOTE */}
      <div className="bg-[#0b1120] border border-violet-900/30 border-l-2 border-l-violet-500 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-violet-500" />
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">LEARNING NOTE</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          Security controls are most useful when you understand what they change. CyberShadow lets you experiment with fictional defenses and observe how the simulated attack path changes. None of these configurations affect your real computer, network, or accounts.
        </p>
        
        <SecurityQuickActions />
      </div>
      
    </div>
  );
}
