import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Activity, Play, Pause, RotateCcw, MonitorPlay, LogOut } from 'lucide-react';
import type { SimulationScenario, SimulationState } from '../types/simulation';
import { SimulationScenarioSelector } from '../components/simulation/SimulationScenarioSelector';
import { SimulationWorkspace } from '../components/simulation/SimulationWorkspace';
import { SimulationEventPanel } from '../components/simulation/SimulationEventPanel';
import { SimulationDefensePanel } from '../components/simulation/SimulationDefensePanel';
import { SimulationResult } from '../components/simulation/SimulationResult';
import { SimulationLearning } from '../components/simulation/SimulationLearning';

const MOCK_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sc_phishing',
    name: 'PHISHING → ACCOUNT TAKEOVER',
    difficulty: 'BEGINNER',
    category: 'SOCIAL ENGINEERING',
    description: 'See how a fictional phishing message can lead to credential exposure and account compromise when defensive controls are weak.',
    estimatedTime: '~60 SECONDS',
    controlsInvolved: ['MFA', 'PASSWORD STRENGTH', 'SECURITY AWARENESS'],
    steps: [
      { id: 's1', name: 'MESSAGE', description: 'A simulated phishing email arrives in the fictional inbox.', learningContext: 'Attackers often begin with broad social engineering campaigns to find a weak entry point.' },
      { id: 's2', name: 'USER INTERACTION', description: 'The fictional user interacted with the simulated phishing message.', learningContext: 'Human interaction can become an important point in a simulated attack path.' },
      { id: 's3', name: 'FAKE LOGIN', description: 'The user is directed to a simulated fake login portal.', learningContext: 'Deceptive login pages are designed to harvest credentials silently.' },
      { id: 's4', name: 'CREDENTIAL EXPOSURE', description: 'The fictional credentials have been exposed to the simulated adversary.', learningContext: 'Exposed credentials are the primary enabler of account takeover if no other defenses exist.' },
      { id: 's5', name: 'ACCOUNT TAKEOVER', description: 'The simulated adversary uses the credentials to access the account.', learningContext: 'Without secondary authentication, a password breach leads directly to compromise.', isDefenseCheckpoint: true, controlEvaluated: 'MFA' }
    ],
    successResult: {
      title: 'ATTACK BLOCKED',
      description: 'The simulated credential exposure reached an MFA checkpoint and the fictional attack path was stopped.',
      keyFactor: 'MFA'
    },
    blockedResult: {
      title: 'SIMULATED COMPROMISE',
      description: 'The fictional attack path reached the account because the simulated identity lacked an additional authentication control.',
      keyFactor: 'MFA'
    }
  },
  {
    id: 'sc_attachment',
    name: 'MALICIOUS ATTACHMENT',
    difficulty: 'INTERMEDIATE',
    category: 'ENDPOINT SECURITY',
    description: 'Explore how a fictional malicious attachment can move from user interaction toward endpoint exposure.',
    estimatedTime: '~60 SECONDS',
    controlsInvolved: ['ENDPOINT PROTECTION', 'SECURITY AWARENESS'],
    steps: [
      { id: 'a1', name: 'EMAIL', description: 'A simulated email containing a malicious attachment arrives.', learningContext: 'Attachments are common vectors for delivering malware.' },
      { id: 'a2', name: 'ATTACHMENT', description: 'The attachment is downloaded to the local device.', learningContext: 'File-based threats often require user execution to activate.' },
      { id: 'a3', name: 'USER OPENS FILE', description: 'The fictional user opens the simulated attachment.', learningContext: 'Executing unknown files bypasses initial perimeter defenses.' },
      { id: 'a4', name: 'ENDPOINT EXPOSURE', description: 'The simulated malware attempts to execute on the endpoint.', learningContext: 'Endpoint protection platforms evaluate processes at execution time.' },
      { id: 'a5', name: 'SIMULATED IMPACT', description: 'The fictional malware achieves persistence.', learningContext: 'Without adequate endpoint controls, devices can become fully compromised.', isDefenseCheckpoint: true, controlEvaluated: 'MFA' } // using MFA toggle to represent general control for simplicity
    ],
    successResult: {
      title: 'ATTACK BLOCKED',
      description: 'The simulated endpoint protection quarantined the file before execution could complete.',
      keyFactor: 'DEFENSE CONTROL'
    },
    blockedResult: {
      title: 'SIMULATED COMPROMISE',
      description: 'The fictional attack path infected the endpoint because the simulated device lacked strict execution controls.',
      keyFactor: 'EXECUTION CONTROL'
    }
  },
  {
    id: 'sc_password',
    name: 'WEAK PASSWORD',
    difficulty: 'BEGINNER',
    category: 'IDENTITY SECURITY',
    description: 'Understand how weak authentication controls can increase the simulated risk of account compromise.',
    estimatedTime: '~45 SECONDS',
    controlsInvolved: ['PASSWORD STRENGTH', 'MFA'],
    steps: [
      { id: 'p1', name: 'WEAK PASSWORD', description: 'The fictional user sets a weak password (e.g., Password123).', learningContext: 'Weak passwords are easily guessable or crackable.' },
      { id: 'p2', name: 'LOGIN ATTEMPT', description: 'A simulated adversary attempts to guess the password.', learningContext: 'Brute force and credential stuffing attacks exploit weak passwords.' },
      { id: 'p3', name: 'AUTHENTICATION', description: 'The simulated password guess is successful.', learningContext: 'Without complexity requirements, passwords offer minimal protection.' },
      { id: 'p4', name: 'ACCOUNT ACCESS', description: 'The simulated adversary gains access to the account.', learningContext: 'Additional authentication layers are required to secure weak passwords.' },
      { id: 'p5', name: 'SIMULATED COMPROMISE', description: 'The fictional account is compromised.', learningContext: 'A single point of failure in authentication leads to compromise.', isDefenseCheckpoint: true, controlEvaluated: 'MFA' }
    ],
    successResult: {
      title: 'ATTACK BLOCKED',
      description: 'The simulated adversary guessed the password, but the login was blocked by an MFA challenge.',
      keyFactor: 'MFA'
    },
    blockedResult: {
      title: 'SIMULATED COMPROMISE',
      description: 'The fictional attack path succeeded because the weak password was the only barrier to entry.',
      keyFactor: 'MFA'
    }
  }
];

