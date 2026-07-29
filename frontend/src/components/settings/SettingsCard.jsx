function SettingsCard({ title, children }) {
    return (
        <div className="settings-card">
            <div className="settings-card-header">
                <h3>{title}</h3>
            </div>
            <div className="settings-card-body">
                {children}
            </div>
        </div>
    );
}

export default SettingsCard;
