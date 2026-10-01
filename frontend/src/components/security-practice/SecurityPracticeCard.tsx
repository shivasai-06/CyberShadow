import { useState } from 'react';
import { Shield, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import type { SecurityPracticeTask } from '../../types/security-practice';
import { useCyberShadow } from '../../contexts/CyberShadowContext';

interface SecurityPracticeCardProps {
  practice: SecurityPracticeTask;
}

export function SecurityPracticeCard({ practice }: SecurityPracticeCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const { completeSecurityPractice } = useCyberShadow();

  const handleStart = () => {
    setIsActive(true);
  };

  const handleOptionSelect = (optionId: string) => {
    if (practice.status === 'COMPLETED') return;
    setSelectedOptionId(optionId);
    
    const option = practice.options.find(o => o.id === optionId);
    if (!option) return;

    completeSecurityPractice(practice.id, option.isCorrect, option.explanation);
  };

  if (!isActive && practice.status === 'AVAILABLE') {
    return (
      <div className="bg-[#0b1120] border border-teal-900/40 rounded-lg p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Shield size={12} /> ADAPTIVE PRACTICE
            </div>
            <h3 className="text-lg font-bold text-slate-200">{practice.title}</h3>
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-slate-900 rounded border border-slate-800 text-slate-400">
            {practice.difficulty}
          </div>
        </div>
        
        <p className="text-sm text-slate-400 italic border-l-2 border-slate-800 pl-3">
          "{practice.description}"
        </p>

        <div className="text-sm text-slate-300">
          <strong>Objective:</strong> {practice.objective}
        </div>

        <Button variant="primary" onClick={handleStart} className="w-full justify-center gap-2 mt-2 bg-teal-600 hover:bg-teal-500 border-teal-500">
          <Play size={16} /> START PRACTICE
        </Button>
      </div>
    );
  }

  const isCompleted = practice.status === 'COMPLETED';
  const passed = practice.result === 'PASSED';
  
  return (
    <div className="bg-[#0b1120] border border-teal-900/40 rounded-lg p-5 flex flex-col gap-4">
      <div className="text-[10px] font-bold text-teal-500 uppercase tracking-widest flex items-center gap-1 mb-2">
        <Shield size={12} /> PRACTICE: {practice.skillName}
      </div>

      <div className="text-sm font-medium text-slate-200 bg-[#060a14] p-4 rounded border border-slate-800">
        {practice.question}
      </div>

      <div className="space-y-2">
        {practice.options.map(option => {
          const isSelected = selectedOptionId === option.id || (isCompleted && option.isCorrect && passed);
          const showCorrectness = isCompleted && (isSelected || option.isCorrect);
          
          let btnClass = "w-full text-left p-3 text-sm rounded border transition-colors relative ";
          
          if (!isCompleted) {
            btnClass += "bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300";
          } else if (showCorrectness) {
            if (option.isCorrect) {
              btnClass += "bg-emerald-950/40 border-emerald-900/50 text-emerald-300";
            } else if (isSelected) {
              btnClass += "bg-rose-950/40 border-rose-900/50 text-rose-300";
            } else {
              btnClass += "bg-slate-900/50 border-slate-800 text-slate-500 opacity-50";
            }
          } else {
            btnClass += "bg-slate-900/50 border-slate-800 text-slate-500 opacity-50";
          }

          return (
            <button
              key={option.id}
              disabled={isCompleted}
              onClick={() => handleOptionSelect(option.id)}
              className={btnClass}
            >
              <div className="flex justify-between items-center">
                <span>{option.text}</span>
                {showCorrectness && (
                  option.isCorrect ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" /> :
                  (isSelected && !option.isCorrect) ? <AlertCircle size={16} className="text-rose-500 flex-shrink-0" /> : null
                )}
              </div>
            </button>
          );
        })}
      </div>

      {isCompleted && (
        <div className={`mt-4 p-4 rounded border ${passed ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-rose-950/20 border-rose-900/30'}`}>
          <h4 className={`text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2 ${passed ? 'text-emerald-500' : 'text-rose-500'}`}>
            {passed ? <><CheckCircle2 size={14} /> Practice Passed</> : <><AlertCircle size={14} /> Needs More Practice</>}
          </h4>
          <p className="text-sm text-slate-300">
            {practice.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
