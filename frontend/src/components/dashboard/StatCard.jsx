function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconBg,
    iconColor
}) {
    return (
        <div className="stat-card">

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