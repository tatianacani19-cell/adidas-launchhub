import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function UserDropdown() {

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : "U";

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <div className="dropdown" ref={ref}>
            <button
                className="user-avatar-btn"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="User menu"
            >
                <div className="nav-avatar">{initials}</div>
            </button>

            {open && (
                <div className="dropdown-menu" role="menu">
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)" }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{user?.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{user?.role}</div>
                    </div>
                    <button className="dropdown-item" role="menuitem" onClick={() => { navigate("/settings"); setOpen(false); }}>
                        <Settings size={16} /> Settings
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" role="menuitem" onClick={handleLogout}>
                        <LogOut size={16} /> Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserDropdown;
