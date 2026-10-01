import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS, getStoredData, setStoredData, clearAllFictionalData } from '../utils/storage';
import { DEFAULT_SETTINGS, type AppSettings } from '../types/settings';
import type { ControlId, PresetType } from '../types/security';
import type { HistoryRecord, LearningProgressMetrics } from '../types/history';
import type { LearningProfile } from '../types/learning';
import { MOCK_HISTORY_RECORDS, MOCK_LEARNING_PROGRESS } from '../data/historyData';
import { initializeLearningProfile, updateLearningProfile, SCENARIO_TO_SKILLS } from '../engine/learningEngine';

export type SecurityControlsState = Record<ControlId, boolean>;

export const DEFAULT_SECURITY_CONTROLS: SecurityControlsState = {
  mfa: true,
  password_strength: true,
  automatic_updates: true,
  backup: true,
  privacy: false,
  security_awareness: true,
};

export interface CyberShadowContextValue {
  // State
  settings: AppSettings;
  securityControls: SecurityControlsState;
  activePreset: PresetType | null;
  history: HistoryRecord[];
  learningProgress: LearningProgressMetrics;
  learningProfile: LearningProfile;

  // Actions
  updateSettings: (newSettings: AppSettings) => void;
  updateSecurityControl: (id: ControlId, value: boolean) => void;
  applySecurityPreset: (preset: PresetType) => void;
  addSimulationResult: (record: HistoryRecord, isBlocked: boolean) => void;
  resetExperience: () => void;
  clearSimulationData: () => void;
  
  // Phase 3.6 Learning Actions
  updateLearningFromSimulation: (record: HistoryRecord) => void;
  resetLearningProgress: () => void;
}

const CyberShadowContext = createContext<CyberShadowContextValue | undefined>(undefined);

export function CyberShadowProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
  const [securityControls, setSecurityControls] = useState<SecurityControlsState>(() => getStoredData(STORAGE_KEYS.SECURITY_CONTROLS, DEFAULT_SECURITY_CONTROLS));
  const [activePreset, setActivePreset] = useState<PresetType | null>(() => getStoredData(STORAGE_KEYS.SECURITY_CONTROLS + '_preset', 'BALANCED'));
  const [history, setHistory] = useState<HistoryRecord[]>(() => getStoredData(STORAGE_KEYS.SIMULATION_HISTORY, MOCK_HISTORY_RECORDS));
  const [learningProgress, setLearningProgress] = useState<LearningProgressMetrics>(() => getStoredData(STORAGE_KEYS.LEARNING_PROGRESS, MOCK_LEARNING_PROGRESS));
  const [learningProfile, setLearningProfile] = useState<LearningProfile>(() => getStoredData(STORAGE_KEYS.LEARNING_PROFILE, initializeLearningProfile()));

  // Sync state changes to localStorage
  useEffect(() => { setStoredData(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { setStoredData(STORAGE_KEYS.SECURITY_CONTROLS, securityControls); }, [securityControls]);
  useEffect(() => { setStoredData(STORAGE_KEYS.SECURITY_CONTROLS + '_preset', activePreset); }, [activePreset]);
  useEffect(() => { setStoredData(STORAGE_KEYS.SIMULATION_HISTORY, history); }, [history]);
  useEffect(() => { setStoredData(STORAGE_KEYS.LEARNING_PROGRESS, learningProgress); }, [learningProgress]);
  useEffect(() => { setStoredData(STORAGE_KEYS.LEARNING_PROFILE, learningProfile); }, [learningProfile]);

  // Actions
  const updateSettings = (newSettings: AppSettings) => setSettings(newSettings);

  const updateSecurityControl = (id: ControlId, value: boolean) => {
    setSecurityControls(prev => ({ ...prev, [id]: value }));
    setActivePreset(null);
  };

  const applySecurityPreset = (preset: PresetType) => {
    setActivePreset(preset);
    if (preset === 'BALANCED') {
      setSecurityControls({
        mfa: true, password_strength: true, automatic_updates: true,
        backup: true, privacy: false, security_awareness: true
      });
    } else if (preset === 'HIGH_PROTECTION') {
      setSecurityControls({
        mfa: true, password_strength: true, automatic_updates: true,
        backup: true, privacy: true, security_awareness: true
      });
    } else if (preset === 'TEST_VULNERABILITIES') {
      setSecurityControls({
        mfa: false, password_strength: false, automatic_updates: true,
        backup: false, privacy: false, security_awareness: false
      });
    }
  };

  const updateLearningFromSimulation = (record: HistoryRecord) => {
    setLearningProfile(prev => {
      const { newProfile } = updateLearningProfile(prev, record);
      return newProfile;
    });
  };

  const addSimulationResult = (record: HistoryRecord, isBlocked: boolean) => {
    // Add skills practiced to the record before saving
    record.skillsPracticed = SCENARIO_TO_SKILLS[record.scenarioId] || [];
    
    setHistory(prev => [record, ...prev]);
    setLearningProgress(prev => ({
      ...prev,
      simulationsCompleted: prev.simulationsCompleted + 1,
      attacksBlocked: isBlocked ? prev.attacksBlocked + 1 : prev.attacksBlocked
    }));
    
    // Also update learning profile
    updateLearningFromSimulation(record);
  };

  const resetExperience = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const resetLearningProgress = () => {
    setLearningProfile(initializeLearningProfile());
  };

  const clearSimulationData = () => {
    clearAllFictionalData();
    setSettings(DEFAULT_SETTINGS);
    setSecurityControls(DEFAULT_SECURITY_CONTROLS);
    setActivePreset('BALANCED');
    setHistory(MOCK_HISTORY_RECORDS);
    setLearningProgress(MOCK_LEARNING_PROGRESS);
    setLearningProfile(initializeLearningProfile());
  };

  const value = useMemo(() => ({
    settings,
    securityControls,
    activePreset,
    history,
    learningProgress,
    learningProfile,
    updateSettings,
    updateSecurityControl,
    applySecurityPreset,
    addSimulationResult,
    resetExperience,
    clearSimulationData,
    updateLearningFromSimulation,
    resetLearningProgress
  }), [settings, securityControls, activePreset, history, learningProgress, learningProfile]);

  return (
    <CyberShadowContext.Provider value={value}>
      {children}
    </CyberShadowContext.Provider>
  );
}

export function useCyberShadow() {
  const context = useContext(CyberShadowContext);
  if (context === undefined) {
    throw new Error('useCyberShadow must be used within a CyberShadowProvider');
  }
  return context;
}
