import type { LearningRecommendation } from '../../types/reports';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface LearningRecommendationsProps {
  recommendations: LearningRecommendation[];
}

export function LearningRecommendations({ recommendations }: LearningRecommendationsProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-6">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">NEXT LEARNING AREAS</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {recommendations.map(rec => (
          <div key={rec.id} className="bg-[#060a14] border border-slate-800 rounded-lg p-5 flex flex-col h-full">
            <h4 className="text-sm font-bold text-white tracking-wide mb-2">{rec.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">
              {rec.description}
            </p>
            <Button 
              variant="secondary" 
              onClick={() => navigate(rec.route)}
              className="w-full text-[10px] uppercase tracking-widest justify-center"
            >
              {rec.actionText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
