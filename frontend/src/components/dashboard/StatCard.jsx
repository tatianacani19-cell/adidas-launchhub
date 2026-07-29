function StatCard({
    title,
    value,
    subtitle
}) {
    return (
        <div className="stat-card">

            <div className="stat-icon"></div>

            <div>

                <h4>{title}</h4>

                <h2>{value}</h2>

                <p>{subtitle}</p>

            </div>

        </div>
    );
}

export default StatCard;