import StatusBadge from "./StatusBadge";

function LaunchRow({ launch }) {
    return (
        <tr>

            <td>
                <input type="checkbox" />
            </td>

            <td>
                <div className="launch-thumb"></div>
            </td>

            <td>

                <div className="launch-title">
                    {launch.title}
                </div>

                <div className="launch-description">
                    {launch.description}
                </div>

            </td>

            <td>{launch.market}</td>

            <td>{launch.launchDate}</td>

            <td>
                <StatusBadge status={launch.status} />
            </td>

            <td>{launch.owner}</td>

            <td>{launch.updated}</td>

        </tr>
    );
}

export default LaunchRow;