import { useState } from 'react';
import { Brain, AlertCircle, RefreshCw } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { aiApi } from '../../services/aiApi';
import type { DashboardAIResponse } from '../../types/ai';

interface AIIntelligenceProps {
  metrics: any;
  trend: string;
  recentHistory: any[];
  remediations: any[];
}

export function AIIntelligence({ metrics, trend, recentHistory, remediations }: AIIntelligenceProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DashboardAIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasData = metrics.totalSimulations > 0 || recentHistory.length > 0;

  const analyzeState = async () => {
    if (!hasData) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await aiApi.analyzeDashboard({
        metrics,
        trend,
        recentHistory,
        remediations
      });
      if (result.success) {
        setResponse(result);
      } else {
        setError(result.error || 'AI intelligence is temporarily unavailable. Deterministic security data remains available below.');
      }
    } catch {
      setError('AI intelligence is temporarily unavailable. Deterministic security data remains available below.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4 ml-1 mt-10">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
          <Brain size={14} className="text-purple-400" />
          AI SECURITY INTELLIGENCE
        </h2>
        {hasData && (
          <button
            onClick={analyzeState}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-800/50 rounded text-[10px] uppercase tracking-wider text-purple-300 font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            {response ? 'REFRESH AI INSIGHT' : 'ANALYZE SECURITY STATE'}
          </button>
        )}
      </div>

      <Panel className="p-0 overflow-hidden relative">
        {!hasData ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <Brain size={32} className="text-slate-700 mb-4" />
            <div className="text-slate-400 text-sm">Run a simulation to generate AI security intelligence.</div>
          </div>
        ) : loading && !response ? (
          <div className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <RefreshCw size={24} className="text-purple-500 animate-spin mb-4" />
            <div className="text-purple-400/80 text-xs tracking-widest uppercase font-bold animate-pulse">ANALYZING SIMULATION STATE...</div>
          </div>
        ) : error && !response ? (
          <div className="p-6 flex flex-col items-center justify-center text-center text-red-400/90 min-h-[150px]">
            <AlertCircle size={24} className="mb-3" />
            <div className="text-xs">{error}</div>
          </div>
        ) : response ? (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/50">
            <div className="p-5 flex flex-col gap-5 bg-gradient-to-br from-purple-950/10 to-transparent">
              <div>
                <h3 className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-2">SUMMARY</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{response.summary}</p>
              </div>
              <div>
                <h3 className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-2">ATTENTION</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{response.attention}</p>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-5 bg-gradient-to-bl from-cyan-950/10 to-transparent">
              <div>
                <h3 className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-2">DEFENSIVE INSIGHT</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{response.defensiveInsight}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-800/50">
                <h3 className="text-[9px] font-bold text-green-400 uppercase tracking-widest mb-2">NEXT STEP</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">{response.nextStep}</p>
              </div>
            </div>
            
            {/* Overlay loading state during refresh */}
            {loading && (
              <div className="absolute inset-0 bg-[#060a14]/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <RefreshCw size={24} className="text-purple-500 animate-spin mb-4" />
                <div className="text-purple-400/80 text-xs tracking-widest uppercase font-bold animate-pulse">ANALYZING SIMULATION STATE...</div>
              </div>
            )}
            
            {/* Floating error toast during refresh failure */}
            {error && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-950/90 border border-red-900/50 text-red-200 text-xs px-4 py-2 rounded shadow-lg z-20 flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <Brain size={32} className="text-slate-700 mb-4" />
            <div className="text-slate-400 text-sm max-w-sm">Click 'Analyze Security State' to generate intelligence based on your recent simulations and current defenses.</div>
          </div>
        )}
      </Panel>
    </div>
  );
}
