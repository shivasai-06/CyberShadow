import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ShieldAlert } from 'lucide-react';
import type { HistoryFilterType } from '../components/history/HistoryFilters';
import { MOCK_HISTORY_RECORDS, MOCK_LEARNING_PROGRESS, MOCK_LEARNING_INSIGHTS } from '../data/historyData';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryList } from '../components/history/HistoryList';
import { HistoryDetail } from '../components/history/HistoryDetail';
import { LearningProgress } from '../components/history/LearningProgress';
import { LearningInsights } from '../components/history/LearningInsights';
import { Button } from '../components/ui/Button';

export function History() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const filteredRecords = MOCK_HISTORY_RECORDS.filter(record => {
    // Check filter
    const matchesFilter = (() => {
      if (selectedFilter === 'ALL') return true;
      if (selectedFilter === 'BLOCKED') return record.result === 'ATTACK BLOCKED';
      if (selectedFilter === 'COMPROMISED') return record.result === 'SIMULATED COMPROMISE';
      if (['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(selectedFilter)) {
        return record.difficulty === selectedFilter;
      }
      return true;
    })();

    // Check search
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      record.scenarioName.toLowerCase().includes(searchLower) ||
      record.category.toLowerCase().includes(searchLower) ||
      record.result.toLowerCase().includes(searchLower) ||
      record.learningPoints.some(p => p.toLowerCase().includes(searchLower));
    
    return matchesFilter && matchesSearch;
  });

  const selectedRecord = selectedRecordId 
    ? MOCK_HISTORY_RECORDS.find(r => r.id === selectedRecordId) 
    : null;

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-violet-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <Clock size={12} /> SIMULATION HISTORY / LEARNING PROGRESS
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">History & Progress</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Review completed fictional simulations, analyze the impact of defense controls, and track your learning progress.
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

      {MOCK_HISTORY_RECORDS.length === 0 ? (
        // FIRST-TIME EMPTY STATE
        <div className="animate-in fade-in duration-500 py-20 flex flex-col items-center justify-center text-center bg-[#0b1120] rounded-lg border border-slate-800/80">
          <ShieldAlert size={48} className="text-slate-700 mb-6" />
          <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2">NO SIMULATIONS YET</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-md leading-relaxed">
            Run your first fictional attack simulation to start building your learning history and unlocking intelligence insights.
          </p>
          <Button variant="primary" onClick={() => navigate('/scenarios')} className="text-xs uppercase tracking-widest gap-2">
            EXPLORE SCENARIOS
          </Button>
        </div>
      ) : selectedRecord ? (
        <HistoryDetail 
          record={selectedRecord} 
          onBack={() => setSelectedRecordId(null)} 
        />
      ) : (
        <div className="animate-in fade-in duration-500 space-y-8">
          
          {/* TOP METRICS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <LearningProgress metrics={MOCK_LEARNING_PROGRESS} />
            </div>
            <div className="md:col-span-1">
              <LearningInsights insights={MOCK_LEARNING_INSIGHTS} />
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-8">
            <h3 className="text-lg font-bold text-white tracking-wide mb-6">Simulation Records</h3>
            <HistoryFilters 
              selectedFilter={selectedFilter}
              onSelectFilter={setSelectedFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            {filteredRecords.length > 0 ? (
              <HistoryList 
                records={filteredRecords}
                onView={setSelectedRecordId}
              />
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center bg-[#0b1120] rounded-lg border border-slate-800/80">
                <Clock size={32} className="text-slate-700 mb-4" />
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">NO RECORDS FOUND</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-sm">No history records match the current filters or search query.</p>
                <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedFilter('ALL'); }} className="text-[10px] tracking-widest uppercase">
                  CLEAR FILTERS
                </Button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
