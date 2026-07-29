import { Navigate } from "react-router-dom";
import "../styles/login.css";

import LogoPanel from "../components/auth/LogoPanel";
import LanguageSelector from "../components/auth/LanguageSelector";
import RegisterForm from "../components/auth/RegisterForm";
import { useAuth } from "../context/AuthContext";

function Register() {

    const { user, loading } = useAuth();

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

    return (
        <div className="login-page">

            <LogoPanel />

            <div className="login-right">

                <LanguageSelector />

                <RegisterForm />

            </div>

        </div>
    );
}

export default Register;
