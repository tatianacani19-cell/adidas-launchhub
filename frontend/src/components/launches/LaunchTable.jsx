import { useEffect, useState } from "react";
import api from "../../services/api";
import LaunchRow from "./LaunchRow";

function LaunchTable({ onDelete }) {

    const [launches, setLaunches] = useState([]);

    useEffect(() => {
        loadLaunches();
    }, []);

    async function loadLaunches() {
        try {
            const response = await api.get("/launches");
            setLaunches(response.data);
        } catch (error) {
            console.error("Error loading launches:", error);
        }
    }

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
                        onDelete={async (id) => {

                            console.log("Eliminando:", id);

                            try {

                                await api.delete(`/launches/${id}`);

                                console.log("Eliminado correctamente");

                                setLaunches(
                                    launches.filter(l => l.id !== id)
                                );

                            } catch (error) {

                                console.error(error);

                            }

                        }}
                    />
                ))}

            </tbody>

        </table>
    );
}

export default LaunchTable;