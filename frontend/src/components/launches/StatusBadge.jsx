function StatusBadge({ status }) {

    const styles = {
        Draft: { background: "#FEE2E2", color: "#991B1B" },
        "In Review": { background: "#FEF9C3", color: "#92400E" },
        Approved: { background: "#DCFCE7", color: "#166534" },
        Published: { background: "#DBEAFE", color: "#1E40AF" },
    };

    const style = styles[status] || styles.Draft;

    return (
        <span
            className="status-badge"
            style={{
                background: style.background,
                color: style.color,
            }}
        >
            {status}
        </span>
    );
}

export default StatusBadge;