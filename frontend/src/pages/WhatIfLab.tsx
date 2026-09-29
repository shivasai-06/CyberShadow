import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ArrowDown, Check, X } from 'lucide-react';

export function WhatIfLab() {
  const [mfaEnabled, setMfaEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="What-If Lab" 
        description="Compare outcomes by toggling security controls on the digital twin."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Panel>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Current Configuration</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Backup</span>
                <span className="text-green-400">ON</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Updates</span>
                <span className="text-green-400">ON</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Awareness</span>
                <span className="text-amber-400">MEDIUM</span>
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
            
            <div className="flex-1 grid grid-cols-2 gap-8 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-800 transform -translate-x-1/2" />
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-8">
                  <StatusBadge status="neutral" label="BEFORE" className="mb-2" />
                  <h3 className="text-xl font-bold text-gray-200">MFA OFF</h3>
                </div>
                
                <div className="w-full max-w-[240px] space-y-4 relative">
                  <div className="p-3 border border-gray-700 rounded-lg bg-gray-900/50 text-gray-300 text-sm">Phishing</div>
                  <ArrowDown className="mx-auto text-gray-600" />
                  <div className="p-3 border border-amber-500/30 rounded-lg bg-amber-950/20 text-amber-400 text-sm">Credential Exposure</div>
                  <ArrowDown className="mx-auto text-gray-600" />
                  <div className="p-4 border border-red-500/50 rounded-lg bg-red-950/30 text-red-400 font-bold shadow-[0_0_20px_rgba(239,68,68,0.15)]">Account Takeover</div>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-8">
                  <StatusBadge status="info" label="AFTER" className="mb-2" />
                  <h3 className="text-xl font-bold text-cyan-400">MFA ON</h3>
                </div>
                
                <div className="w-full max-w-[240px] space-y-4 relative transition-all duration-500" style={{ opacity: mfaEnabled ? 1 : 0.3 }}>
                  <div className="p-3 border border-gray-700 rounded-lg bg-gray-900/50 text-gray-300 text-sm">Phishing</div>
                  <ArrowDown className="mx-auto text-gray-600" />
                  <div className="p-3 border border-amber-500/30 rounded-lg bg-amber-950/20 text-amber-400 text-sm">Credential Exposure</div>
                  <ArrowDown className="mx-auto text-gray-600" />
                  <div className="p-3 border border-cyan-500/30 rounded-lg bg-cyan-950/20 text-cyan-400 text-sm">MFA Challenge</div>
                  <ArrowDown className="mx-auto text-gray-600" />
                  <div className="p-4 border border-green-500/50 rounded-lg bg-green-950/30 text-green-400 font-bold shadow-[0_0_20px_rgba(34,197,94,0.15)]">ATTACK BLOCKED</div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
