import { useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { Lock } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import LogoPanel from "../components/auth/LogoPanel";
import LanguageSelector from "../components/auth/LanguageSelector";
import "../styles/login.css";

function ResetPassword() {

    const { token } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { addToast } = useToast();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (loading) {
        return (
            <div className="login-page">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <div className="skeleton skeleton-text" style={{ width: 120, height: 20 }} />
                </div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;

        if (password !== confirmPassword) {
            addToast("Passwords do not match.", "error");
            return;
        }

        if (password.length < 6) {
            addToast("Password must be at least 6 characters.", "error");
            return;
        }

        try {
            setSubmitting(true);
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            addToast("Password reset successful!", "success");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            const message = err.response?.data?.message || "Reset failed. Token may be expired.";
            addToast(message, "error");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="login-page">

            <LogoPanel />

            <div className="login-right">

                <LanguageSelector />

                <form className="login-box" onSubmit={handleSubmit}>

                    <h1>Adidas LaunchHub</h1>

                    <p className="subtitle">
                        Internal Product Launch Management Platform
                    </p>

                    <h2>Reset password</h2>

                    <p className="signin">
                        Create a new password for your account
                    </p>

                    {success ? (
                        <div style={{
                            padding: "16px",
                            background: "var(--bg-hover)",
                            borderRadius: "var(--radius-md)",
                            textAlign: "center",
                        }}>
                            <p style={{ margin: 0, fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>
                                Password reset successfully!
                            </p>
                            <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                                Redirecting to sign in...
                            </p>
                        </div>
                    ) : (
                        <>
                            <label>New password</label>

                            <div className="input-group">
                                <Lock size={18} />

                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <label>Confirm password</label>

                            <div className="input-group">
                                <Lock size={18} />

                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="login-btn"
                                disabled={submitting}
                            >
                                {submitting ? "Resetting..." : "Reset password"}
                            </button>
                        </>
                    )}

                    <p className="signin" style={{ marginTop: 16 }}>
                        <Link to="/" style={{ color: "var(--text-primary)", fontWeight: 600 }}>Back to sign in</Link>
                    </p>

                    <footer>
                        © 2026 Adidas. All rights reserved.
                    </footer>

                </form>

            </div>

        </div>
    );
}

export default ResetPassword;
