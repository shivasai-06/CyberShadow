import type { LearningInsight } from '../../types/history';
import { Lightbulb } from 'lucide-react';

interface LearningInsightsProps {
  insights: LearningInsight[];
}

export function LearningInsights({ insights }: LearningInsightsProps) {
  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb size={14} className="text-violet-500" />
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WHAT YOU'RE LEARNING</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map(insight => (
          <div key={insight.id} className="bg-[#060a14] p-4 rounded border border-slate-800 hover:border-violet-900/50 transition-colors">
            <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">
              {insight.title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="pt-6 mt-4 border-t border-slate-800/80">
        <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
          INSIGHTS ARE GENERATED FROM YOUR SIMULATION HISTORY.
        </p>
      </div>
    </div>
  );
}
