import "../../styles/navbar.css";
import { Bell } from "lucide-react";

function Navbar({ title }) {
    return (
        <header className="navbar">

            <div>
                <h2>{title}</h2>
                <p>Welcome back 👋</p>
            </div>

            <div className="navbar-right">

                <button className="notification-btn">
                    <Bell size={20} />
                </button>

                <div className="user-avatar">
                    F
                </div>

            </div>

        </header>
    );
}

export default Navbar;