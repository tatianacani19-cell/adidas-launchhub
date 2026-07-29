import LaunchRow from "./LaunchRow";

function LaunchTable({ launches, onDelete }) {

    return (
        <table className="launch-table">

            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th>Launch</th>
                    <th>Market</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>

                {launches.map((launch) => (
                    <LaunchRow
                        key={launch.id}
                        launch={{
                            ...launch,
                            owner: launch.owner || "Marketing Team",
                            updated: launch.updated || "-",
                        }}
                        onDelete={onDelete}
                    />
                ))}

            </tbody>

        </table>
    );
}

export default LaunchTable;