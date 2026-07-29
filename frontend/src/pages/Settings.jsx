import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import SettingsCard from "../components/settings/SettingsCard";
import SettingsToggle from "../components/settings/SettingsToggle";
import SettingsInput from "../components/settings/SettingsInput";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

import "../styles/settings.css";

function Settings() {

    const { user } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const { addToast } = useToast();

    const [fullName, setFullName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [role] = useState(user?.role || "Marketing Manager");
    const [department] = useState("Marketing");

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        launchUpdates: true,
        approvalReminders: true,
        calendarReminders: false,
        marketingAlerts: true,
    });

    const [language, setLanguage] = useState("en");
    const [defaultView, setDefaultView] = useState("dashboard");

    function handleNotificationChange(key, value) {
        setNotifications((prev) => ({ ...prev, [key]: value }));
    }

    function handleSaveProfile() {
        addToast("Profile updated successfully.", "success");
    }

    function handleChangePassword() {
        addToast("Password change request sent.", "info");
    }

    function handleLogoutSession() {
        addToast("All other sessions have been terminated.", "info");
    }

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : "U";

    return (
        <MainLayout title="Settings">
            <div className="settings-grid">

                <div className="settings-column">

                    <SettingsCard title="Profile Information">
                        <div className="settings-profile">
                            <div className="settings-avatar">{initials}</div>
                            <div className="settings-profile-fields">
                                <SettingsInput
                                    label="Full name"
                                    value={fullName}
                                    onChange={setFullName}
                                />
                                <SettingsInput
                                    label="Email"
                                    value={email}
                                    onChange={setEmail}
                                    type="email"
                                />
                                <div className="settings-readonly">
                                    <SettingsInput
                                        label="Role"
                                        value={role}
                                        onChange={() => {}}
                                        disabled
                                    />
                                    <SettingsInput
                                        label="Department"
                                        value={department}
                                        onChange={() => {}}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="settings-card-footer">
                            <button className="settings-btn primary" onClick={handleSaveProfile}>
                                Save Changes
                            </button>
                        </div>
                    </SettingsCard>

                    <SettingsCard title="Notifications">
                        <div className="settings-toggles">
                            <SettingsToggle
                                label="Email notifications"
                                checked={notifications.emailNotifications}
                                onChange={(v) => handleNotificationChange("emailNotifications", v)}
                            />
                            <SettingsToggle
                                label="Launch updates"
                                checked={notifications.launchUpdates}
                                onChange={(v) => handleNotificationChange("launchUpdates", v)}
                            />
                            <SettingsToggle
                                label="Approval reminders"
                                checked={notifications.approvalReminders}
                                onChange={(v) => handleNotificationChange("approvalReminders", v)}
                            />
                            <SettingsToggle
                                label="Calendar reminders"
                                checked={notifications.calendarReminders}
                                onChange={(v) => handleNotificationChange("calendarReminders", v)}
                            />
                            <SettingsToggle
                                label="Marketing alerts"
                                checked={notifications.marketingAlerts}
                                onChange={(v) => handleNotificationChange("marketingAlerts", v)}
                            />
                        </div>
                    </SettingsCard>

                    <SettingsCard title="Security">
                        <div className="settings-info-row">
                            <span className="settings-info-label">Authentication</span>
                            <span className="settings-info-value">
                                <span className="settings-badge green">JWT Enabled</span>
                            </span>
                        </div>
                        <div className="settings-info-row">
                            <span className="settings-info-label">Last login</span>
                            <span className="settings-info-value">Today</span>
                        </div>
                        <div className="settings-info-row">
                            <span className="settings-info-label">Active sessions</span>
                            <span className="settings-info-value">1</span>
                        </div>
                    </SettingsCard>

                </div>

                <div className="settings-column">

                    <SettingsCard title="Account Settings">
                        <div className="settings-actions">
                            <button className="settings-btn outline" onClick={handleChangePassword}>
                                Change Password
                            </button>
                            <button className="settings-btn outline" onClick={handleLogoutSession}>
                                Logout All Sessions
                            </button>
                        </div>
                    </SettingsCard>

                    <SettingsCard title="Preferences">
                        <div className="settings-preference">
                            <span className="settings-preference-label">Theme</span>
                            <div className="settings-segmented">
                                <button
                                    className={`settings-segmented-btn ${!dark ? "active" : ""}`}
                                    onClick={() => { if (dark) toggleTheme(); }}
                                >
                                    Light
                                </button>
                                <button
                                    className={`settings-segmented-btn ${dark ? "active" : ""}`}
                                    onClick={() => { if (!dark) toggleTheme(); }}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>

                        <div className="settings-preference">
                            <span className="settings-preference-label">Language</span>
                            <div className="settings-segmented">
                                <button
                                    className={`settings-segmented-btn ${language === "en" ? "active" : ""}`}
                                    onClick={() => setLanguage("en")}
                                >
                                    English
                                </button>
                                <button
                                    className={`settings-segmented-btn ${language === "es" ? "active" : ""}`}
                                    onClick={() => setLanguage("es")}
                                >
                                    Spanish
                                </button>
                            </div>
                        </div>

                        <div className="settings-preference">
                            <span className="settings-preference-label">Default view</span>
                            <div className="settings-segmented three">
                                <button
                                    className={`settings-segmented-btn ${defaultView === "dashboard" ? "active" : ""}`}
                                    onClick={() => setDefaultView("dashboard")}
                                >
                                    Dashboard
                                </button>
                                <button
                                    className={`settings-segmented-btn ${defaultView === "launches" ? "active" : ""}`}
                                    onClick={() => setDefaultView("launches")}
                                >
                                    Launches
                                </button>
                                <button
                                    className={`settings-segmented-btn ${defaultView === "calendar" ? "active" : ""}`}
                                    onClick={() => setDefaultView("calendar")}
                                >
                                    Calendar
                                </button>
                            </div>
                        </div>
                    </SettingsCard>

                </div>

            </div>
        </MainLayout>
    );
}

export default Settings;
