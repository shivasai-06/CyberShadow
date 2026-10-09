import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Activity, Play, Pause, RotateCcw, MonitorPlay, LogOut, CheckCircle2, Circle } from 'lucide-react';
import type { SimulationState, UserDecisionsRecord, SimulationMode } from '../types/simulation';
import { SimulationScenarioSelector } from '../components/simulation/SimulationScenarioSelector';
import { SimulationWorkspace } from '../components/simulation/SimulationWorkspace';
import { SimulationEventPanel } from '../components/simulation/SimulationEventPanel';
import { SimulationDefensePanel } from '../components/simulation/SimulationDefensePanel';
import { SimulationResult } from '../components/simulation/SimulationResult';
import { SimulationLearning } from '../components/simulation/SimulationLearning';
import { SimulationDefenseImpact } from '../components/simulation/SimulationDefenseImpact';
import { SimulationDecision } from '../components/simulation/SimulationDecision';
import { SimulationReplayComparison } from '../components/simulation/SimulationReplayComparison';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { calculateSimulationPath } from '../engine/simulationEngine';
import { updateLearningProfile } from '../engine/learningEngine';
import { generatePracticeRecommendations } from '../engine/recommendationEngine';
import { aiApi, type AgentResponse } from '../services/aiApi';
import { buildAIAgentContext } from '../services/aiContext';
import { CyberWorld3D } from '../components/simulation/CyberWorld3D';
import { SIMULATION_SCENARIOS } from '../data/simulationScenarios';
import type { HistoryRecord } from '../types/history';
import type { SimulationLearningUpdate } from '../types/learning';
import { runSecurityAnalysis } from '../engine/securityAnalysisEngine';
import type { SecurityAnalysisResult } from '../types/security-analysis';
import { DefenseSuccessInvestigation } from '../components/security-analysis/DefenseSuccessInvestigation';
import { SecurityFindings } from '../components/results/SecurityFindings';
import { RecommendedActions } from '../components/results/RecommendedActions';
import { BeforeAfterResults } from '../components/results/BeforeAfterResults';
import { VisualResults } from '../components/results/VisualResults';
import { SecurityReport } from '../components/results/SecurityReport';
import { buildComprehensiveResult } from '../engine/resultsAggregationEngine';
import type { ComprehensiveSimulationResult } from '../types/results';

