import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Mail } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import LogoPanel from "../components/auth/LogoPanel";
import LanguageSelector from "../components/auth/LanguageSelector";
import "../styles/login.css";

function ForgotPassword() {

    const { user, loading } = useAuth();
    const { addToast } = useToast();
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

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

        try {
            setSubmitting(true);
            await api.post("/auth/forgot-password", { email });
            setSent(true);
            addToast("Recovery link sent to your email.", "success");
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong.";
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

                    <h2>Forgot password?</h2>

                    <p className="signin">
                        Enter your email to receive a recovery link
                    </p>

                    {sent ? (
                        <div style={{
                            padding: "16px",
                            background: "var(--bg-hover)",
                            borderRadius: "var(--radius-md)",
                            textAlign: "center",
                        }}>
                            <p style={{ margin: 0, fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>
                                Recovery link sent!
                            </p>
                            <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                                Check your inbox and follow the instructions.
                            </p>
                        </div>
                    ) : (
                        <>
                            <label>Email</label>

                            <div className="input-group">
                                <Mail size={18} />

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="login-btn"
                                disabled={submitting}
                            >
                                {submitting ? "Sending..." : "Send recovery link"}
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

export default ForgotPassword;
