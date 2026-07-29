import { useState } from "react";
import "../../styles/navbar.css";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import UserDropdown from "../common/UserDropdown";
import GlobalSearch from "../common/GlobalSearch";

function Navbar({ title }) {

    const { dark, toggleTheme } = useTheme();
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <header className="navbar">

                <div>
                    <h2>{title}</h2>
                </div>

                <div className="navbar-right">

                    <button
                        className="navbar-icon-btn"
                        onClick={() => setSearchOpen(true)}
                        aria-label="Search (Ctrl+K)"
                        title="Search (Ctrl+K)"
                    >
                        <Search size={18} />
                    </button>

                    <button
                        className="navbar-icon-btn"
                        onClick={toggleTheme}
                        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {dark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <button className="navbar-icon-btn" aria-label="Notifications">
                        <Bell size={18} />
                    </button>

                    <UserDropdown />

                </div>

            </header>

            <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}

export default Navbar;