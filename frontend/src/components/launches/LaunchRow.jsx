import { Pencil, Trash2, Check, X, Send, Globe, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../../utils/formatDateTime";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const STATUS_ORDER = ["Draft", "In Review", "Approved", "Published"];

function LaunchRow({ launch, onDelete, onStatusChange }) {

    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [backMenuOpen, setBackMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const backBtnRef = useRef(null);

    const canEdit = user?.role === "CREATOR" || user?.role === "ADMIN";
    const canApprove = user?.role === "APPROVER" || user?.role === "ADMIN";
    const isDraft = launch.status === "Draft";
    const isInReview = launch.status === "In Review";
    const isApproved = launch.status === "Approved";
    const currentIndex = STATUS_ORDER.indexOf(launch.status);
    const previousStatuses = currentIndex > 0 ? STATUS_ORDER.slice(0, currentIndex) : [];

    function toggleBackMenu() {
        if (backMenuOpen) {
            setBackMenuOpen(false);
            return;
        }
        const rect = backBtnRef.current?.getBoundingClientRect();
        if (rect) {
            setMenuPos({ top: rect.bottom + 6, left: rect.right - 160 });
        }
        setBackMenuOpen(true);
    }

    const productImageUrl = launch.productImage?.url || null;
    const lastActivity = launch.activityLog?.length
        ? launch.activityLog[launch.activityLog.length - 1]
        : null;

    async function handleSubmitForReview() {
        try {
            await onStatusChange(launch._id, "In Review");
            addToast("Launch submitted for review.", "success");
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to submit launch.", "error");
        }
    }

    async function handleApprove() {
        try {
            await onStatusChange(launch._id, "Approved");
            addToast("Launch approved.", "success");
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to approve launch.", "error");
        }
    }

    async function handleReject() {
        try {
            await onStatusChange(launch._id, "Draft");
            addToast("Launch sent back to Draft.", "info");
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to reject launch.", "error");
        }
    }

    async function handlePublish() {
        try {
            await onStatusChange(launch._id, "Published");
            addToast("Launch published.", "success");
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to publish launch.", "error");
        }
    }

    async function handleStepBack(target) {
        try {
            await onStatusChange(launch._id, target);
            addToast(`Launch moved back to ${target}.`, "info");
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to move launch back.", "error");
        } finally {
            setBackMenuOpen(false);
        }
    }

    return (

        <tr tabIndex={0} aria-label={`Launch: ${launch.title}`}>

            <td>
                <input type="checkbox" aria-label={`Select ${launch.title}`} />
            </td>

            <td>
                {productImageUrl ? (
                    <img
                        src={productImageUrl}
                        alt={launch.title}
                        className="launch-thumb-img"
                    />
                ) : (
                    <div className="launch-thumb"></div>
                )}
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
                {lastActivity && (
                    <div className="launch-last-activity" title={`${lastActivity.action} · ${lastActivity.description}`}>
                        <span className="launch-last-activity-label">{lastActivity.action}</span>
                        <span className="launch-last-activity-desc">{lastActivity.description}</span>
                    </div>
                )}

                <div className="actions">

                    {canEdit && isDraft && (
                        <button
                            className="action-btn submit"
                            onClick={handleSubmitForReview}
                            aria-label={`Submit ${launch.title} for review`}
                            title="Submit for Review"
                        >
                            <Send size={16} />
                        </button>
                    )}

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

                    {user?.role === "ADMIN" && isApproved && (
                        <button
                            className="action-btn publish"
                            onClick={handlePublish}
                            aria-label={`Publish ${launch.title}`}
                            title="Publish"
                        >
                            <Globe size={16} />
                        </button>
                    )}

                    {(user?.role === "ADMIN" || user?.role === "CREATOR") && previousStatuses.length > 0 && (
                        <div className="back-menu-wrapper">
                            <button
                                ref={backBtnRef}
                                className="action-btn back"
                                onClick={toggleBackMenu}
                                aria-label={`Move ${launch.title} back a step`}
                                title="Move back"
                                aria-haspopup="menu"
                                aria-expanded={backMenuOpen}
                            >
                                <Undo2 size={16} />
                            </button>
                            {backMenuOpen && (
                                <>
                                    <div
                                        style={{ position: "fixed", inset: 0, zIndex: 99 }}
                                        onClick={() => setBackMenuOpen(false)}
                                    />
                                    <div className="back-menu" style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}>
                                        {previousStatuses.map((target) => (
                                            <button
                                                key={target}
                                                className="back-menu-item"
                                                onClick={() => handleStepBack(target)}
                                            >
                                                <Undo2 size={14} />
                                                {target}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
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
