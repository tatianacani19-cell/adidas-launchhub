import StatusBadge from "../launches/StatusBadge";

function RecentLaunches({ launches }) {

    return (
        <div className="dashboard-card">

            <div className="card-header">
                <h3>Recent Launches</h3>
            </div>

            <div className="recent-list">

                {launches.length === 0 && (
                    <p className="dashboard-empty">No launches yet.</p>
                )}

                {launches.map((launch) => (
                    <div key={launch.id} className="recent-item">
                        <div className="recent-info">
                            <h4>{launch.title}</h4>
                            <span>{launch.market} &middot; {launch.launchDate}</span>
                        </div>
                        <StatusBadge status={launch.status} />
                    </div>
                ))}

            </div>

        </div>
    );
}

export default RecentLaunches;
