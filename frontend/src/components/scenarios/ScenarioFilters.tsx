import { Search, X } from 'lucide-react';
import type { ScenarioCategory } from '../../types/scenarios';

interface ScenarioFiltersProps {
  categories: ScenarioCategory[];
  selectedCategory: ScenarioCategory;
  onSelectCategory: (cat: ScenarioCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function ScenarioFilters({ categories, selectedCategory, onSelectCategory, searchQuery, onSearchChange }: ScenarioFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#060a14] p-4 rounded-lg border border-slate-800/80 mb-6">
      <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                : 'bg-[#0b1120] text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="relative w-full md:w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="SEARCH SCENARIOS..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#0b1120] border border-slate-800 rounded-md py-1.5 pl-9 pr-8 text-[10px] font-bold tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-cyan-700 transition-colors uppercase"
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