export function SimulationLab() {
  const navigate = useNavigate();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(MOCK_SCENARIOS[0].id);
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<'COMPROMISED' | 'BLOCKED' | null>(null);

  const scenario = MOCK_SCENARIOS.find(s => s.id === selectedScenarioId) || MOCK_SCENARIOS[0];
  const currentStep = simulationState !== 'idle' ? scenario.steps[currentStepIndex] : null;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (simulationState === 'running') {
      timer = setTimeout(() => {
        if (currentStepIndex < scenario.steps.length - 1) {
          // Move to next step
          setCurrentStepIndex(prev => prev + 1);
        } else {
          // Evaluate outcome on final step
          const isBlocked = mfaEnabled; // Simple logic: if MFA is ON, block it
          setSimulationResult(isBlocked ? 'BLOCKED' : 'COMPROMISED');
          setSimulationState('completed');
        }
      }, 2500); // 2.5 seconds per step for demonstration
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [simulationState, currentStepIndex, scenario.steps.length, mfaEnabled]);

  const handleStart = () => {
    setSimulationState('running');
    setCurrentStepIndex(0);
    setSimulationResult(null);
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
    setSimulationResult(null);
  };

  const handleExit = () => {
    handleRestart();
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

      {simulationState === 'idle' ? (
        // --- SETUP PHASE ---
        <div className="space-y-8 animate-in fade-in duration-500">
          <SimulationScenarioSelector 
            scenarios={MOCK_SCENARIOS} 
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
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Button variant="secondary" onClick={() => navigate('/digital-twin')} className="flex-1 md:flex-none justify-center">
                  VIEW DIGITAL TWIN
                </Button>
                <Button variant="primary" onClick={handleStart} className="flex-1 md:flex-none justify-center gap-2">
                  <Play size={16} fill="currentColor" /> START SIMULATION
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // --- SIMULATION PHASE ---
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#060a14] border border-slate-800/80 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                PROGRESS: STEP {Math.min(currentStepIndex + 1, scenario.steps.length)} / {scenario.steps.length}
              </span>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${simulationResult === 'BLOCKED' ? 'bg-green-500' : simulationResult === 'COMPROMISED' ? 'bg-red-500' : 'bg-cyan-500'}`}
                  style={{ width: `${((currentStepIndex + (simulationState === 'completed' ? 1 : 0)) / scenario.steps.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
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
              <SimulationWorkspace 
                scenario={scenario} 
                currentState={simulationState} 
                currentStepIndex={currentStepIndex} 
                simulationResult={simulationResult} 
              />
              <SimulationEventPanel 
                currentStep={currentStep} 
                isActive={simulationState === 'running'} 
              />
            </div>
            
            <div className="lg:col-span-1">
              <SimulationDefensePanel 
                mfaEnabled={mfaEnabled} 
                onMfaToggle={setMfaEnabled} 
                isSimulating={true} 
              />
            </div>
          </div>
          
          {/* SIMULATION RESULT */}
          {simulationState === 'completed' && simulationResult && (
            <div className="pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <SimulationResult 
                result={simulationResult}
                title={simulationResult === 'BLOCKED' ? scenario.successResult.title : scenario.blockedResult.title}
                description={simulationResult === 'BLOCKED' ? scenario.successResult.description : scenario.blockedResult.description}
                keyFactor={simulationResult === 'BLOCKED' ? scenario.successResult.keyFactor : scenario.blockedResult.keyFactor}
              />
              
              <div className="mt-8">
                <SimulationLearning />
              </div>
              
              <div className="mt-12 text-center pb-8 border-t border-slate-800/50 pt-12">
                <h2 className="text-lg font-bold text-white tracking-wide mb-6">READY TO EXPERIMENT AGAIN?</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="primary" onClick={handleRestart} className="gap-2 text-xs uppercase tracking-widest">
                    <RotateCcw size={14} /> RUN AGAIN
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
