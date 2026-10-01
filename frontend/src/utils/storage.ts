export const STORAGE_KEYS = {
  SETTINGS: 'cybershadow.settings',
  SECURITY_CONTROLS: 'cybershadow.securityControls',
  SIMULATION_HISTORY: 'cybershadow.simulationHistory',
  LEARNING_PROGRESS: 'cybershadow.learningProgress', // deprecated
  LEARNING_PROFILE: 'cybershadow.learningProfile',
  REMEDIATIONS: 'cybershadow.remediations',
};

export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
}

export function removeStoredData(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}

export function clearAllFictionalData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => removeStoredData(key));
}
