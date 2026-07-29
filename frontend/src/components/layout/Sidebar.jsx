import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Rocket,
    CalendarDays,
    Settings,
} from "lucide-react";

import "../../styles/sidebar.css";
import logo from "../../assets/images/adidas-logo.png";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {

    const { user } = useAuth();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Launches",
            path: "/launches",
            icon: Rocket,
        },
        {
            name: "Calendar",
            path: "/calendar",
            icon: CalendarDays,
        },
        {
            name: "Settings",
            path: "/settings",
            icon: Settings,
        },
    ];

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : "U";

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <img src={logo} alt="Adidas" />
                <h2>LaunchHub</h2>
            </div>

            <nav className="sidebar-menu" aria-label="Main navigation">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? "menu-item active" : "menu-item"
                            }
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-user">

                <div className="avatar">
                    {initials}
                </div>

                <div>
                    <strong>{user?.name || "User"}</strong>
                    <p>{user?.role || "Role"}</p>
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;