import { Panel } from '../ui/Panel';
import { Info, HelpCircle, Shield, AlertTriangle, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import type { LearningFeedback, UserDecisionHistory } from '../../types/simulation';
import type { SimulationLearningUpdate } from '../../types/learning';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { PracticeRecommendation } from '../history/PracticeRecommendation';

interface SimulationLearningProps {
  feedback?: LearningFeedback;
  decisionsHistory?: UserDecisionHistory[];
  learningUpdate?: SimulationLearningUpdate | null;
}

export function SimulationLearning({ feedback, decisionsHistory = [], learningUpdate }: SimulationLearningProps) {
  if (!feedback) {
    return null; 
  }

  const hasDecisions = decisionsHistory && decisionsHistory.length > 0;

  return (
    <div className="space-y-8">
      
      {hasDecisions && (
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">YOUR DECISIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decisionsHistory.map((decision, idx) => (
              <Panel key={idx} className={`bg-[#060a14] border-slate-800/60 p-4 relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none ${decision.isProtective ? 'text-green-500' : 'text-red-500'}`}>
                  {decision.isProtective ? <CheckCircle2 size={100} /> : <XCircle size={100} />}
                </div>
                
                <h3 className="text-[10px] font-bold text-slate-500 tracking-wide uppercase mb-2">
                  {decision.situation}
                </h3>
                
                <div className="flex items-start gap-3 z-10 relative">
                  <div className={`mt-0.5 shrink-0 ${decision.isProtective ? 'text-green-500' : 'text-red-500'}`}>
                    {decision.isProtective ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{decision.label}</div>
                    <div className={`text-[10px] uppercase tracking-widest font-bold ${decision.isProtective ? 'text-green-400' : 'text-red-400'}`}>
                      {decision.isProtective ? 'Protective decision' : 'Risky decision'}
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
          
          <Panel className="bg-blue-950/10 border-blue-900/30 flex items-start gap-4">
            <div className="p-2 rounded bg-blue-900/40 text-blue-300 border border-blue-800/50 shrink-0">
              <Lightbulb size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-blue-400 tracking-wide uppercase mb-1">DECISION LESSON</h3>
              <p className="text-sm font-medium text-blue-100 leading-relaxed">
                {decisionsHistory.every(d => d.isProtective) 
                  ? "Your protective choices proactively disrupted the simulated attack before it could progress deeply."
                  : (decisionsHistory.some(d => d.isProtective)
                      ? "A mix of decisions were made. Protective decisions interrupt attack paths, while risky ones rely entirely on automated controls."
                      : "Risky decisions allowed the simulated attack to advance, placing the entire burden of defense on your automated security controls."
                    )
                }
              </p>
            </div>
          </Panel>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">LEARNING INSIGHTS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Panel className="bg-[#060a14] border-slate-800/60 flex items-start gap-4">
            <div className="p-2 rounded bg-blue-950/30 text-blue-400 border border-blue-900/50 shrink-0">
              <Info size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-wide uppercase mb-1">WHAT HAPPENED</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {feedback.whatHappened}
              </p>
            </div>
          </Panel>

          <Panel className="bg-[#060a14] border-slate-800/60 flex items-start gap-4">
            <div className="p-2 rounded bg-amber-950/30 text-amber-400 border border-amber-900/50 shrink-0">
              <HelpCircle size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-wide uppercase mb-1">WHY IT HAPPENED</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {feedback.whyItHappened}
              </p>
            </div>
          </Panel>

          {feedback.whatStoppedIt && (
            <Panel className="bg-[#060a14] border-slate-800/60 flex items-start gap-4 md:col-span-2">
              <div className="p-2 rounded bg-green-950/30 text-green-400 border border-green-900/50 shrink-0">
                <Shield size={16} />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 tracking-wide uppercase mb-1">WHAT STOPPED IT</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {feedback.whatStoppedIt}
                </p>
              </div>
            </Panel>
          )}

          {feedback.whatCouldHaveHelped && (
            <Panel className="bg-[#060a14] border-slate-800/60 flex items-start gap-4 md:col-span-2">
              <div className="p-2 rounded bg-red-950/30 text-red-400 border border-red-900/50 shrink-0">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 tracking-wide uppercase mb-1">WHAT COULD HAVE HELPED</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {feedback.whatCouldHaveHelped}
                </p>
              </div>
            </Panel>
          )}

          <Panel className="bg-violet-950/10 border-violet-900/30 flex items-start gap-4 md:col-span-2">
            <div className="p-2 rounded bg-violet-900/40 text-violet-300 border border-violet-800/50 shrink-0">
              <Lightbulb size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-violet-400 tracking-wide uppercase mb-1">KEY LESSON</h3>
              <p className="text-sm font-medium text-violet-100 leading-relaxed">
                {feedback.keyLesson}
              </p>
            </div>
          </Panel>
        </div>
      </div>
      
      {learningUpdate && (
        <div className="space-y-4 pt-4">
          <h2 className="text-[11px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <Activity size={14} /> LEARNING UPDATE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningUpdate.deltas.map((delta, idx) => (
              <Panel key={idx} className="bg-[#060a14] border-slate-800/60 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 tracking-wide uppercase mb-1">SKILL PRACTICED</h3>
                  <div className="text-sm font-bold text-white">{delta.skillName || delta.skillId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
                </div>
                <div className={`flex items-center gap-1 font-bold ${delta.masteryChange > 0 ? 'text-green-500' : (delta.masteryChange < 0 ? 'text-red-500' : 'text-slate-400')}`}>
                  {delta.masteryChange > 0 ? <ArrowUp size={16} /> : (delta.masteryChange < 0 ? <ArrowDown size={16} /> : null)}
                  {delta.masteryChange > 0 ? '+' : ''}{delta.masteryChange} <span className="text-[10px] font-normal uppercase tracking-widest text-slate-500 ml-1">simulated mastery</span>
                </div>
              </Panel>
            ))}
          </div>

          {learningUpdate.practiceNext && (
            <div className="mt-4">
              <PracticeRecommendation recommendation={learningUpdate.practiceNext} compact={true} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
