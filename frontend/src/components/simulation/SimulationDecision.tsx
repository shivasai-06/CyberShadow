import { useState } from 'react';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { CheckCircle2, AlertCircle, Play } from 'lucide-react';
import type { SimulationDecision as DecisionType, DecisionOption, SimulationMode } from '../../types/simulation';

interface SimulationDecisionProps {
  decision: DecisionType;
  mode: SimulationMode;
  onDecisionMade: (optionId: string) => void;
}

export function SimulationDecision({ decision, mode, onDecisionMade }: SimulationDecisionProps) {
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (option: DecisionOption) => {
    if (!confirmed) {
      setSelectedOption(option);
    }
  };

  const handleConfirm = () => {
    if (selectedOption && !confirmed) {
      setConfirmed(true);
      // Let the user read the consequence before continuing
    }
  };

  const handleContinue = () => {
    if (selectedOption && confirmed) {
      onDecisionMade(selectedOption.id);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Panel className="border-blue-900/50 bg-[#060a14] p-6 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-blue-500">
          <AlertCircle size={200} />
        </div>
        
        <div className="z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${mode === 'CHALLENGE' ? 'text-violet-400 bg-violet-900/20 border-violet-900/50' : 'text-blue-400 bg-blue-900/20 border-blue-900/50'}`}>
              {mode === 'CHALLENGE' ? 'CHALLENGE DECISION' : 'INTERACTIVE DECISION'}
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{decision.title}</h2>
          <p className="text-slate-300 mb-2">{decision.situation}</p>
          {mode === 'STANDARD' && (
            <p className="text-sm text-slate-500 italic mb-6">{decision.explanation}</p>
          )}
          <div className={mode === 'CHALLENGE' ? 'mb-6' : ''} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {decision.options.map((option) => {
              const isSelected = selectedOption?.id === option.id;
              
              let borderClass = 'border-slate-800 hover:border-blue-900/50';
              let bgClass = 'bg-[#0a0f1c]';
              
              if (isSelected) {
                if (!confirmed) {
                  borderClass = 'border-blue-500';
                  bgClass = 'bg-blue-950/20';
                } else {
                  borderClass = option.isProtective ? 'border-green-500' : 'border-red-500';
                  bgClass = option.isProtective ? 'bg-green-950/20' : 'bg-red-950/20';
                }
              }
              
              return (
                <button
                  key={option.id}
                  disabled={confirmed}
                  onClick={() => handleSelect(option)}
                  className={`text-left p-4 rounded-lg border transition-all ${borderClass} ${bgClass} flex flex-col gap-2 relative ${!confirmed ? 'cursor-pointer hover:bg-slate-900' : 'cursor-default'}`}
                >
                  <div className="font-bold text-sm text-white">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.description}</div>
                  
                  {isSelected && confirmed && (
                    <div className="absolute top-4 right-4">
                      {option.isProtective ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : (
                        <AlertCircle size={20} className="text-red-500" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {confirmed && selectedOption && (
            <div className={`p-4 rounded-lg border animate-in fade-in slide-in-from-top-2 duration-300 mb-6 ${
              selectedOption.isProtective ? 'bg-green-950/20 border-green-900/50' : 'bg-red-950/20 border-red-900/50'
            }`}>
              <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                selectedOption.isProtective ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedOption.isProtective ? 'GOOD DEFENSIVE DECISION' : 'SIMULATION CONSEQUENCE'}
              </h3>
              <p className="text-sm text-slate-200">
                {selectedOption.consequenceMessage}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-800/50">
            {!confirmed ? (
              <Button 
                variant="primary" 
                disabled={!selectedOption}
                onClick={handleConfirm}
                className="gap-2 text-xs uppercase tracking-widest"
              >
                CONFIRM DECISION
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleContinue}
                className="gap-2 text-xs uppercase tracking-widest"
              >
                CONTINUE SIMULATION <Play size={14} />
              </Button>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
