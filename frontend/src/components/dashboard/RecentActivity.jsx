function RecentActivity() {
    const activities = [
        "You created the launch",
        "Launch Gazelle moved to In Review",
        "You updated assets",
        "Launch 'Stan Smith' was approved",
        "You created the launch 'Campus'",
    ];

    return (
        <div className="dashboard-card">
            <div className="card-header">
                <h3>Recent Activity</h3>
            </div>

            <div className="activity-list">
                {activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                        <div className="activity-dot"></div>
                        <span>{activity}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentActivity;