import "../styles/login.css";

import LogoPanel from "../components/auth/LogoPanel";
import LanguageSelector from "../components/auth/LanguageSelector";
import LoginForm from "../components/auth/LoginForm";

function Login() {
    return (
        <div className="login-page">

            <LogoPanel />

            <div className="login-right">

                <LanguageSelector />

                <LoginForm />

            </div>

        </div>
    );
}

export default Login;