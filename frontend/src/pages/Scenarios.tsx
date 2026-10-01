import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import type { ScenarioCategory, ScenarioDefinition } from '../types/scenarios';
import { MOCK_SCENARIOS_DATA } from '../data/scenariosData';
import { scenarioApi } from '../services/scenarioApi';
import { ScenarioFilters } from '../components/scenarios/ScenarioFilters';
import { ScenarioCard } from '../components/scenarios/ScenarioCard';
import { ScenarioDetails } from '../components/scenarios/ScenarioDetails';
import { Button } from '../components/ui/Button';

const CATEGORIES: ScenarioCategory[] = ['ALL', 'IDENTITY', 'SOCIAL ENGINEERING', 'ENDPOINT', 'DATA', 'CLOUD'];

export function Scenarios() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ScenarioCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>(MOCK_SCENARIOS_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await scenarioApi.getScenarios();
        setScenarios(data);
      } catch (error) {
        console.warn('Backend unavailable or failed to load scenarios, falling back to local data', error);
        setScenarios(MOCK_SCENARIOS_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, []);

  const handleLaunch = (_id: string) => {
    // Navigate to Simulation Lab. 
    // In a real app we might pass the ID via state or search params.
    navigate('/simulation');
  };

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesCategory = selectedCategory === 'ALL' || scenario.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      scenario.title.toLowerCase().includes(searchLower) ||
      scenario.description.toLowerCase().includes(searchLower) ||
      scenario.category.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesSearch;
  });

  const selectedScenario = selectedScenarioId 
    ? scenarios.find(s => s.id === selectedScenarioId) 
    : null;

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <BookOpen size={12} /> SCENARIO LIBRARY / FICTIONAL ENVIRONMENT
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Cyber Scenarios</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Explore fictional cyberattack scenarios, understand how they unfold, and safely experience them inside CyberShadow.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">SIMULATION ONLY</span>
          </div>
          <div className="text-[9px] font-mono text-slate-500 tracking-widest uppercase mb-4">
            FICTIONAL DATA · ISOLATED ENVIRONMENT
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/learning-path')} className="text-[10px] uppercase tracking-widest text-violet-300 border-violet-900 hover:bg-violet-950/30">
            VIEW MY LEARNING PATH
          </Button>
        </div>
      </div>

      {selectedScenario ? (
        <ScenarioDetails 
          scenario={selectedScenario} 
          onBack={() => setSelectedScenarioId(null)} 
          onLaunch={() => handleLaunch(selectedScenario.id)}
        />
      ) : (
        <div className="animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-4">
            <div className="flex gap-4 text-[10px] font-mono text-slate-500 tracking-widest uppercase">
              <span className="text-white font-bold">{scenarios.length} FICTIONAL SCENARIOS</span>
              <span>•</span>
              <span>5 CATEGORIES</span>
              <span>•</span>
              <span className="text-green-500">0 REAL SYSTEMS</span>
              {loading && <span className="text-amber-500 animate-pulse">LOADING...</span>}
            </div>
          </div>
          
          <ScenarioFilters 
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          {filteredScenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScenarios.map(scenario => (
                <ScenarioCard 
                  key={scenario.id} 
                  scenario={scenario} 
                  onView={() => setSelectedScenarioId(scenario.id)}
                  onLaunch={() => handleLaunch(scenario.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-[#060a14] rounded-lg border border-slate-800/80">
              <BookOpen size={32} className="text-slate-700 mb-4" />
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">NO SCENARIOS FOUND</h3>
              <p className="text-xs text-slate-500 mb-6 max-w-sm">Try another search term or category to find fictional scenarios.</p>
              <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }} className="text-[10px] tracking-widest uppercase">
                CLEAR FILTERS
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
