function StatusBadge({ status }) {

    const colors = {
        Draft: "#E5E7EB",
        "In Review": "#FDE68A",
        Approved: "#BBF7D0",
        Published: "#BFDBFE",
    };

    return (
        <span
            className="status-badge"
            style={{
                background: colors[status]
            }}
        >
            {status}
        </span>
    );
}

export default StatusBadge;