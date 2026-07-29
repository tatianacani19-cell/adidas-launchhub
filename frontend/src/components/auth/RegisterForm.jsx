import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function RegisterForm() {

    const navigate = useNavigate();
    const { register } = useAuth();
    const { addToast } = useToast();

    const [form, setForm] = useState({
        name: "",
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
            await register(form.name, form.email, form.password);
            addToast("Account created successfully!", "success");
            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed. Please try again.";
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

            <h2>Create account</h2>

            <p className="signin">
                Sign up to get started
            </p>

            <label>Full name</label>

            <div className="input-group">
                <User size={18} />

                <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <label>Email</label>

            <div className="input-group">
                <Mail size={18} />

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
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                />
            </div>

            <button
                type="submit"
                className="login-btn"
                disabled={submitting}
            >
                {submitting ? "Creating account..." : "Register"}
            </button>

            <p className="signin" style={{ marginTop: 16 }}>
                Already have an account? <Link to="/" style={{ color: "var(--text-primary)", fontWeight: 600 }}>Sign in</Link>
            </p>

            <footer>
                © 2026 Adidas. All rights reserved.
            </footer>

        </form>
    );
}

export default RegisterForm;
