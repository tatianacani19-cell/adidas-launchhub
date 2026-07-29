import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function LaunchRow({ launch, onDelete }) {

    const navigate = useNavigate();

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

            <td>{launch.owner || "Marketing Team"}</td>

            <td>{launch.updated || "-"}</td>

            <td>

                <div className="actions">

                    <button
                        className="action-btn edit"
                        onClick={() => navigate(`/launches/edit/${launch.id}`)}
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        className="action-btn delete"
                        onClick={async () => {

                            const confirmDelete = window.confirm(
                                "Are you sure you want to delete this launch?"
                            );

                            if (!confirmDelete) return;

                            await onDelete(launch.id);

                        }}
                    >
                        <Trash2 size={16} />
                    </button>

                </div>

            </td>

        </tr>

    );

}

export default LaunchRow;