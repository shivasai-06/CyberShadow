import { useNavigate } from 'react-router-dom';
import { FileText, ShieldAlert, Download } from 'lucide-react';
import { MOCK_REPORT_DATA } from '../data/reportsData';
import { ReportOverview } from '../components/reports/ReportOverview';
import { ScenarioPerformance } from '../components/reports/ScenarioPerformance';
import { DefenseControlImpact } from '../components/reports/DefenseControlImpact';
import { ReportInsights } from '../components/reports/ReportInsights';
import { AttackPathAnalysis } from '../components/reports/AttackPathAnalysis';
import { LearningRecommendations } from '../components/reports/LearningRecommendations';
import { Button } from '../components/ui/Button';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { ReportPostureSummary } from '../components/reports/ReportPostureSummary';
import { ReportRemediationSummary } from '../components/reports/ReportRemediationSummary';

export function Reports() {
  const navigate = useNavigate();
  const { history, securityPosture, remediations } = useCyberShadow();
  
  // Use history to determine if we have data, to align with Phase 5.2 deterministic posture
  const hasData = history.length > 0;

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <FileText size={12} /> SIMULATION REPORT
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Insights</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Understand how fictional attack scenarios behaved across your learning sessions and how defense controls changed outcomes.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">SIMULATION ONLY</span>
          </div>
          <div className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">
            FICTIONAL DATA · NO REAL SYSTEMS AFFECTED
          </div>
        </div>
      </div>

      {!hasData ? (
        // EMPTY STATE
        <div className="animate-in fade-in duration-500 py-20 flex flex-col items-center justify-center text-center bg-[#0b1120] rounded-lg border border-slate-800/80">
          <ShieldAlert size={48} className="text-slate-700 mb-6" />
          <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2">NO REPORT DATA YET</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-md leading-relaxed">
            Complete a fictional simulation to begin building your learning report and security insights.
          </p>
          <Button variant="primary" onClick={() => navigate('/simulation')} className="text-xs uppercase tracking-widest gap-2">
            START SIMULATION
          </Button>
        </div>
      ) : (
        // REPORT CONTENT
        <div className="animate-in fade-in duration-500 space-y-8">
          
          <ReportOverview metrics={MOCK_REPORT_DATA.overview} />
          
          <ReportPostureSummary posture={securityPosture} />
          
          <ReportRemediationSummary remediations={remediations} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScenarioPerformance performance={MOCK_REPORT_DATA.scenarioPerformance} />
            <ReportInsights insights={MOCK_REPORT_DATA.insights} />
          </div>
          
          <DefenseControlImpact impacts={MOCK_REPORT_DATA.defenseImpacts} />
          
          <AttackPathAnalysis paths={MOCK_REPORT_DATA.attackPaths} />
          
          <LearningRecommendations recommendations={MOCK_REPORT_DATA.recommendations} />
          
          {/* REPORT ACTIONS */}
          <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">REPORT ACTIONS</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" onClick={() => navigate('/history')} className="text-[10px] uppercase tracking-widest">
                VIEW HISTORY
              </Button>
              <Button variant="secondary" onClick={() => navigate('/scenarios')} className="text-[10px] uppercase tracking-widest">
                EXPLORE SCENARIOS
              </Button>
              <div className="relative group">
                <Button variant="ghost" disabled className="text-[10px] uppercase tracking-widest border border-slate-800 opacity-50 cursor-not-allowed gap-2">
                  <Download size={14} /> EXPORT REPORT
                </Button>
                <div className="absolute -top-3 -right-2 px-1.5 py-0.5 bg-cyan-900/80 border border-cyan-700 rounded text-[8px] font-bold text-cyan-100 uppercase tracking-widest">
                  COMING SOON
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
