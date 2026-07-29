function SettingsToggle({ label, checked, onChange }) {
    return (
        <label className="settings-toggle">
            <span className="settings-toggle-label">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                className={`settings-toggle-switch ${checked ? "active" : ""}`}
                onClick={() => onChange(!checked)}
            >
                <span className="settings-toggle-knob" />
            </button>
        </label>
    );
}

export default SettingsToggle;
