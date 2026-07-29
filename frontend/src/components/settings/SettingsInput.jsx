function SettingsInput({ label, value, onChange, type = "text", disabled = false }) {
    return (
        <div className="settings-input">
            <label className="settings-input-label">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="settings-input-field"
            />
        </div>
    );
}

export default SettingsInput;
