import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ShieldAlert, MonitorPlay, Activity, Terminal, ArrowRight, Play, Server, Smartphone, Mail, Cloud, Laptop, GitCompare, TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { getMasteryLabel } from '../engine/learningEngine';
import { generatePracticeRecommendations } from '../engine/recommendationEngine';
import { PracticeRecommendation } from '../components/history/PracticeRecommendation';

export function Dashboard() {
  const navigate = useNavigate();

  const { history: historyRecords, securityControls: controlsState, learningProfile } = useCyberShadow();

  const activeCount = Object.values(controlsState).filter(Boolean).length;
  const total = Object.keys(controlsState).length;
  const coveragePercent = Math.round((activeCount / total) * 100);
  const maxPaths = 12; // Arbitrary fictional total paths
  const blockedPaths = Math.floor((coveragePercent / 100) * maxPaths);
  const vulnerablePaths = maxPaths - blockedPaths;
  const simulatedRiskPercent = Math.max(0, 100 - coveragePercent);

  const recommendations = generatePracticeRecommendations(learningProfile, historyRecords);
  const primaryRecommendation = recommendations[0];
  const secondaryRecommendations = recommendations.slice(1);
  const strongestSkill = Object.values(learningProfile.skills).sort((a, b) => b.mastery - a.mastery)[0];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. DASHBOARD HERO */}
      <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden flex flex-col lg:flex-row">
        <div className="p-8 lg:p-10 flex-1 relative">
          <div className="absolute right-0 top-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4">
            <ShieldAlert size={300} />
          </div>
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Activity size={12} />
              SECURITY SIMULATION CENTER
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
              See how an attack could unfold.<br/>Then change the outcome.
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed mb-8">
              CyberShadow creates a safe digital twin and simulates fictional cyberattack scenarios so you can understand weaknesses, test defenses, and compare security outcomes.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="primary" className="gap-2 px-6" onClick={() => navigate('/simulation')}>
                <Play size={16} fill="currentColor" /> RUN SIMULATION
              </Button>
              <Button variant="secondary" className="gap-2" onClick={() => navigate('/digital-twin')}>
                <MonitorPlay size={16} /> OPEN DIGITAL TWIN
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right side simulation state console */}
        <div className="lg:w-80 bg-[#060a14] border-l border-slate-800/80 p-6 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">SIMULATION ENGINE</div>
              <div className="text-sm font-medium text-slate-200">READY</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">DIGITAL TWIN</div>
              <div className="text-sm font-medium text-cyan-400">ALEX VANCE</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">ENVIRONMENT</div>
              <div className="text-sm font-medium text-amber-500">ISOLATED SANDBOX</div>
            </div>
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-bold text-green-400 tracking-widest uppercase">STATUS: READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SAFETY STRIP */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-2 px-4 bg-amber-500/5 border border-amber-500/10 rounded-md">
        <div className="flex items-center gap-2 text-amber-500/70">
          <ShieldAlert size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">SIMULATION ONLY</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
        <div className="flex items-center gap-2 text-amber-500/70">
          <Server size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">NO REAL SYSTEM ACCESS</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
        <div className="flex items-center gap-2 text-amber-500/70">
          <Terminal size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">ISOLATED SANDBOX</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
        <div className="flex items-center gap-2 text-amber-500/70">
          <Activity size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">FICTIONAL DATA</span>
        </div>
      </div>

      {/* 3. SIMULATION METRICS */}
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3 ml-1">SIMULATION METRICS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Panel className="p-4 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">SIMULATION RISK</div>
            <div className="text-3xl font-light text-white mb-2">{simulatedRiskPercent}<span className="text-lg text-slate-500">%</span></div>
            <div className="text-[11px] text-slate-500">Current synthetic scenario</div>
          </Panel>
          <Panel className="p-4 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">PROTECTION COVERAGE</div>
            <div className="text-3xl font-light text-white mb-2">{coveragePercent}<span className="text-lg text-slate-500">%</span></div>
            <div className="text-[11px] text-slate-500">Based on active controls</div>
          </Panel>
          <Panel className="p-4 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">VULNERABLE PATHS</div>
            <div className="text-3xl font-light text-red-400 mb-2">{vulnerablePaths.toString().padStart(2, '0')}</div>
            <div className="text-[11px] text-slate-500">Identified attack vectors</div>
          </Panel>
          <Panel className="p-4 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">BLOCKED PATHS</div>
            <div className="text-3xl font-light text-cyan-400 mb-2">{blockedPaths.toString().padStart(2, '0')}</div>
            <div className="text-[11px] text-slate-500">Successfully mitigated</div>
          </Panel>
        </div>
      </div>

      {/* 3.5 LEARNING PROGRESS SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0a1128] to-[#060a14]">
          <div className="absolute right-0 top-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4">
            <Activity size={200} />
          </div>
          
          <div className="flex items-center justify-between mb-4 z-10">
            <h2 className="text-[11px] font-bold text-cyan-500 uppercase tracking-[0.15em]">LEARNING PROGRESS</h2>
            <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400" onClick={() => navigate('/history')}>
              View All
            </Button>
          </div>
          
          <div className="z-10 mb-6">
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">SIMULATED MASTERY</div>
            <div className="flex items-end gap-3">
              <div className="text-4xl font-light text-white">{learningProfile.overallMastery} <span className="text-xl text-slate-500">/ 100</span></div>
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">{getMasteryLabel(learningProfile.overallMastery)}</div>
            </div>
          </div>
          
          <div className="z-10 space-y-4 flex-1">
            {strongestSkill && strongestSkill.mastery > 0 && (
              <div className="p-3 bg-green-950/20 border border-green-900/30 rounded">
                <div className="text-[9px] font-bold text-green-500 uppercase tracking-widest mb-1">Top Strength</div>
                <div className="text-sm text-slate-200">{strongestSkill.name} — <span className="text-green-400">{strongestSkill.mastery}</span></div>
              </div>
            )}
            
            {primaryRecommendation && (
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <PracticeRecommendation recommendation={primaryRecommendation} compact={true} />
              </div>
            )}
          </div>
        </Panel>
        
        <div className="lg:col-span-2 flex flex-col gap-6">
            {primaryRecommendation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[220px]">
                <Panel className="bg-gradient-to-br from-[#0b1120] to-violet-950/10 border-violet-900/30 p-6 flex flex-col h-full overflow-hidden">
                  <h3 className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Activity size={14} /> LEARNING PATH
                  </h3>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">CURRENT FOCUS</div>
                      <div className="text-sm font-medium text-slate-200">{primaryRecommendation.targetSkillName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">NEXT</div>
                      <div className="text-sm font-medium text-cyan-400">{primaryRecommendation.scenarioTitle}</div>
                    </div>
                  </div>
                  
                  <Button variant="secondary" className="w-full justify-center gap-2 text-[10px] tracking-widest uppercase text-violet-300 border-violet-900 hover:bg-violet-950/30 mt-4" onClick={() => navigate('/learning-path')}>
                    <ArrowRight size={14} /> OPEN LEARNING PATH
                  </Button>
                </Panel>
                
                {secondaryRecommendations.length > 0 && (
                  <Panel className="bg-[#0b1120] border-slate-800/80 p-5 flex flex-col h-full overflow-hidden">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">PRACTICE NEXT</h3>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      {secondaryRecommendations.map((rec, i) => (
                        <PracticeRecommendation key={i} recommendation={rec} compact={true} />
                      ))}
                    </div>
                  </Panel>
                )}
              </div>
            )}
          
          <Panel className="flex flex-col relative overflow-hidden flex-1 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">DIGITAL TWIN</h2>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400" onClick={() => navigate('/digital-twin')}>View Details</Button>
            </div>
            
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded bg-[#060a14] border border-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold text-lg shadow-[0_0_15px_rgba(8,145,178,0.2)]">
                AV
              </div>
              <div>
                <p className="font-semibold text-white text-lg tracking-wide">ALEX VANCE</p>
                <p className="text-[11px] text-slate-400 font-mono uppercase tracking-widest">Synthetic Digital Identity</p>
              </div>
            </div>
            
            {/* Visual Topology Network */}
            <div className="flex-1 bg-[#060a14] rounded-md border border-slate-800/50 p-6 flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-cyan-400 bg-cyan-950/30 px-3 py-1.5 rounded border border-cyan-900/50">
                  <Cloud size={14} /> <span className="text-[10px] font-bold tracking-widest uppercase">CLOUD STORAGE</span>
                </div>
                <div className="h-6 border-l border-dashed border-slate-700"></div>
                
                <div className="flex gap-16 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 border-t border-dashed border-slate-700"></div>
                  <div className="flex flex-col items-center pt-6">
                    <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded border border-slate-700">
                      <Mail size={14} /> <span className="text-[10px] font-bold tracking-widest uppercase">EMAIL</span>
                    </div>
                    <div className="h-6 border-l border-dashed border-slate-700"></div>
                    <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded border border-slate-700">
                      <Laptop size={14} /> <span className="text-[10px] font-bold tracking-widest uppercase">LAPTOP</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center pt-6">
                    <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded border border-slate-700">
                      <Smartphone size={14} /> <span className="text-[10px] font-bold tracking-widest uppercase">PHONE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* 4. SECURITY CONTROLS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="flex flex-col lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">SECURITY CONTROLS</h2>
            <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400">Edit</Button>
          </div>
          
          <div className="space-y-1">
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Multi-Factor Authentication</span>
               <span className={`text-[10px] font-bold tracking-widest ${controlsState.mfa ? 'text-green-400' : 'text-red-400'}`}>{controlsState.mfa ? 'ON' : 'OFF'}</span>
             </div>
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Password Strength</span>
               <span className={`text-[10px] font-bold tracking-widest ${controlsState.password_strength ? 'text-green-400' : 'text-red-400'}`}>{controlsState.password_strength ? 'ON' : 'OFF'}</span>
             </div>
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Automatic Updates</span>
               <span className={`text-[10px] font-bold tracking-widest ${controlsState.automatic_updates ? 'text-green-400' : 'text-red-400'}`}>{controlsState.automatic_updates ? 'ON' : 'OFF'}</span>
             </div>
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Cloud Backup</span>
               <span className={`text-[10px] font-bold tracking-widest ${controlsState.backup ? 'text-green-400' : 'text-red-400'}`}>{controlsState.backup ? 'ON' : 'OFF'}</span>
             </div>
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Security Awareness</span>
               <span className={`text-[10px] font-bold tracking-widest ${controlsState.security_awareness ? 'text-green-400' : 'text-red-400'}`}>{controlsState.security_awareness ? 'ON' : 'OFF'}</span>
             </div>
          </div>
        </Panel>
      </div>

      {/* 5. ACTIVE SCENARIO */}
      <Panel>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">ACTIVE SCENARIO</h2>
          <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400">View All</Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">SPEAR PHISHING</h3>
              <p className="text-xs text-slate-400 mt-1">Intermediate Difficulty</p>
            </div>
            
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">TARGET PATH</div>
              <p className="text-xs text-slate-300">Email → Laptop → Account</p>
            </div>
            
            <Button variant="secondary" className="w-full mt-4 text-[11px] tracking-widest uppercase gap-2" onClick={() => navigate('/simulation')}>
              <TestTube2 size={14} /> OPEN SIMULATION LAB
            </Button>
          </div>
          
          <div className="md:w-2/3 bg-[#060a14] rounded-md border border-slate-800/50 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-2">ENTRY</div>
                <div className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
              <ArrowRight size={14} className="text-slate-700 hidden sm:block" />
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-2">PHISHING</div>
                <div className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
              <ArrowRight size={14} className="text-slate-700 hidden sm:block" />
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-2">INTERACTION</div>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
              <ArrowRight size={14} className="text-slate-700 hidden sm:block" />
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-2">EXPOSURE</div>
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              </div>
              <ArrowRight size={14} className="text-slate-700 hidden sm:block" />
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-bold tracking-widest text-red-400 mb-2">OUTCOME</div>
                <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 rounded">
                  TAKEOVER PATH
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* 6. RECENT SIMULATIONS */}
      <Panel>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">RECENT SIMULATIONS</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] text-slate-500 font-mono tracking-widest uppercase border-b border-slate-800/80">
              <tr>
                <th className="pb-3 font-normal">SCENARIO</th>
                <th className="pb-3 font-normal">DIGITAL TWIN</th>
                <th className="pb-3 font-normal">DEFENSE STATE</th>
                <th className="pb-3 font-normal">OUTCOME</th>
                <th className="pb-3 font-normal text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {historyRecords.slice(0, 3).map((record) => (
                <tr key={record.id}>
                  <td className="py-3 text-slate-200 font-medium">{record.scenarioName}</td>
                  <td className="py-3 text-cyan-400">Alex Vance</td>
                  <td className="py-3 text-slate-400 text-xs">{record.defensesActive.join(', ')}</td>
                  <td className="py-3 text-slate-300">{record.result}</td>
                  <td className="py-3 text-right">
                    <StatusBadge status={record.result === 'ATTACK BLOCKED' ? 'success' : 'danger'} label={record.result === 'ATTACK BLOCKED' ? 'BLOCKED' : 'VULNERABLE'} />
                  </td>
                </tr>
              ))}
              {historyRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">No simulations run yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 7. QUICK ACTIONS */}
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3 ml-1">QUICK COMMANDS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="secondary" className="w-full py-4 gap-3 text-xs tracking-widest uppercase bg-[#060a14] border-slate-800 hover:border-cyan-900" onClick={() => navigate('/digital-twin')}>
            <MonitorPlay size={16} className="text-cyan-500" /> OPEN DIGITAL TWIN
          </Button>
          <Button variant="secondary" className="w-full py-4 gap-3 text-xs tracking-widest uppercase bg-[#060a14] border-slate-800 hover:border-cyan-900" onClick={() => navigate('/scenarios')}>
            <ShieldAlert size={16} className="text-cyan-500" /> EXPLORE SCENARIOS
          </Button>
          <Button variant="secondary" className="w-full py-4 gap-3 text-xs tracking-widest uppercase bg-[#060a14] border-slate-800 hover:border-cyan-900" onClick={() => navigate('/what-if')}>
            <GitCompare size={16} className="text-cyan-500" /> OPEN WHAT-IF LAB
          </Button>
          <Button variant="primary" className="w-full py-4 gap-3 text-xs tracking-widest uppercase" onClick={() => navigate('/simulation')}>
            <TestTube2 size={16} /> START SIMULATION
          </Button>
        </div>
      </div>
    </div>
  );
}
