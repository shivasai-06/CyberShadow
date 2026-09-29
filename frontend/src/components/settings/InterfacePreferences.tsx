import type { AppSettings } from '../../types/settings';
import { SettingsToggle } from './SettingsToggle';

interface InterfacePreferencesProps {
  ui: AppSettings['interface'];
  onChange: (ui: AppSettings['interface']) => void;
}

export function InterfacePreferences({ ui, onChange }: InterfacePreferencesProps) {
  return (
    <div className="divide-y divide-slate-800/50">
      <SettingsToggle
        label="Compact Navigation"
        description="Use a more compact sidebar layout."
        checked={ui.compactNavigation}
        onChange={(val) => onChange({ ...ui, compactNavigation: val })}
      />
      <SettingsToggle
        label="Reduce Motion"
        description="Reduce non-essential interface animation."
        checked={ui.reduceMotion}
        onChange={(val) => onChange({ ...ui, reduceMotion: val })}
      />
      <SettingsToggle
        label="High Contrast Mode"
        description="Increase visual contrast for interface elements."
        checked={ui.highContrastMode}
        onChange={(val) => onChange({ ...ui, highContrastMode: val })}
      />
    </div>
  );
}
