import { useNavigate } from "react-router-dom";

function UpcomingLaunches({ launches }) {

    const navigate = useNavigate();

    return (
        <div className="dashboard-card">

            <div className="card-header">
                <h3>Upcoming Launches</h3>
                <span onClick={() => navigate("/launches")}>View all</span>
            </div>

            <div className="launch-list">

                {launches.length === 0 && (
                    <p className="dashboard-empty">No upcoming launches.</p>
                )}

                {launches.map((launch) => (
                    <div
                        key={launch.id}
                        className="launch-item"
                    >

                        <div className="launch-image"></div>

                        <div className="launch-info">

                            <h4>{launch.title}</h4>

                            <p>{launch.description}</p>

                            <span>{launch.market}</span>

                        </div>

                        <div className="launch-date">
                            {launch.launchDate}
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default UpcomingLaunches;