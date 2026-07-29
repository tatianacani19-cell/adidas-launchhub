import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const STATUS_COLORS = {
    Draft: { bg: "#FEE2E2", color: "#991B1B" },
    Launch: { bg: "#DCFCE7", color: "#166534" },
    Review: { bg: "#FEF9C3", color: "#92400E" },
    Approve: { bg: "#DBEAFE", color: "#1E40AF" },
};

function CalendarPreview() {

    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [currentDate] = useState(new Date());
    const [hoveredDay, setHoveredDay] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {
        try {
            const response = await api.get("/calendar");
            setEvents(response.data);
        } catch {
            // silently fail — dashboard still works without calendar preview
        }
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const eventsByDay = {};
    events.forEach((event) => {
        const d = new Date(event.start);
        if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            if (!eventsByDay[day]) eventsByDay[day] = [];
            eventsByDay[day].push(event);
        }
    });

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
        cells.push(<td key={`empty-${i}`} className="cal-preview-empty" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const dayEvents = eventsByDay[day] || [];
        const hasEvents = dayEvents.length > 0;

        cells.push(
            <td
                key={day}
                className={`cal-preview-day ${isToday ? "today" : ""} ${hasEvents ? "has-events" : ""}`}
                onMouseEnter={() => hasEvents && setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
            >
                <span>{day}</span>
                {hasEvents && (
                    <div className="cal-preview-dots">
                        {dayEvents.slice(0, 3).map((e, i) => {
                            const style = STATUS_COLORS[e.extendedProps.status] || STATUS_COLORS.Launch;
                            return <span key={i} className="cal-preview-dot" style={{ background: style.color }} />;
                        })}
                    </div>
                )}
                {hoveredDay === day && dayEvents.length > 0 && (
                    <div className="cal-preview-tooltip">
                        {dayEvents.map((e) => {
                            const style = STATUS_COLORS[e.extendedProps.status] || STATUS_COLORS.Launch;
                            return (
                                <div key={e.id} className="cal-preview-tooltip-item">
                                    <span className="cal-preview-tooltip-dot" style={{ background: style.color }} />
                                    <div>
                                        <strong>{e.title}</strong>
                                        <span>{e.extendedProps.market} &middot; {e.extendedProps.status}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </td>
        );
    }

    return (
        <div className="dashboard-card cal-preview-card">

            <div className="card-header">
                <h3>Calendar Preview</h3>
                <span onClick={() => navigate("/calendar")} className="cal-preview-link">
                    View Calendar →
                </span>
            </div>

            <div className="cal-preview-month">{MONTHS[month]} {year}</div>

            <table className="cal-preview-table">
                <thead>
                    <tr>
                        {WEEKDAYS.map((d) => (
                            <th key={d}>{d}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const rows = [];
                        for (let i = 0; i < cells.length; i += 7) {
                            rows.push(<tr key={`row-${i}`}>{cells.slice(i, i + 7)}</tr>);
                        }
                        return rows;
                    })()}
                </tbody>
            </table>

        </div>
    );
}

export default CalendarPreview;
