import type { ReportInsight } from '../../types/reports';
import { Lightbulb } from 'lucide-react';

interface ReportInsightsProps {
  insights: ReportInsight[];
}

export function ReportInsights({ insights }: ReportInsightsProps) {
  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">LEARNING INSIGHTS</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-[#060a14] border border-violet-900/30 border-l-2 border-l-violet-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2 text-violet-400">
              <Lightbulb size={12} />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">{insight.category}</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
