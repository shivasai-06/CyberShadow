import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import {
  LayoutDashboard,
  MonitorPlay,
  ShieldAlert,
  TestTube2,
  History,
  FileText,
  ShieldCheck,
  Settings,
  GitCompareArrows,
  GraduationCap,
  Brain,
  Lock,
  ArrowRight,
  Play
} from 'lucide-react';

export function WelcomeGuide() {
  const navigate = useNavigate();

  const sidebarGuide = [
    { name: 'Dashboard', icon: LayoutDashboard, desc: 'Overview of your security posture and recent simulations.' },
    { name: 'Digital Twin', icon: MonitorPlay, desc: 'Manage your virtual infrastructure and configuration.' },
    { name: 'Scenarios', icon: ShieldAlert, desc: 'Browse and configure predefined attack scenarios.' },
    { name: 'Learning Path', icon: GraduationCap, desc: 'Adaptive practice, mastery progression, and security training.' },
    { name: 'Simulation Lab', icon: TestTube2, desc: 'Run fictional, non-destructive simulations against your digital twin.' },
    { name: 'What-If Lab', icon: GitCompareArrows, desc: 'Compare defensive configurations side-by-side.' },
    { name: 'History', icon: History, desc: 'Review past simulations and their outcomes.' },
    { name: 'Reports', icon: FileText, desc: 'Generate executive summaries and technical reports.' },
    { name: 'AI Assistant', icon: Brain, desc: 'Get intelligent security advice and remediation tips.' },
    { name: 'Security Center', icon: ShieldCheck, desc: 'Implement remediations and security controls.' },
    { name: 'Settings', icon: Settings, desc: 'Customize your CyberShadow learning and simulation experience.' }
  ];

  const workflowSteps = [
    'Build Digital Twin',
    'Simulate Attack',
    'Identify Weakness',
    'Change Defense',
    'Simulate Again',
    'Compare Results'
  ];

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Welcome to CyberShadow"
        description="Your AI-powered Digital Attack Simulation Twin is ready."
      />

      {/* Safety Banner */}
      <div className="flex items-center gap-3 p-4 bg-amber-950/20 border border-amber-900/30 rounded-lg">
        <Lock className="w-5 h-5 text-amber-500" />
        <div>
          <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest">Simulation Only - No Real System Access</h4>
          <p className="text-xs text-amber-500/70 mt-1">
            CyberShadow operates on a completely fictional, isolated digital twin. Simulated attacks do not interact with any real-world networks or production systems.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Workflow & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Panel title="Core Workflow" className="h-auto">
            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-950/50 border border-cyan-800 flex items-center justify-center text-xs font-bold text-cyan-400">
                    {index + 1}
                  </div>
                  <div className="text-sm text-gray-300 font-medium">{step}</div>
                  {index < workflowSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-600 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-900/30">
            <h3 className="text-lg font-bold text-white mb-4">Ready to start?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Begin by exploring your current security posture, or jump straight into a simulated attack.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/dashboard')} variant="primary" className="w-full justify-center">
                <LayoutDashboard className="w-4 h-4 mr-2" /> OPEN DASHBOARD
              </Button>
              <Button onClick={() => navigate('/simulation')} variant="secondary" className="w-full justify-center border-cyan-800 text-cyan-400 hover:bg-cyan-950/30">
                <Play className="w-4 h-4 mr-2" /> START SIMULATION
              </Button>
            </div>
          </Panel>
        </div>

        {/* Right Column: User Guide */}
        <div className="lg:col-span-2">
          <Panel title="Application Guide" className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sidebarGuide.map((item) => (
                <div key={item.name} className="flex gap-4 p-4 rounded-lg bg-[#060a14] border border-gray-800/50 hover:border-cyan-900/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-200 mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
