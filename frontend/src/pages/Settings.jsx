import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import SettingsCard from "../components/settings/SettingsCard";
import SettingsToggle from "../components/settings/SettingsToggle";
import SettingsInput from "../components/settings/SettingsInput";
import UserManagement from "../components/settings/UserManagement";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

import "../styles/settings.css";

function Settings() {
    const { user: authUser } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);

    const [language, setLanguage] = useState("en");
    const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
    const [timeFormat, setTimeFormat] = useState("12h");
    const [timezone, setTimezone] = useState("America/Bogota");

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [marketingNotifications, setMarketingNotifications] = useState(false);

    const [profileSubmitting, setProfileSubmitting] = useState(false);
    const [prefsSubmitting, setPrefsSubmitting] = useState(false);

    const isAdmin = authUser?.role === "ADMIN";

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            setLoading(true);
            const response = await api.get("/users/profile");
            const data = response.data;
            setProfile(data);
            setFullName(data.name || "");
            setEmail(data.email || "");
            setDepartment(data.department || "");
            setLanguage(data.language || "en");
            setDateFormat(data.dateFormat || "MM/DD/YYYY");
            setTimeFormat(data.timeFormat || "12h");
            setTimezone(data.timezone || "America/Bogota");
            setEmailNotifications(data.notifications?.emailNotifications ?? true);
            setMarketingNotifications(data.notifications?.marketingNotifications ?? false);
        } catch {
            if (authUser) {
                setFullName(authUser.name || "");
                setEmail(authUser.email || "");
                setDepartment(authUser.department || "");
                setLanguage(authUser.language || "en");
                setDateFormat(authUser.dateFormat || "MM/DD/YYYY");
                setTimeFormat(authUser.timeFormat || "12h");
                setTimezone(authUser.timezone || "America/Bogota");
                setEmailNotifications(authUser.notifications?.emailNotifications ?? true);
                setMarketingNotifications(authUser.notifications?.marketingNotifications ?? false);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveProfile() {
        try {
            setProfileSubmitting(true);
            const response = await api.put("/users/profile", {
                name: fullName,
                email,
                department,
            });
            setProfile(response.data);
            addToast("Profile updated successfully.", "success");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update profile.";
            addToast(msg, "error");
        } finally {
            setProfileSubmitting(false);
        }
    }

    async function handleChangePassword() {
        if (!currentPassword || !newPassword || !confirmPassword) {
            addToast("All password fields are required.", "error");
            return;
        }
        if (newPassword.length < 8) {
            addToast("New password must be at least 8 characters.", "error");
            return;
        }
        if (newPassword !== confirmPassword) {
            addToast("Passwords do not match.", "error");
            return;
        }
        try {
            setPasswordSubmitting(true);
            await api.put("/users/profile/change-password", {
                currentPassword,
                newPassword,
                confirmPassword,
            });
            addToast("Password updated successfully.", "success");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to change password.";
            addToast(msg, "error");
        } finally {
            setPasswordSubmitting(false);
        }
    }

    async function handleSavePreferences() {
        try {
            setPrefsSubmitting(true);
            const response = await api.put("/users/profile", {
                language,
                dateFormat,
                timeFormat,
                timezone,
            });
            setProfile(response.data);
            addToast("Preferences saved.", "success");
        } catch {
            addToast("Failed to save preferences.", "error");
        } finally {
            setPrefsSubmitting(false);
        }
    }

    async function handleSaveNotifications() {
        try {
            const response = await api.put("/users/profile", {
                notifications: {
                    emailNotifications,
                    marketingNotifications,
                },
            });
            setProfile(response.data);
            addToast("Notification settings saved.", "success");
        } catch {
            addToast("Failed to save notification settings.", "error");
        }
    }

    function getInitials() {
        if (!fullName) return "U";
        return fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }

    const roleLabels = {
        ADMIN: "Administrator",
        CREATOR: "Creator",
        APPROVER: "Approver",
    };

    if (loading) {
        return (
            <MainLayout title="Settings">
                <div className="settings-grid">
                    <div className="settings-column">
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="skeleton skeleton-text" style={{ width: 160, height: 20 }} />
                            </div>
                            <div className="settings-card-body">
                                <div className="skeleton skeleton-rect" style={{ width: 64, height: 64, borderRadius: "50%" }} />
                                <div className="skeleton skeleton-text" style={{ width: "100%", height: 40 }} />
                                <div className="skeleton skeleton-text" style={{ width: "100%", height: 40 }} />
                                <div className="skeleton skeleton-text" style={{ width: "100%", height: 40 }} />
                            </div>
                        </div>
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="skeleton skeleton-text" style={{ width: 140, height: 20 }} />
                            </div>
                            <div className="settings-card-body">
                                <div className="skeleton skeleton-text" style={{ width: "100%", height: 30 }} />
                                <div className="skeleton skeleton-text" style={{ width: "100%", height: 30 }} />
                            </div>
                        </div>
                    </div>
                    <div className="settings-column">
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="skeleton skeleton-text" style={{ width: 140, height: 20 }} />
                            </div>
                            <div className="settings-card-body">
                                <div className="skeleton skeleton-text" style={{ width: "100%", height: 30 }} />
                                <div className="skeleton skeleton-text" style={{ width: "100%", height: 30 }} />
                            </div>
                        </div>
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="skeleton skeleton-text" style={{ width: 120, height: 20 }} />
                            </div>
                            <div className="settings-card-body">
                                <div className="skeleton skeleton-text" style={{ width: "100%", height: 30 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Settings">
            <div className="settings-grid">

                <div className="settings-column">

                    <SettingsCard title="Profile Information">
                        <div className="settings-profile">
                            <div className="settings-avatar">{getInitials()}</div>
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
                                        value={roleLabels[authUser?.role] || authUser?.role || ""}
                                        onChange={() => {}}
                                        disabled
                                    />
                                    <SettingsInput
                                        label="Department"
                                        value={department}
                                        onChange={setDepartment}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="settings-card-footer">
                            <button
                                className="settings-btn primary"
                                onClick={handleSaveProfile}
                                disabled={profileSubmitting}
                            >
                                {profileSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </SettingsCard>

                    <SettingsCard title="Change Password">
                        <div className="settings-input">
                            <label className="settings-input-label">Current Password</label>
                            <input
                                type="password"
                                className="settings-input-field"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="settings-input">
                            <label className="settings-input-label">New Password</label>
                            <input
                                type="password"
                                className="settings-input-field"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                            />
                        </div>
                        <div className="settings-input">
                            <label className="settings-input-label">Confirm Password</label>
                            <input
                                type="password"
                                className="settings-input-field"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                        <div className="settings-card-footer" style={{ flexDirection: "column", gap: 12 }}>
                            <button
                                className="settings-btn primary"
                                onClick={handleChangePassword}
                                disabled={passwordSubmitting}
                                style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}
                            >
                                {passwordSubmitting && <Loader2 size={16} className="spin" />}
                                {passwordSubmitting ? "Updating..." : "Update Password"}
                            </button>
                            <Link
                                to="/forgot-password"
                                className="settings-forgot-link"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </SettingsCard>

                    <SettingsCard title="Notifications">
                        <div className="settings-toggles">
                            <SettingsToggle
                                label="Email notifications"
                                checked={emailNotifications}
                                onChange={setEmailNotifications}
                            />
                            <SettingsToggle
                                label="Marketing updates"
                                checked={marketingNotifications}
                                onChange={setMarketingNotifications}
                            />
                        </div>
                        <div className="settings-card-footer">
                            <button
                                className="settings-btn primary"
                                onClick={handleSaveNotifications}
                            >
                                Save Notifications
                            </button>
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
                            <span className="settings-info-label">Role</span>
                            <span className="settings-info-value">
                                {roleLabels[authUser?.role] || authUser?.role || "—"}
                            </span>
                        </div>
                    </SettingsCard>

                </div>

                <div className="settings-column">

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
                            <span className="settings-preference-label">Date Format</span>
                            <div className="settings-segmented">
                                <button
                                    className={`settings-segmented-btn ${dateFormat === "MM/DD/YYYY" ? "active" : ""}`}
                                    onClick={() => setDateFormat("MM/DD/YYYY")}
                                >
                                    MM/DD/YYYY
                                </button>
                                <button
                                    className={`settings-segmented-btn ${dateFormat === "DD/MM/YYYY" ? "active" : ""}`}
                                    onClick={() => setDateFormat("DD/MM/YYYY")}
                                >
                                    DD/MM/YYYY
                                </button>
                                <button
                                    className={`settings-segmented-btn ${dateFormat === "YYYY-MM-DD" ? "active" : ""}`}
                                    onClick={() => setDateFormat("YYYY-MM-DD")}
                                >
                                    YYYY-MM-DD
                                </button>
                            </div>
                        </div>

                        <div className="settings-preference">
                            <span className="settings-preference-label">Time Format</span>
                            <div className="settings-segmented">
                                <button
                                    className={`settings-segmented-btn ${timeFormat === "12h" ? "active" : ""}`}
                                    onClick={() => setTimeFormat("12h")}
                                >
                                    12h
                                </button>
                                <button
                                    className={`settings-segmented-btn ${timeFormat === "24h" ? "active" : ""}`}
                                    onClick={() => setTimeFormat("24h")}
                                >
                                    24h
                                </button>
                            </div>
                        </div>

                        <div className="settings-preference">
                            <span className="settings-preference-label">Time Zone</span>
                            <select
                                className="settings-input-field"
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                style={{ width: "auto", minWidth: 200 }}
                            >
                                <option value="America/Bogota">America/Bogota (UTC-5)</option>
                                <option value="America/Mexico_City">America/Mexico_City (UTC-6)</option>
                                <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires (UTC-3)</option>
                                <option value="America/Santiago">America/Santiago (UTC-4)</option>
                                <option value="America/Lima">America/Lima (UTC-5)</option>
                                <option value="America/New_York">America/New_York (UTC-5)</option>
                                <option value="America/Chicago">America/Chicago (UTC-6)</option>
                                <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
                                <option value="Europe/Madrid">Europe/Madrid (UTC+1)</option>
                                <option value="Europe/London">Europe/London (UTC+0)</option>
                            </select>
                        </div>

                        <div className="settings-card-footer">
                            <button
                                className="settings-btn primary"
                                onClick={handleSavePreferences}
                                disabled={prefsSubmitting}
                            >
                                {prefsSubmitting ? "Saving..." : "Save Preferences"}
                            </button>
                        </div>
                    </SettingsCard>

                    {isAdmin && (
                        <SettingsCard title="User Management">
                            <UserManagement isAdmin={isAdmin} />
                        </SettingsCard>
                    )}

                </div>

            </div>
        </MainLayout>
    );
}

export default Settings;
