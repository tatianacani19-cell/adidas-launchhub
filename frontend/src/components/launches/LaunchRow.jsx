import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../../utils/formatDateTime";

function LaunchRow({ launch, onDelete }) {

    const navigate = useNavigate();

    return (

        <tr tabIndex={0} aria-label={`Launch: ${launch.title}`}>

            <td>
                <input type="checkbox" aria-label={`Select ${launch.title}`} />
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

            <td>{formatDateTime(launch.updatedAt)}</td>

            <td>

                <div className="actions">

                    <button
                        className="action-btn edit"
                        onClick={() => navigate(`/launches/edit/${launch._id}`)}
                        aria-label={`Edit ${launch.title}`}
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        className="action-btn delete"
                        onClick={() => onDelete(launch)}
                        aria-label={`Delete ${launch.title}`}
                    >
                        <Trash2 size={16} />
                    </button>

                </div>

            </td>

        </tr>

    );

}

export default LaunchRow;