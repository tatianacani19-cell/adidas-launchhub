import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function LoginForm() {

    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;

        try {
            setSubmitting(true);
            await login(form.email, form.password);
            addToast("Welcome back!", "success");
            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || "Login failed. Please try again.";
            addToast(message, "error");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="login-box" onSubmit={handleSubmit}>

            <h1>Adidas LaunchHub</h1>

            <p className="subtitle">
                Internal Product Launch Management Platform
            </p>

            <h2>Welcome back</h2>

            <p className="signin">
                Sign in to continue to your account
            </p>

            <label>Email</label>

            <div className="input-group">
                <User size={18} />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <label>Password</label>

            <div className="input-group">
                <Lock size={18} />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="login-options">

                <label className="remember">
                    <input type="checkbox" />
                    Remember me
                </label>

                <Link to="/forgot-password">Forgot password?</Link>

            </div>

            <button
                type="submit"
                className="login-btn"
                disabled={submitting}
            >
                {submitting ? "Signing in..." : "Login"}
            </button>

            <div className="divider">
                <span></span>
                <p>or</p>
                <span></span>
            </div>

            <button
                type="button"
                className="sso-btn"
            >
                Login with SSO
            </button>

            <footer>
                © 2026 Adidas. All rights reserved.
            </footer>

        </form>
    );
}

export default LoginForm;