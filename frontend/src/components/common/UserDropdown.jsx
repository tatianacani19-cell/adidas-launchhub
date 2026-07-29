import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";

function UserDropdown() {

    const navigate = useNavigate();
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

    return (
        <div className="dropdown" ref={ref}>
            <button
                className="user-avatar-btn"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="User menu"
            >
                <div className="nav-avatar">TC</div>
            </button>

            {open && (
                <div className="dropdown-menu" role="menu">
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)" }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>Tatiana C.</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Marketing User</div>
                    </div>
                    <button className="dropdown-item" role="menuitem" onClick={() => { navigate("/settings"); setOpen(false); }}>
                        <Settings size={16} /> Settings
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" role="menuitem" onClick={() => { navigate("/"); setOpen(false); }}>
                        <LogOut size={16} /> Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserDropdown;
