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
                        onClick={() => navigate(`/launches/${launch._id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                navigate(`/launches/${launch._id}`);
                            }
                        }}
                    >

                        {launch.productImage?.url ? (
                            <img
                                src={launch.productImage.url}
                                alt={launch.title}
                                className="launch-image"
                            />
                        ) : (
                            <div className="launch-image"></div>
                        )}

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