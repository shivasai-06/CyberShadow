interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SettingsToggle({ label, description, checked, onChange }: SettingsToggleProps) {
  return (
    <div className="flex items-start justify-between py-3">
      <div>
        <div className="text-sm font-bold text-slate-300">{label}</div>
        {description && (
          <div className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">{description}</div>
        )}
      </div>
      
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ml-4 mt-0.5 ${
          checked ? 'bg-cyan-500' : 'bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