export function SimulationLab() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addSimulationResult, securityControls, learningProfile, history, settings, effectivenessComparisons } = useCyberShadow();
  
  const initialScenarioId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const preselected = params.get('scenario');
    if (preselected && SIMULATION_SCENARIOS.find(s => s.id === preselected)) {
      return preselected;
    }
    return SIMULATION_SCENARIOS[0].id;
  }, [location.search]);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarioId);
  
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('STANDARD');
  const [replayOfRecord, setReplayOfRecord] = useState<HistoryRecord | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [userDecisions, setUserDecisions] = useState<UserDecisionsRecord>({});
  const [learningUpdate, setLearningUpdate] = useState<SimulationLearningUpdate | null>(null);
  
  const [completedRecord, setCompletedRecord] = useState<HistoryRecord | null>(null);
  const [securityAnalysis, setSecurityAnalysis] = useState<SecurityAnalysisResult | null>(null);
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [aiResult, setAiResult] = useState<AgentResponse | null>(null);
  const [_comprehensiveResult, setComprehensiveResult] = useState<ComprehensiveSimulationResult | null>(null);
  
  const scenario = useMemo(() => SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0], [selectedScenarioId]);
  
  // Recalculate plan if security controls or decisions change
  const simulationPlan = useMemo(() => {
    if (simulationState === 'idle') return null;
    return calculateSimulationPath(scenario, securityControls, userDecisions);
  }, [scenario, securityControls, userDecisions, simulationState]);

  const currentStep = simulationState !== 'idle' && simulationPlan && currentStepIndex < simulationPlan.stepsToRun.length 
    ? simulationPlan.stepsToRun[currentStepIndex] 
    : null;

  const isWaitingForDecision = simulationState === 'running' && 
    simulationPlan?.pendingDecision !== null && 
    simulationPlan?.pendingDecisionStepIndex === currentStepIndex;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    // Only progress automatically if we are running, have a plan, and NOT waiting for a decision on the current step
    if (simulationState === 'running' && simulationPlan && !isWaitingForDecision) {
      timer = setTimeout(() => {
        if (currentStepIndex < simulationPlan.stepsToRun.length - 1) {
          // Move to next step
          setCurrentStepIndex(prev => prev + 1);
        } else if (!simulationPlan.pendingDecision) {
          // Reached the end, and no pending decisions remain
          setSimulationState('completed');

          // Append to Simulation History
          const activeControls = Object.entries(securityControls)
            .filter(([, isActive]) => isActive)
            .map(([key]) => key.toUpperCase().replace('_', ' ') + ' ENABLED');

          const newRecord: HistoryRecord = {
            id: `hist_${Date.now()}`,
            scenarioId: scenario.id,
            scenarioName: scenario.name,
            category: scenario.category as any,
            difficulty: scenario.difficulty,
            date: new Date().toISOString(),
            duration: `${Math.round(simulationPlan.stepsToRun.length * 2.5)}s`,
            result: simulationPlan.outcome,
            risk: simulationPlan.impactLevel as any,
            defensesActive: activeControls.length > 0 ? activeControls : ['NO DEFENSES'],
            explanation: simulationPlan.finalExplanation,
            learningPoints: simulationPlan.stepsToRun.map(s => s.learningContext),
            attackPath: simulationPlan.stepsToRun.map(s => s.name),
            completedSteps: simulationPlan.stepsToRun.length,
            impactLevel: simulationPlan.impactLevel,
            controlResponsible: simulationPlan.controlResponsible || undefined,
            blockedAtStep: simulationPlan.isBlocked && simulationPlan.blockedAtStepIndex !== null ? simulationPlan.stepsToRun[simulationPlan.blockedAtStepIndex].name : undefined,
            defenseImpacts: simulationPlan.defenseImpacts,
            decisionsMade: simulationPlan.decisionsMadeHistory,
            protectiveDecisions: simulationPlan.decisionsMadeHistory.filter(d => d.isProtective).length,
            riskyDecisions: simulationPlan.decisionsMadeHistory.filter(d => !d.isProtective).length,
            decisionCount: simulationPlan.decisionsMadeHistory.length,
            runType: replayOfRecord ? 'REPLAY' : 'ORIGINAL',
            replayOfId: replayOfRecord ? replayOfRecord.id : undefined
          };
          
          const { update } = updateLearningProfile(learningProfile, newRecord);
          // Add recommendation to the update
          const recommendations = generatePracticeRecommendations(learningProfile, [newRecord, ...history]);
          update.practiceNext = recommendations[0] || undefined;
          setLearningUpdate(update);
          setCompletedRecord(newRecord);
          const analysis = runSecurityAnalysis(newRecord);
          setSecurityAnalysis(analysis);
          
          const recentComp = effectivenessComparisons.find(c => c.afterRunId === newRecord.id);

          const aggregated = buildComprehensiveResult({
            record: newRecord,
            learningProfile,
            fullHistory: history,
            precomputedLearningImpact: update,
            remediationEffectiveness: recentComp
          });
          setComprehensiveResult(aggregated);

          addSimulationResult(newRecord, simulationPlan.isBlocked);
        }
      }, 2500); 
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [simulationState, currentStepIndex, simulationPlan, scenario, securityControls, isWaitingForDecision, addSimulationResult, learningProfile, history, replayOfRecord, effectivenessComparisons]);

  useEffect(() => {
    let controller = new AbortController();
    
    if (simulationState === 'completed' && aiState === 'idle' && completedRecord && settings) {
      const runAi = async () => {
        setAiState('loading');
        try {
          const ctx = buildAIAgentContext(
             settings,
             learningProfile,
             [completedRecord, ...history.filter(h => h.id !== completedRecord.id)],
             scenario as any,
             learningUpdate?.practiceNext,
             completedRecord
          );
          
          const req = {
            message: "Analyze the completed simulation and provide educational reasoning.",
            context: ctx
          };
          
          const response = await aiApi.runAIAgent(req, controller.signal);
          if (response.success && response.reasoning) {
            setAiResult(response);
            setComprehensiveResult(prev => prev ? { ...prev, aiExplanation: response.reasoning } : null);
            setAiState('success');
          } else {
            setAiState('error');
          }
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            setAiState('error');
          }
        }
      };
      
      runAi();
    }
    
    return () => {
      controller.abort();
    };
  }, [simulationState, aiState, completedRecord, history, learningProfile, scenario, learningUpdate, settings]);

  const handleStart = () => {
    setUserDecisions({});
    setSimulationState('running');
    setCurrentStepIndex(0);
  };

  const handlePause = () => {
    if (simulationState === 'running') setSimulationState('paused');
  };

  const handleResume = () => {
    if (simulationState === 'paused') setSimulationState('running');
  };

  const handleRestart = () => {
    setSimulationState('idle');
    setCurrentStepIndex(0);
    setUserDecisions({});
    setLearningUpdate(null);
    setReplayOfRecord(null);
    setCompletedRecord(null);
    setSecurityAnalysis(null);
    setAiState('idle');
    setAiResult(null);
    setComprehensiveResult(null);
  };
  
  const handleReplay = () => {
    // Start replay
    // We assume the last run is the current one because it just finished. 
    // We can fetch it from history[0] if needed, but since we are replaying the just-finished one, we just need to set the state.
    setReplayOfRecord(history[0]);
    setUserDecisions({});
    setSimulationState('running');
    setCurrentStepIndex(0);
    setLearningUpdate(null);
    setCompletedRecord(null);
    setSecurityAnalysis(null);
    setAiState('idle');
    setAiResult(null);
    setComprehensiveResult(null);
  };

  const handleExit = () => {
    handleRestart();
  };

  const handleDecisionMade = (optionId: string) => {
    if (simulationPlan?.pendingDecision) {
      setUserDecisions(prev => ({
        ...prev,
        [simulationPlan.pendingDecision!.id]: optionId
      }));
      // The plan recalculates via useMemo. If there's no new decision on this same index, the timer continues.
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <Activity size={12} /> SIMULATION LAB / ISOLATED ENVIRONMENT
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Simulation Lab</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Experience fictional cyberattack scenarios and understand how security decisions change the outcome.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">SIMULATION ONLY</span>
          </div>
        </div>
      </div>

      {/* 3D CYBER WORLD - Always Visible */}
      <div className="animate-in fade-in duration-500">
        <CyberWorld3D
          scenario={scenario as any}
          simulationState={simulationState}
          simulationPlan={simulationPlan}
          currentStepIndex={currentStepIndex}
          onStartSimulation={handleStart}
        />
      </div>

      {simulationState === 'idle' ? (
        // --- SETUP PHASE ---
        <div className="space-y-8 animate-in fade-in duration-500">
          <SimulationScenarioSelector 
            scenarios={SIMULATION_SCENARIOS as any} 
            selectedId={selectedScenarioId} 
            onSelect={setSelectedScenarioId} 
          />

          <div className="bg-[#0b1120] border border-slate-800/80 p-8 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SELECTED SCENARIO</div>
                <h2 className="text-xl font-bold text-white tracking-wide mb-3">{scenario.name}</h2>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px] mr-2">ENVIRONMENT</span>
                    <span className="text-slate-300">ISOLATED / SYNTHETIC</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px] mr-2">DIFFICULTY</span>
                    <span className="text-slate-300">{scenario.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px] mr-2">ESTIMATED</span>
                    <span className="text-slate-300">{scenario.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-slate-800/80 pt-6">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">SIMULATION MODE</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setSimulationMode('STANDARD')}
                  className={`p-4 rounded-lg border text-left transition-all ${simulationMode === 'STANDARD' ? 'bg-cyan-950/20 border-cyan-500' : 'bg-[#060a14] border-slate-800 hover:border-slate-600'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${simulationMode === 'STANDARD' ? 'text-white' : 'text-slate-300'}`}>STANDARD</span>
                    {simulationMode === 'STANDARD' ? <CheckCircle2 size={16} className="text-cyan-500" /> : <Circle size={16} className="text-slate-600" />}
                  </div>
                  <div className="text-xs text-slate-400">Guided simulation with contextual explanations.</div>
                </button>
                <button
                  onClick={() => setSimulationMode('CHALLENGE')}
                  className={`p-4 rounded-lg border text-left transition-all ${simulationMode === 'CHALLENGE' ? 'bg-violet-950/20 border-violet-500' : 'bg-[#060a14] border-slate-800 hover:border-slate-600'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${simulationMode === 'CHALLENGE' ? 'text-white' : 'text-slate-300'}`}>CHALLENGE</span>
                    {simulationMode === 'CHALLENGE' ? <CheckCircle2 size={16} className="text-violet-500" /> : <Circle size={16} className="text-slate-600" />}
                  </div>
                  <div className="text-xs text-slate-400">Make security decisions with reduced guidance, then review your choices.</div>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto border-t border-slate-800/80 pt-6">
              <Button variant="secondary" onClick={() => navigate('/digital-twin')} className="flex-1 md:flex-none justify-center">
                VIEW DIGITAL TWIN
              </Button>
              <Button variant="primary" onClick={handleStart} className="flex-1 md:flex-none justify-center gap-2">
                <Play size={16} fill="currentColor" /> START SIMULATION
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // --- SIMULATION PHASE ---
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-[#060a14] border border-slate-800/80 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                PROGRESS: STEP {Math.min(currentStepIndex + 1, simulationPlan?.stepsToRun.length || 0)} / {simulationPlan?.stepsToRun.length || 0}
              </span>
              <div className="w-full sm:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${simulationState === 'completed' ? (simulationPlan?.isBlocked ? 'bg-green-500' : 'bg-red-500') : 'bg-cyan-500'}`}
                  style={{ width: `${((currentStepIndex + (simulationState === 'completed' ? 1 : 0)) / (simulationPlan?.stepsToRun.length || 1)) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
              {simulationState === 'running' && (
                <Button variant="secondary" size="sm" onClick={handlePause} className="gap-2 text-[10px] uppercase tracking-widest">
                  <Pause size={14} fill="currentColor" /> PAUSE
                </Button>
              )}
              {simulationState === 'paused' && (
                <Button variant="primary" size="sm" onClick={handleResume} className="gap-2 text-[10px] uppercase tracking-widest">
                  <Play size={14} fill="currentColor" /> RESUME
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={handleRestart} className="gap-2 text-[10px] uppercase tracking-widest">
                <RotateCcw size={14} /> RESTART
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExit} className="gap-2 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white">
                <LogOut size={14} /> EXIT
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {isWaitingForDecision && simulationPlan?.pendingDecision ? (
                <SimulationDecision 
                  decision={simulationPlan.pendingDecision} 
                  mode={simulationMode}
                  onDecisionMade={handleDecisionMade} 
                />
              ) : (
                <SimulationWorkspace 
                  scenario={{...scenario, steps: simulationPlan?.stepsToRun || []} as any} 
                  currentState={simulationState} 
                  currentStepIndex={currentStepIndex} 
                  simulationResult={simulationPlan?.outcome as any} 
                />
              )}
              
              <SimulationEventPanel 
                currentStep={currentStep as any} 
                isActive={simulationState === 'running'} 
              />
            </div>
            
            <div className="lg:col-span-1">
              <SimulationDefensePanel 
                mfaEnabled={securityControls.mfa} 
                onMfaToggle={() => {}} // Controlled globally via Security Center now
                isSimulating={true} 
              />
            </div>
          </div>
          
          {/* SIMULATION RESULT */}
          {simulationState === 'completed' && simulationPlan && (
            <div className="pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
              <SimulationResult 
                result={simulationPlan.outcome}
                title={simulationPlan.isBlocked ? scenario.successResult.title : scenario.blockedResult.title}
                description={simulationPlan.finalExplanation}
                keyFactor={simulationPlan.controlResponsible ? simulationPlan.controlResponsible.toUpperCase().replace(/_/g, ' ') : (simulationPlan.isBlocked ? scenario.successResult.keyFactor : scenario.blockedResult.keyFactor)}
                impactLevel={simulationPlan.impactLevel}
              />
              
              <SimulationDefenseImpact impacts={simulationPlan.defenseImpacts} />
              
              <div className="mt-8">
                <SimulationLearning 
                  feedback={simulationPlan.isBlocked ? scenario.successResult.learningFeedback : scenario.blockedResult.learningFeedback} 
                  decisionsHistory={simulationPlan.decisionsMadeHistory}
                  learningUpdate={learningUpdate}
                />
              </div>

              {/* PHASE 6.5: VISUAL RESULTS */}
              {_comprehensiveResult && (
                <VisualResults result={_comprehensiveResult} />
              )}

              {/* PHASE 6.6: SECURITY REPORT */}
              {_comprehensiveResult && (
                <SecurityReport result={_comprehensiveResult} />
              )}

              {/* DETERMINISTIC SECURITY ANALYSIS */}
              {securityAnalysis && (
                <div className="mt-8 border-t border-slate-800/50 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="text-blue-500" size={20} />
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-wide">SECURITY ANALYSIS</h3>
                      <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">
                        DETERMINISTIC SECURITY ANALYSIS • SIMULATION ONLY
                      </div>
                    </div>
                  </div>



                  {securityAnalysis.findings.length === 0 && securityAnalysis.positiveControls.length > 0 && (
                    <div className="mb-6">
                      <DefenseSuccessInvestigation 
                        positiveControls={securityAnalysis.positiveControls} 
                        scenarioCategory={completedRecord?.category || 'General'}
                        simulationResult={completedRecord?.result || 'ATTACK BLOCKED'}
                      />
                    </div>
                  )}

                  {securityAnalysis.findings.length > 0 && (
                    <>
                      <SecurityFindings result={_comprehensiveResult} />
                      <RecommendedActions result={_comprehensiveResult} />
                    </>
                  )}
                </div>
              )}

              {completedRecord && (
                (() => {
                  const recentComparison = effectivenessComparisons.find(c => c.afterRunId === completedRecord.id);
                  return recentComparison ? <BeforeAfterResults comparison={recentComparison} /> : null;
                })()
              )}

              {/* AI REASONING */}
              <div className="mt-8 border-t border-slate-800/50 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-cyan-500" size={20} />
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">AI LEARNING ANALYSIS</h3>
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">
                      {aiResult?.source === 'fallback' ? 'EDUCATIONAL FALLBACK ANALYSIS • GEMINI UNAVAILABLE' : 'AI-GENERATED EDUCATIONAL ANALYSIS • SIMULATION ONLY'}
                    </div>
                  </div>
                </div>

                {aiState === 'loading' && (
                  <div className="p-6 border border-slate-800/80 bg-[#060a14] rounded-lg flex items-center justify-center">
                    <div className="flex items-center gap-3 text-cyan-500">
                      <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-bold tracking-widest uppercase">Analyzing this simulation...</span>
                    </div>
                  </div>
                )}

                {aiState === 'error' && (
                  <div className="p-6 border border-red-500/30 bg-red-950/10 rounded-lg text-center">
                    <p className="text-slate-300 text-sm mb-4">AI analysis is temporarily unavailable.<br/>Your simulation result and learning progress are still saved.</p>
                    <Button variant="secondary" size="sm" onClick={() => setAiState('idle')}>RETRY ANALYSIS</Button>
                  </div>
                )}

                {aiState === 'success' && aiResult?.reasoning && (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SECURITY CONCEPT</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.securityConcept || aiResult.reasoning.learningConcept || 'General Cybersecurity'}</div>
                    </div>
                    <div className="p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">WHAT HAPPENED</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.situation || aiResult.explanation}</div>
                    </div>
                    <div className="p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">WHY IT HAPPENED</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.cause || 'No specific cause identified.'}</div>
                    </div>
                    <div className="p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">YOUR DECISION IMPACT</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.decisionImpact || aiResult.reasoning.defenseImpact || 'Not specified.'}</div>
                    </div>
                    <div className="p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">DEFENSE LESSON</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.defenseLesson || 'No specific defense lesson.'}</div>
                    </div>
                    <div className="p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SECURITY WEAKNESS</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.securityWeakness || 'None highlighted.'}</div>
                    </div>
                    <div className="p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">LEARNER INSIGHT</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.learnerInsight || 'Keep practicing to improve skills.'}</div>
                    </div>
                    <div className="p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">COMMON MISTAKE</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.commonMistake || 'Not specified.'}</div>
                    </div>
                    <div className="p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">PRACTICAL HABIT</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.practicalHabit || 'Not specified.'}</div>
                    </div>
                    <div className="md:col-span-2 p-5 border border-slate-800/80 bg-[#060a14] rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">FOCUSED PRACTICE</div>
                      <div className="text-sm text-slate-300">{aiResult.reasoning.focusedPractice || 'Not specified.'}</div>
                    </div>
                    <div className="md:col-span-2 p-5 border border-cyan-500/30 bg-cyan-950/20 rounded-lg">
                      <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2">NEXT LEARNING STEP</div>
                      <div className="text-sm text-white">{aiResult.reasoning.nextLearningStep || aiResult.recommendation}</div>
                    </div>
                  </div>
                  
                  {/* ADAPTIVE LEARNING */}
                  <div className="mt-6 border border-violet-500/30 bg-[#060a14] rounded-lg overflow-hidden">
                    <div className="bg-violet-950/20 px-5 py-3 border-b border-violet-500/30">
                      <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12} /> ADAPTIVE LEARNING
                      </div>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">LEARNER LEVEL</div>
                        <div className="text-sm text-slate-300">{aiResult.reasoning.learnerLevel || 'Not specified.'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">MASTERY CONNECTION</div>
                        <div className="text-sm text-slate-300">{aiResult.reasoning.masteryConnection || 'Not specified.'}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">MISTAKE PATTERN</div>
                        <div className="text-sm text-slate-300">{aiResult.reasoning.mistakePattern || 'Not specified.'}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">WHY THIS MATTERS</div>
                        <div className="text-sm text-slate-300">{aiResult.reasoning.reinforcementReason || 'Not specified.'}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ADAPTIVE PRACTICE</div>
                        <div className="text-sm text-slate-300">{aiResult.reasoning.adaptivePractice || 'Not specified.'}</div>
                      </div>
                    </div>
                  </div>
                </>
                )}
              </div>

              {replayOfRecord && history[0] && (
                <div className="mt-8 border-t border-slate-800/50 pt-8">
                  <SimulationReplayComparison 
                    firstRun={replayOfRecord} 
                    replayRun={history[0]} 
                  />
                </div>
              )}
              
              <div className="mt-12 text-center pb-8 border-t border-slate-800/50 pt-12">
                <h2 className="text-lg font-bold text-white tracking-wide mb-6">READY TO EXPERIMENT AGAIN?</h2>
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                  <Button variant="primary" onClick={handleReplay} className="gap-2 text-xs uppercase tracking-widest border-violet-500/50 hover:bg-violet-950/30 text-violet-100 bg-violet-900/20">
                    <RotateCcw size={14} /> REPLAY SCENARIO
                  </Button>
                  <Button variant="ghost" onClick={handleRestart} className="gap-2 text-xs uppercase tracking-widest">
                    <RotateCcw size={14} /> NEW RUN
                  </Button>
                  <Button variant="secondary" onClick={() => { handleRestart(); navigate('/scenarios'); }} className="gap-2 text-xs uppercase tracking-widest">
                    <Activity size={14} /> EXPLORE OTHER SCENARIOS
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/digital-twin')} className="gap-2 text-xs uppercase tracking-widest text-cyan-500">
                    <MonitorPlay size={14} /> VIEW DIGITAL TWIN
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
