import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ShieldAlert, MonitorPlay, Activity, Terminal, ArrowRight, Play, Server, Smartphone, Mail, Cloud, Laptop, GitCompare, TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();

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
            <div className="text-3xl font-light text-white mb-2">68<span className="text-lg text-slate-500">%</span></div>
            <div className="text-[11px] text-slate-500">Current synthetic scenario</div>
          </Panel>
          <Panel className="p-4 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">PROTECTION COVERAGE</div>
            <div className="text-3xl font-light text-white mb-2">74<span className="text-lg text-slate-500">%</span></div>
            <div className="text-[11px] text-slate-500">Based on active controls</div>
          </Panel>
          <Panel className="p-4 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">VULNERABLE PATHS</div>
            <div className="text-3xl font-light text-red-400 mb-2">03</div>
            <div className="text-[11px] text-slate-500">Identified attack vectors</div>
          </Panel>
          <Panel className="p-4 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">BLOCKED PATHS</div>
            <div className="text-3xl font-light text-cyan-400 mb-2">05</div>
            <div className="text-[11px] text-slate-500">Successfully mitigated</div>
          </Panel>
        </div>
      </div>

      {/* 4. DIGITAL TWIN OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">DIGITAL TWIN</h2>
            <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400">View Details</Button>
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

        <Panel className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">SECURITY CONTROLS</h2>
            <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400">Edit</Button>
          </div>
          
          <div className="space-y-1">
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Multi-Factor Authentication</span>
               <span className="text-[10px] font-bold tracking-widest text-red-400">OFF</span>
             </div>
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Password Strength</span>
               <span className="text-[10px] font-bold tracking-widest text-amber-400">MEDIUM</span>
             </div>
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Automatic Updates</span>
               <span className="text-[10px] font-bold tracking-widest text-green-400">ON</span>
             </div>
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Cloud Backup</span>
               <span className="text-[10px] font-bold tracking-widest text-green-400">ON</span>
             </div>
             <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/30 rounded transition-colors">
               <span className="text-xs text-slate-300 font-medium">Security Awareness</span>
               <span className="text-[10px] font-bold tracking-widest text-amber-400">MEDIUM</span>
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
              <tr>
                <td className="py-3 text-slate-200 font-medium">Spear Phishing</td>
                <td className="py-3 text-cyan-400">Alex Vance</td>
                <td className="py-3 text-slate-400 text-xs">MFA OFF</td>
                <td className="py-3 text-slate-300">Account Takeover Path</td>
                <td className="py-3 text-right">
                  <StatusBadge status="danger" label="VULNERABLE" />
                </td>
              </tr>
              <tr>
                <td className="py-3 text-slate-200 font-medium">Credential Exposure</td>
                <td className="py-3 text-cyan-400">Alex Vance</td>
                <td className="py-3 text-slate-400 text-xs">MFA ON</td>
                <td className="py-3 text-slate-300">Authentication Blocked</td>
                <td className="py-3 text-right">
                  <StatusBadge status="success" label="BLOCKED" />
                </td>
              </tr>
              <tr>
                <td className="py-3 text-slate-200 font-medium">QR Scam</td>
                <td className="py-3 text-cyan-400">Alex Vance</td>
                <td className="py-3 text-slate-400 text-xs">MFA ON</td>
                <td className="py-3 text-slate-300">Simulation Complete</td>
                <td className="py-3 text-right">
                  <StatusBadge status="neutral" label="COMPLETED" />
                </td>
              </tr>
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
