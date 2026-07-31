import { useMemo } from "react";

function UpcomingEvents({ events }) {

    const upcoming = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const limit = new Date(today);
        limit.setDate(limit.getDate() + 7);

        return events
            .filter((e) => {
                const date = new Date(e.start + "T00:00:00");
                return date >= today && date <= limit;
            })
            .sort((a, b) => a.start.localeCompare(b.start));
    }, [events]);

    const statusColors = {
        Draft: { bg: "#FEE2E2", color: "#991B1B" },
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
                    const status = event.extendedProps.status;
                    const market = event.extendedProps.market;
                    const style = statusColors[status] || statusColors.Meeting;
                    return (
                        <div key={event.id} className="upcoming-item">
                            <div className="upcoming-info">
                                <h4>{event.title}</h4>
                                <span>{formatDate(event.start)} &middot; {market}</span>
                            </div>
                            <span
                                className="upcoming-badge"
                                style={{ background: style.bg, color: style.color }}
                            >
                                {status}
                            </span>
                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default UpcomingEvents;
