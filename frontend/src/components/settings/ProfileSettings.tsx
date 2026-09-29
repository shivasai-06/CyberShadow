import { useState } from 'react';
import type { LearningProfile } from '../../types/settings';
import { User, Edit2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProfileSettingsProps {
  profile: LearningProfile;
  onUpdate: (profile: LearningProfile) => void;
}

export function ProfileSettings({ profile, onUpdate }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">DISPLAY NAME</label>
            <input 
              type="text" 
              value={editForm.displayName} 
              onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
              className="w-full bg-[#060a14] border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors uppercase tracking-wide font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">LEARNING ROLE</label>
            <input 
              type="text" 
              value={editForm.role} 
              onChange={e => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full bg-[#060a14] border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">EXPERIENCE LEVEL</label>
            <input 
              type="text" 
              value={editForm.experienceLevel} 
              onChange={e => setEditForm({ ...editForm, experienceLevel: e.target.value })}
              className="w-full bg-[#060a14] border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">PRIMARY LEARNING FOCUS</label>
            <input 
              type="text" 
              value={editForm.learningFocus} 
              onChange={e => setEditForm({ ...editForm, learningFocus: e.target.value })}
              className="w-full bg-[#060a14] border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="primary" onClick={handleSave} className="text-xs uppercase tracking-widest px-6">
            SAVE CHANGES
          </Button>
          <Button variant="ghost" onClick={() => { setEditForm(profile); setIsEditing(false); }} className="text-xs uppercase tracking-widest px-6">
            CANCEL
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-[#060a14] border border-slate-800 flex items-center justify-center text-slate-600">
          <User size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-1">{profile.displayName}</h3>
          <div className="text-sm text-cyan-500 font-mono mb-3">{profile.role}</div>
          
          <div className="flex gap-4">
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">EXPERIENCE</div>
              <div className="text-xs text-slate-300">{profile.experienceLevel}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">FOCUS</div>
              <div className="text-xs text-slate-300">{profile.learningFocus}</div>
            </div>
          </div>
        </div>
      </div>
      
      <Button variant="secondary" onClick={() => setIsEditing(true)} className="gap-2 text-[10px] uppercase tracking-widest">
        <Edit2 size={12} /> EDIT PROFILE
      </Button>
    </div>
  );
}
