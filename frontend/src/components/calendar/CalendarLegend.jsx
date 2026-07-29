function CalendarLegend() {

    const items = [
        { label: "Launch", color: "#DCFCE7", textColor: "#166534" },
        { label: "Review", color: "#FEF9C3", textColor: "#92400E" },
        { label: "Approve", color: "#DBEAFE", textColor: "#1E40AF" },
        { label: "Due", color: "#FEE2E2", textColor: "#991B1B" },
        { label: "Meeting", color: "#F3F4F6", textColor: "#374151" },
    ];

    return (
        <div className="calendar-card">

            <div className="calendar-card-header">
                <h3>Legend</h3>
            </div>

            <div className="legend-list">

                {items.map((item) => (
                    <div key={item.label} className="legend-item">
                        <span
                            className="legend-dot"
                            style={{ background: item.color, border: `2px solid ${item.textColor}` }}
                        />
                        <span className="legend-label">{item.label}</span>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default CalendarLegend;
