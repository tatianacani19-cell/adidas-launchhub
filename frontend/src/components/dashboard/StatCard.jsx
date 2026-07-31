function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconBg,
    iconColor,
    active = false,
    onClick
}) {
    return (
        <div
            className={`stat-card ${active ? "active" : ""} ${onClick ? "clickable" : ""}`}
            onClick={onClick}
        >

            <div
                className="stat-icon"
                style={{
                    "--icon-hover-bg": iconBg,
                    "--icon-hover-color": iconColor,
                }}
            >
                {Icon && <Icon size={22} />}
            </div>

            <div>

                <h4>{title}</h4>

                <h2>{value}</h2>

                <p>{subtitle}</p>

            </div>

        </div>
    );
}

export default StatCard;
