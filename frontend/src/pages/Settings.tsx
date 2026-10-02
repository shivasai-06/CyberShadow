import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, LayoutDashboard, BookOpen, Play } from 'lucide-react';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { SettingsSection } from '../components/settings/SettingsSection';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { LearningPreferences } from '../components/settings/LearningPreferences';
import { SimulationPreferences } from '../components/settings/SimulationPreferences';
import { InterfacePreferences } from '../components/settings/InterfacePreferences';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { DataPrivacySettings } from '../components/settings/DataPrivacySettings';
import { ResetExperience } from '../components/settings/ResetExperience';
import { Button } from '../components/ui/Button';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, clearSimulationData, resetExperience } = useCyberShadow();
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSettingUpdate = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    updateSettings({ ...settings, [key]: value });
    setShowSavedMsg(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowSavedMsg(false), 2000);
  };

  const handleClearData = () => {
    clearSimulationData();
    console.log('Cleared local simulation data.');
  };

  const handleReset = () => {
    resetExperience();
  };

  return (
    <div className="space-y-8 pb-12 max-w-[1000px] mx-auto animate-in fade-in duration-500">
      
      {/* PAGE HEADER & SAFETY */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <SettingsIcon size={12} /> SETTINGS
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings & Personalization</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Customize your CyberShadow learning and simulation experience.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded">
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">APPLICATION SETTINGS</span>
          </div>
          <div className="text-[9px] font-mono text-slate-500 tracking-widest uppercase text-right">
            SIMULATION ENVIRONMENT<br/>NO REAL SYSTEM SETTINGS CHANGED
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <SettingsSection title="LEARNING PROFILE">
          <ProfileSettings 
            profile={settings.profile} 
            onUpdate={(profile) => handleSettingUpdate('profile', profile)} 
          />
        </SettingsSection>

        <SettingsSection title="LEARNING PREFERENCES">
          <LearningPreferences 
            learning={settings.learning} 
            onChange={(learning) => handleSettingUpdate('learning', learning)} 
          />
        </SettingsSection>

        <SettingsSection title="SIMULATION PREFERENCES">
          <SimulationPreferences 
            simulation={settings.simulation} 
            onChange={(simulation) => handleSettingUpdate('simulation', simulation)} 
          />
        </SettingsSection>

        <SettingsSection title="INTERFACE">
          <InterfacePreferences 
            ui={settings.interface} 
            onChange={(ui) => handleSettingUpdate('interface', ui)} 
          />
        </SettingsSection>

        <SettingsSection title="NOTIFICATIONS">
          <NotificationSettings 
            notifications={settings.notifications} 
            onChange={(notifications) => handleSettingUpdate('notifications', notifications)} 
          />
        </SettingsSection>

        <SettingsSection title="DATA & PRIVACY">
          <DataPrivacySettings onClearData={handleClearData} />
        </SettingsSection>

        <SettingsSection title="RESET EXPERIENCE">
          <ResetExperience onReset={handleReset} />
        </SettingsSection>
      </div>

      {/* QUICK ACTIONS & SAVE STATUS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-800/50">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">CONTINUE LEARNING</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate('/dashboard')} className="gap-2 text-[10px] uppercase tracking-widest">
              <LayoutDashboard size={14} className="text-cyan-500" /> OPEN DASHBOARD
            </Button>
            <Button variant="secondary" onClick={() => navigate('/scenarios')} className="gap-2 text-[10px] uppercase tracking-widest">
              <BookOpen size={14} className="text-violet-500" /> EXPLORE SCENARIOS
            </Button>
            <Button variant="primary" onClick={() => navigate('/simulation')} className="gap-2 text-[10px] uppercase tracking-widest">
              <Play size={14} fill="currentColor" /> RUN SIMULATION
            </Button>
          </div>
        </div>
        
        <div className={`text-[10px] font-bold text-green-400 uppercase tracking-widest transition-opacity duration-300 ${showSavedMsg ? 'opacity-100' : 'opacity-0'}`}>
          CHANGES SAVED LOCALLY
        </div>
      </div>

    </div>
  );
}
