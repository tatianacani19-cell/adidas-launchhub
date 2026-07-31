import { formatDateTime } from "../../utils/formatDateTime";

function RecentActivity({ activities }) {
    return (
        <div className="dashboard-card">
            <div className="card-header">
                <h3>Recent Activity</h3>
            </div>

            <div className="activity-list">
                {activities.length === 0 && (
                    <p className="dashboard-empty">No recent activity.</p>
                )}

                {activities.map((activity) => (
                    <div key={activity._id} className="activity-item">
                        <div className="activity-dot"></div>
                        <div className="activity-text">
                            <span className="activity-main">
                                <strong>{activity.launchTitle || "Launch"}</strong>
                                {" \u00B7 "}
                                {activity.action}
                            </span>
                            <span className="activity-meta">
                                {activity.performedBy?.name || "Unknown User"}
                                {" \u00B7 "}
                                {formatDateTime(activity.createdAt)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentActivity;