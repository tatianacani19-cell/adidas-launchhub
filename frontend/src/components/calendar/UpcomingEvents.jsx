import { useMemo } from "react";

function UpcomingEvents({ events }) {

    const upcoming = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const limit = nextWeek.toISOString().split("T")[0];

        return events
            .filter((e) => e.date >= today && e.date <= limit)
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [events]);

    const statusColors = {
        Launch: { bg: "#DCFCE7", color: "#166534" },
        Review: { bg: "#FEF9C3", color: "#92400E" },
        Approve: { bg: "#DBEAFE", color: "#1E40AF" },
        Due: { bg: "#FEE2E2", color: "#991B1B" },
        Meeting: { bg: "#F3F4F6", color: "#374151" },
    };

    function formatDate(dateStr) {
        const date = new Date(dateStr + "T00:00:00");
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    }

    return (
        <div className="calendar-card">

            <div className="calendar-card-header">
                <h3>Upcoming (Next 7 Days)</h3>
            </div>

            <div className="upcoming-list">

                {upcoming.length === 0 && (
                    <p className="calendar-empty">No upcoming events.</p>
                )}

                {upcoming.map((event) => {
                    const style = statusColors[event.status] || statusColors.Meeting;
                    return (
                        <div key={event.id} className="upcoming-item">
                            <div className="upcoming-info">
                                <h4>{event.title}</h4>
                                <span>{formatDate(event.date)} &middot; {event.market}</span>
                            </div>
                            <span
                                className="upcoming-badge"
                                style={{ background: style.bg, color: style.color }}
                            >
                                {event.status}
                            </span>
                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default UpcomingEvents;
