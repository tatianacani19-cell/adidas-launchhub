import { Pencil, Trash2, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../../utils/formatDateTime";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function LaunchRow({ launch, onDelete, onStatusChange }) {

    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const canEdit = user?.role === "CREATOR" || user?.role === "ADMIN";
    const canApprove = user?.role === "APPROVER" || user?.role === "ADMIN";
    const isInReview = launch.status === "In Review";

    async function handleApprove() {
        try {
            await onStatusChange(launch._id, "Approved");
            addToast("Launch approved.", "success");
        } catch {
            addToast("Failed to approve launch.", "error");
        }
    }

    async function handleReject() {
        try {
            await onStatusChange(launch._id, "Draft");
            addToast("Launch sent back to Draft.", "info");
        } catch {
            addToast("Failed to reject launch.", "error");
        }
    }

    return (

        <tr tabIndex={0} aria-label={`Launch: ${launch.title}`}>

            <td>
                <input type="checkbox" aria-label={`Select ${launch.title}`} />
            </td>

            <td>
                <div className="launch-thumb"></div>
            </td>

            <td>

                <div
                    className="launch-title"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/launches/${launch._id}`)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") navigate(`/launches/${launch._id}`);
                    }}
                >
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

                    {canApprove && isInReview && (
                        <>
                            <button
                                className="action-btn approve"
                                onClick={handleApprove}
                                aria-label={`Approve ${launch.title}`}
                                title="Approve"
                            >
                                <Check size={16} />
                            </button>

                            <button
                                className="action-btn reject"
                                onClick={handleReject}
                                aria-label={`Reject ${launch.title}`}
                                title="Reject"
                            >
                                <X size={16} />
                            </button>
                        </>
                    )}

                    {canEdit && (
                        <>
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
                        </>
                    )}

                </div>

            </td>

        </tr>

    );

}

export default LaunchRow;
