function UpcomingLaunches() {
    const launches = [
        {
            id: 1,
            title: "Samba OG-Core Black",
            description: "Classic reimagined for a generation",
            country: "Colombia",
            date: "15 Jul",
        },
        {
            id: 2,
            title: "Gazelle-Arctic Night",
            description: "A timeless icon, a bold future",
            country: "Mexico",
            date: "22 Jul",
        },
        {
            id: 3,
            title: "Adilette 22-Summer Edition",
            description: "Comfort meets performance",
            country: "Colombia",
            date: "28 Jul",
        },
    ];

    return (
        <div className="dashboard-card">

            <div className="card-header">
                <h3>Upcoming Launches</h3>
                <span>View all</span>
            </div>

            <div className="launch-list">

                {launches.map((launch) => (
                    <div
                        key={launch.id}
                        className="launch-item"
                    >

                        <div className="launch-image"></div>

                        <div className="launch-info">

                            <h4>{launch.title}</h4>

                            <p>{launch.description}</p>

                            <span>{launch.country}</span>

                        </div>

                        <div className="launch-date">
                            {launch.date}
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default UpcomingLaunches;