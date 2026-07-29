import { useState } from "react";
import { User, Lock } from "lucide-react";

function LoginForm() {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(form);
    };

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
                />
            </div>

            <div className="login-options">

                <label className="remember">
                    <input type="checkbox" />
                    Remember me
                </label>

                <a href="/">Forgot password?</a>

            </div>

            <button
                type="submit"
                className="login-btn"
            >
                Login
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