import type { AppSettings } from '../../types/settings';
import { SettingsToggle } from './SettingsToggle';

interface NotificationSettingsProps {
  notifications: AppSettings['notifications'];
  onChange: (notifs: AppSettings['notifications']) => void;
}

export function NotificationSettings({ notifications, onChange }: NotificationSettingsProps) {
  return (
    <div className="divide-y divide-slate-800/50">
      <SettingsToggle
        label="Simulation Completion"
        description="Show a notification when a fictional simulation ends."
        checked={notifications.simulationCompletion}
        onChange={(val) => onChange({ ...notifications, simulationCompletion: val })}
      />
      <SettingsToggle
        label="Learning Milestones"
        description="Show notifications when learning progress milestones are reached."
        checked={notifications.learningMilestones}
        onChange={(val) => onChange({ ...notifications, learningMilestones: val })}
      />
      <SettingsToggle
        label="New Scenarios"
        description="Show notifications when new fictional scenarios become available."
        checked={notifications.newScenarios}
        onChange={(val) => onChange({ ...notifications, newScenarios: val })}
      />
    </div>
  );
}
