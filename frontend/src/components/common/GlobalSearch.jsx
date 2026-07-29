import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Rocket, LayoutDashboard, Calendar, Settings } from "lucide-react";
import api from "../../services/api";

const NAV_ITEMS = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Launches", path: "/launches", icon: Rocket },
    { label: "Calendar", path: "/calendar", icon: Calendar },
    { label: "Settings", path: "/settings", icon: Settings },
];

function GlobalSearch({ open, onClose }) {

    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [query, setQuery] = useState("");
    const [launches, setLaunches] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
            setQuery("");
            setActiveIndex(0);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        api.get("/launches")
            .then((res) => setLaunches(res.data))
            .catch(() => {});
    }, [open]);

    const results = useMemo(() => {
        const items = [];

        const navMatches = NAV_ITEMS.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
        );
        navMatches.forEach((item) => {
            items.push({ type: "nav", label: item.label, path: item.path, icon: item.icon });
        });

        const launchMatches = launches.filter((l) =>
            l.title.toLowerCase().includes(query.toLowerCase()) ||
            l.market.toLowerCase().includes(query.toLowerCase())
        );
        launchMatches.slice(0, 5).forEach((l) => {
            items.push({ type: "launch", label: l.title, sub: l.market, path: `/launches/edit/${l.id}`, icon: Rocket });
        });

        return items;
    }, [query, launches]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    useEffect(() => {
        if (!open) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
            }
            if (e.key === "Enter" && results[activeIndex]) {
                navigate(results[activeIndex].path);
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose, results, activeIndex, navigate]);

    if (!open) return null;

    return (
        <div className="search-overlay" onClick={onClose} role="dialog" aria-label="Global search">
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="search-input-wrapper">
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search launches, pages..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search"
                    />
                </div>

                <div className="search-results">
                    {results.length === 0 && query && (
                        <div className="search-empty">No results found.</div>
                    )}
                    {results.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={`${item.type}-${item.label}-${i}`}
                                className={`search-result-item${i === activeIndex ? " active" : ""}`}
                                onClick={() => { navigate(item.path); onClose(); }}
                                role="option"
                                aria-selected={i === activeIndex}
                            >
                                <Icon size={18} color="var(--text-muted)" />
                                <div>
                                    <div>{item.label}</div>
                                    {item.sub && <span>{item.sub}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="search-hint">
                    <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
                    <span><kbd>Enter</kbd> Open</span>
                    <span><kbd>Esc</kbd> Close</span>
                </div>
            </div>
        </div>
    );
}

export default GlobalSearch;
