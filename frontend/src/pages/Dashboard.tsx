import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ShieldAlert, MonitorPlay, Activity, Terminal, ArrowRight, Play, Server, Smartphone, Mail, Cloud, Laptop, GitCompare, TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { getMasteryLabel } from '../engine/learningEngine';
import { generatePracticeRecommendations } from '../engine/recommendationEngine';
import { PracticeRecommendation } from '../components/history/PracticeRecommendation';
import { useDashboardData } from '../hooks/useDashboardData';
import { AIIntelligence } from '../components/dashboard/AIIntelligence';

export function Dashboard() {
  const navigate = useNavigate();

  const { history: historyRecords, learningProfile, securityLearningImpacts, securityPractices } = useCyberShadow();
  const dashboardData = useDashboardData();

  const recommendations = generatePracticeRecommendations(learningProfile, historyRecords);
  const primaryRecommendation = recommendations[0];
  const strongestSkill = Object.values(learningProfile.skills).sort((a, b) => b.mastery - a.mastery)[0];
  const nextPractice = securityPractices.find(p => p.status === 'AVAILABLE');

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
            <div className="flex flex-wrap items-center gap-4">
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

      {/* 3. SIMULATION OVERVIEW */}
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3 ml-1">SIMULATION OVERVIEW</h2>
        {dashboardData.metrics.totalSimulations === 0 ? (
          <Panel className="p-8 flex flex-col items-center justify-center text-center border border-dashed border-slate-700/50 bg-[#060a14]">
            <MonitorPlay size={32} className="text-slate-600 mb-3" />
            <div className="text-slate-300 font-medium mb-1">No simulations recorded yet</div>
            <div className="text-xs text-slate-500 max-w-sm">Run your first simulation in the lab to generate activity metrics and analysis findings.</div>
            <Button variant="secondary" className="mt-4 text-xs" onClick={() => navigate('/simulation')}>
              START SIMULATION
            </Button>
          </Panel>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Panel className="p-4 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">TOTAL SIMULATIONS</div>
              <div className="text-3xl font-light text-white mb-2">{dashboardData.metrics.totalSimulations}</div>
              <div className="text-[11px] text-slate-500">Historical runs recorded</div>
            </Panel>
            <Panel className="p-4 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">BLOCKED ATTACKS</div>
              <div className="text-3xl font-light text-cyan-400 mb-2">{dashboardData.metrics.blockedSimulations}</div>
              <div className="text-[11px] text-slate-500">Successfully mitigated scenarios</div>
            </Panel>
            <Panel className="p-4 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">COMPROMISED</div>
              <div className="text-3xl font-light text-red-400 mb-2">{dashboardData.metrics.compromisedSimulations}</div>
              <div className="text-[11px] text-slate-500">Takeover paths reached</div>
            </Panel>
            <Panel className="p-4 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">TOTAL FINDINGS</div>
              <div className="text-3xl font-light text-amber-400 mb-2">{dashboardData.metrics.totalFindings}</div>
              <div className="text-[11px] text-slate-500">Identified security weaknesses</div>
            </Panel>
          </div>
        )}
      </div>

      {/* 4. SECURITY STATUS */}
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 ml-1 mt-10">SECURITY STATUS</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Defenses & Trend */}
          <Panel className="flex flex-col relative overflow-hidden bg-[#0b1120] border-slate-800/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.15em]">DEFENSE STATE</h3>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-orange-500 hover:text-orange-400" onClick={() => navigate('/security')}>
                Full Details
              </Button>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">Active Defenses</div>
                  <div className="text-2xl font-bold text-green-400">{dashboardData.metrics.activeDefenses}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">Disabled</div>
                  <div className="text-2xl font-bold text-red-400">{dashboardData.metrics.disabledDefenses}</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  <span>Control Coverage</span>
                  <span>{dashboardData.securityStatus.coveragePercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-cyan-500" style={{ width: `${dashboardData.metrics.totalDefenses > 0 ? (dashboardData.metrics.activeDefenses / dashboardData.metrics.totalDefenses) * 100 : 0}%` }} title="Active Defenses" />
                  <div className="h-full bg-slate-700/50" style={{ width: `${dashboardData.metrics.totalDefenses > 0 ? (dashboardData.metrics.disabledDefenses / dashboardData.metrics.totalDefenses) * 100 : 0}%` }} title="Disabled Defenses" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-auto">
                <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">Security Trend</div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-900 ${
                  dashboardData.securityStatus.trend === 'IMPROVING' ? 'text-green-500' :
                  dashboardData.securityStatus.trend === 'NEEDS PRACTICE' ? 'text-orange-500' :
                  dashboardData.securityStatus.trend === 'MIXED' ? 'text-amber-500' : 'text-slate-500'
                }`}>
                  {dashboardData.securityStatus.trend}
                </span>
              </div>
            </div>
          </Panel>

          {/* Remediation Status */}
          <Panel className="flex flex-col relative overflow-hidden bg-[#0b1120] border-slate-800/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.15em]">REMEDIATIONS</h3>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-orange-500 hover:text-orange-400" onClick={() => navigate('/security/remediation')}>
                Review
              </Button>
            </div>

            {dashboardData.securityStatus.remediations.total === 0 ? (
              <div className="text-slate-400 text-xs italic flex-1 flex items-center justify-center">
                No remediations identified yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex gap-4 flex-1">
                  <div className="flex-1 flex flex-col justify-center bg-[#060a14] rounded border border-slate-800 p-3 items-center">
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">Open</span>
                    <span className="text-3xl font-light text-orange-400">{dashboardData.securityStatus.remediations.open}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center bg-[#060a14] rounded border border-slate-800 p-3 items-center">
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">In Progress</span>
                    <span className="text-3xl font-light text-amber-400">{dashboardData.securityStatus.remediations.inProgress}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-900/30 p-2 rounded">
                    <span className="text-xs text-slate-300">Validated Defenses</span>
                    <span className="text-sm font-bold text-emerald-400">{dashboardData.securityStatus.remediations.validated}</span>
                  </div>
                </div>
              </div>
            )}
          </Panel>

          {/* Findings Summary */}
          <Panel className="flex flex-col relative overflow-hidden bg-[#0b1120] border-slate-800/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.15em]">FINDINGS SUMMARY</h3>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-orange-500 hover:text-orange-400" onClick={() => navigate('/security')}>
                All Findings
              </Button>
            </div>

            {dashboardData.metrics.totalFindings === 0 ? (
              <div className="text-slate-400 text-xs italic flex-1 flex items-center justify-center">
                No findings recorded yet.
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center py-2 px-3 bg-red-950/20 border border-red-900/30 rounded">
                  <span className="text-xs text-red-400/90 font-medium tracking-wide">CRITICAL</span>
                  <span className="text-sm font-bold text-red-400">{dashboardData.metrics.findingsBySeverity.critical}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-orange-950/20 border border-orange-900/30 rounded">
                  <span className="text-xs text-orange-400/90 font-medium tracking-wide">HIGH</span>
                  <span className="text-sm font-bold text-orange-400">{dashboardData.metrics.findingsBySeverity.high}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-amber-950/20 border border-amber-900/30 rounded">
                  <span className="text-xs text-amber-400/90 font-medium tracking-wide">MEDIUM</span>
                  <span className="text-sm font-bold text-amber-400">{dashboardData.metrics.findingsBySeverity.medium}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-slate-800/30 border border-slate-700/50 rounded">
                  <span className="text-xs text-slate-300 font-medium tracking-wide">LOW</span>
                  <span className="text-sm font-bold text-slate-300">{dashboardData.metrics.findingsBySeverity.low}</span>
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>

      {/* 4.5 VISUAL ANALYTICS */}
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 ml-1 mt-10">VISUAL ANALYTICS</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* VISUALIZATION 1 - SIMULATION OUTCOMES */}
          <Panel className="p-5 flex flex-col">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">SIMULATION OUTCOMES</h3>
            {dashboardData.metrics.totalSimulations === 0 ? (
              <div className="text-slate-400 text-xs italic flex-1 min-h-[120px] flex items-center justify-center border border-dashed border-slate-700/50 rounded-lg">
                No simulation outcome data yet.
              </div>
            ) : (
              <div className="flex flex-col justify-center flex-1 min-h-[120px]">
                <div className="flex justify-between text-xs mb-2">
                  <div className="flex flex-col">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider">Blocked</span>
                    <span className="text-xl font-light text-white">{dashboardData.metrics.blockedSimulations}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-red-400 font-bold uppercase tracking-wider">Compromised</span>
                    <span className="text-xl font-light text-white">{dashboardData.metrics.compromisedSimulations}</span>
                  </div>
                </div>
                <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-800">
                  <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${(dashboardData.metrics.blockedSimulations / dashboardData.metrics.totalSimulations) * 100}%` }} title="Blocked" />
                  <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${(dashboardData.metrics.compromisedSimulations / dashboardData.metrics.totalSimulations) * 100}%` }} title="Compromised" />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                  <span>{((dashboardData.metrics.blockedSimulations / dashboardData.metrics.totalSimulations) * 100).toFixed(1)}%</span>
                  <span>{((dashboardData.metrics.compromisedSimulations / dashboardData.metrics.totalSimulations) * 100).toFixed(1)}%</span>
                </div>
              </div>
            )}
          </Panel>

          {/* VISUALIZATION 2 - FINDING SEVERITY */}
          <Panel className="p-5 flex flex-col">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">FINDING SEVERITY DISTRIBUTION</h3>
            {dashboardData.metrics.totalFindings === 0 ? (
              <div className="text-slate-400 text-xs italic flex-1 min-h-[120px] flex items-center justify-center border border-dashed border-slate-700/50 rounded-lg">
                No security findings recorded yet.
              </div>
            ) : (
              <div className="flex flex-col justify-between flex-1 space-y-3">
                {[
                  { label: 'Critical', value: dashboardData.metrics.findingsBySeverity.critical, color: 'bg-red-500', text: 'text-red-400' },
                  { label: 'High', value: dashboardData.metrics.findingsBySeverity.high, color: 'bg-orange-500', text: 'text-orange-400' },
                  { label: 'Medium', value: dashboardData.metrics.findingsBySeverity.medium, color: 'bg-amber-500', text: 'text-amber-400' },
                  { label: 'Low', value: dashboardData.metrics.findingsBySeverity.low, color: 'bg-slate-400', text: 'text-slate-300' }
                ].map((sev) => {
                  const maxVal = Math.max(
                    dashboardData.metrics.findingsBySeverity.critical,
                    dashboardData.metrics.findingsBySeverity.high,
                    dashboardData.metrics.findingsBySeverity.medium,
                    dashboardData.metrics.findingsBySeverity.low
                  );
                  const width = maxVal > 0 ? `${(sev.value / maxVal) * 100}%` : '0%';
                  return (
                    <div key={sev.label} className="flex items-center gap-3">
                      <div className={`w-16 text-[10px] font-bold uppercase tracking-widest ${sev.text}`}>{sev.label}</div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className={`h-full rounded-full transition-all duration-500 ${sev.color}`} style={{ width }} />
                      </div>
                      <div className="w-6 text-right text-xs font-mono text-slate-300">{sev.value}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          {/* VISUALIZATION 3 - POSTURE TREND */}
          <Panel className="p-5 flex flex-col">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">SECURITY POSTURE TREND</h3>
            <div className="flex flex-col flex-1 min-h-[120px] justify-center items-center text-center bg-slate-900/30 border border-slate-800/50 rounded-lg p-4">
              <Activity size={24} className="text-slate-600 mb-2" />
              <div className="text-slate-500 text-[10px] uppercase tracking-widest mb-3">Current Qualitative State</div>
              <div className={`font-bold tracking-widest px-4 py-1.5 rounded-full border text-xs ${
                dashboardData.securityStatus.trend === 'IMPROVING' ? 'text-green-400 border-green-900/50 bg-green-950/20' :
                dashboardData.securityStatus.trend === 'NEEDS PRACTICE' ? 'text-orange-400 border-orange-900/50 bg-orange-950/20' :
                dashboardData.securityStatus.trend === 'MIXED' ? 'text-amber-400 border-amber-900/50 bg-amber-950/20' : 'text-slate-400 border-slate-700/50 bg-slate-800/20'
              }`}>
                {dashboardData.securityStatus.trend}
              </div>
              <div className="text-slate-500 text-[9px] mt-4 italic max-w-xs">Not enough historical numeric data for a line trend.</div>
            </div>
          </Panel>

          {/* VISUALIZATION 4 - REMEDIATION EFFECTIVENESS */}
          <Panel className="p-5 flex flex-col">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">REMEDIATION EFFECTIVENESS</h3>
            {!dashboardData.validatedEffectiveness || dashboardData.validatedEffectiveness.length === 0 ? (
              <div className="text-slate-400 text-xs italic flex-1 min-h-[120px] flex items-center justify-center border border-dashed border-slate-700/50 rounded-lg">
                No validated remediation results yet.
              </div>
            ) : (
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[120px] custom-scrollbar pr-1">
                {dashboardData.validatedEffectiveness.map((eff, idx) => (
                  <div key={idx} className="bg-[#060a14] border border-slate-800/50 rounded p-3 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-300 font-medium truncate max-w-[120px]" title={eff.control}>{eff.control}</span>
                      <span className="text-[9px] text-slate-500">{new Date(eff.comparedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Findings</span>
                        <div className="flex items-center gap-1 text-[11px] font-mono">
                          <span className="text-red-400">{eff.before.findings.length}</span>
                          <ArrowRight size={10} className="text-slate-600" />
                          <span className={eff.findingsRemaining < eff.before.findings.length ? "text-green-400" : "text-amber-400"}>
                            {eff.findingsRemaining}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={eff.outcome === 'IMPROVED' || eff.outcome === 'VALIDATED' ? 'success' : 'warning'} label={eff.outcome} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

        </div>
      </div>

      {/* 4.75 AI INTELLIGENCE */}
      <AIIntelligence
        metrics={dashboardData.metrics}
        trend={dashboardData.securityStatus.trend}
        recentHistory={historyRecords.slice(0, 5)}
        remediations={dashboardData.validatedEffectiveness || []}
      />

      {/* 5. LEARNING & ENVIRONMENT */}
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 ml-1 mt-10">LEARNING & ENVIRONMENT</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Panel className="flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0a1128] to-[#060a14]">
            <div className="absolute right-0 top-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4">
              <Activity size={200} />
            </div>

            <div className="flex items-center justify-between mb-4 z-10">
              <h3 className="text-[11px] font-bold text-cyan-500 uppercase tracking-[0.15em]">LEARNING PROGRESS</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {primaryRecommendation && (
                <Panel className="bg-gradient-to-br from-[#0b1120] to-violet-950/10 border-violet-900/30 p-5 flex flex-col lg:col-span-1">
                  <h3 className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <Activity size={14} /> LEARNING PATH
                  </h3>

                  <div className="space-y-3 flex-1">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">CURRENT FOCUS</div>
                      <div className="text-sm font-medium text-slate-200">{primaryRecommendation.targetSkillName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">NEXT SCENARIO</div>
                      <div className="text-sm font-medium text-cyan-400">{primaryRecommendation.scenarioTitle}</div>
                    </div>
                  </div>

                  <Button variant="secondary" className="w-full justify-center gap-2 text-[10px] tracking-widest uppercase text-violet-300 border-violet-900 hover:bg-violet-950/30 mt-3" onClick={() => navigate('/learning-path')}>
                    <ArrowRight size={14} /> OPEN LEARNING PATH
                  </Button>
                </Panel>
              )}

              <Panel className="bg-[#0b1120] border-slate-800/80 p-5 flex flex-col lg:col-span-1">
                <h3 className="text-[11px] font-bold text-teal-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Activity size={14} /> LEARNING SIGNALS
                </h3>

                <div className="space-y-3 flex-1">
                  {securityLearningImpacts.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">No security-driven learning signals yet.</div>
                  ) : (
                    securityLearningImpacts.slice(0, 3).map(impact => (
                      <div key={impact.id} className="flex justify-between items-center text-sm p-2 rounded bg-slate-900/50 border border-slate-800/50">
                        <span className="text-slate-300 truncate mr-2">{impact.skillName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest flex-shrink-0 ${
                          impact.learningState === 'DEMONSTRATED' ? 'bg-emerald-950/40 text-emerald-400' :
                          impact.learningState === 'DEVELOPING' ? 'bg-amber-950/40 text-amber-400' :
                          'bg-rose-950/40 text-rose-400'
                        }`}>
                          {impact.learningState === 'DEMONSTRATED' ? 'DEMONSTRATED' : 'NEEDS PRACTICE'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Panel>

              <Panel className="bg-[#0b1120] border-slate-800/80 p-5 flex flex-col lg:col-span-1">
                <h3 className="text-[11px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <ShieldAlert size={14} /> NEXT PRACTICE
                </h3>

                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {!nextPractice ? (
                    <div className="text-xs text-slate-500 italic">No adaptive practice recommended right now.</div>
                  ) : (
                    <div className="bg-slate-900/50 border border-slate-800 rounded p-3 text-center">
                      <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">{nextPractice.skillName}</div>
                      <div className="text-sm text-slate-200 font-medium mb-3">{nextPractice.title}</div>
                      <Button variant="primary" size="sm" className="w-full text-[10px]" onClick={() => navigate('/learning-path')}>
                        START
                      </Button>
                    </div>
                  )}
                </div>
              </Panel>
            </div>

            <Panel className="flex flex-col relative overflow-hidden flex-1 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">DIGITAL TWIN</h3>
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
              <div className="flex-1 bg-[#060a14] rounded-md border border-slate-800/50 p-6 flex items-center justify-center min-h-[200px] overflow-x-auto overflow-y-hidden custom-scrollbar">
                <div className="flex flex-col items-center min-w-max">
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
      </div>

      {/* 6. ACTIVE SCENARIO */}
      <Panel>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">ACTIVE SCENARIO</h2>
          <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400" onClick={() => navigate('/scenarios')}>View All</Button>
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

      {/* 7. HISTORY & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT SIMULATIONS */}
        <Panel className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">RECENT SIMULATIONS</h2>
            <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400" onClick={() => navigate('/history')}>View All</Button>
          </div>

          <div className="flex-1">
            {dashboardData.recentHistory.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center py-8 text-center border border-dashed border-slate-700/50 rounded-lg bg-[#060a14]/50">
                <MonitorPlay size={24} className="text-slate-600 mb-2" />
                <div className="text-slate-500 text-xs">No simulations recorded yet.</div>
                <Button variant="secondary" size="sm" className="mt-4 text-[10px]" onClick={() => navigate('/simulation')}>
                  START SIMULATION
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.recentHistory.slice(0, 5).map((record) => (
                  <div key={record.id} className="p-3 rounded-lg bg-[#060a14] border border-slate-800/50 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-slate-200">{record.scenarioName}</span>
                        <span className="text-[10px] text-slate-500">{new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {record.defensesActive.length > 0 ? (
                          <span className="text-[10px] text-slate-400 font-mono">
                            <span className="text-cyan-500 font-bold">{record.defensesActive.length}</span> Defenses
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic font-mono">No defenses active</span>
                        )}
                        <span className="text-slate-700">•</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {record.decisionCount !== undefined ? <><span className="text-amber-500 font-bold">{record.decisionCount}</span> Decisions</> : 'Automated run'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center justify-end">
                      <StatusBadge
                        status={record.result === 'ATTACK BLOCKED' ? 'success' : 'danger'}
                        label={record.result === 'ATTACK BLOCKED' ? 'BLOCKED' : 'COMPROMISED'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        {/* RECENT ACTIVITY */}
        <Panel className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">RECENT ACTIVITY</h2>
            <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400" onClick={() => navigate('/history')}>View History</Button>
          </div>

          <div className="flex-1">
            {dashboardData.recentActivity.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center py-8 text-center border border-dashed border-slate-700/50 rounded-lg bg-[#060a14]/50">
                <Activity size={24} className="text-slate-600 mb-2" />
                <div className="text-slate-500 text-xs">No recent activity yet.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="p-3 rounded-lg bg-slate-900/30 border border-slate-800/30 flex gap-3 items-start">
                    <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-md bg-[#060a14] border border-slate-800">
                      {activity.type === 'SIMULATION' && <TestTube2 size={14} className="text-cyan-500" />}
                      {activity.type === 'REMEDIATION_CREATED' && <ShieldAlert size={14} className="text-orange-500" />}
                      {activity.type === 'REMEDIATION_VALIDATED' && <Server size={14} className="text-emerald-500" />}
                      {activity.type === 'PRACTICE_COMPLETED' && <Activity size={14} className="text-violet-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-slate-300 truncate mr-2">{activity.title}</span>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap flex-shrink-0">
                          {new Date(activity.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-400 truncate">{activity.description}</div>
                        {activity.status && activity.status !== 'NEUTRAL' && (
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            activity.status === 'SUCCESS' ? 'bg-green-500' :
                            activity.status === 'WARNING' ? 'bg-amber-500' : 'bg-slate-500'
                          }`} title={activity.status} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* 8. QUICK ACTIONS */}
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 ml-1 mt-10">QUICK COMMANDS</h2>
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
