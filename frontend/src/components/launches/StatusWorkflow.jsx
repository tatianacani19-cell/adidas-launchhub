import { Send, Check, X, Globe, Undo2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";

const STATUS_ORDER = ["Draft", "In Review", "Approved", "Published"];

function StatusWorkflow({ launch, onStatusChanged }) {
    const { user } = useAuth();
    const { addToast } = useToast();
    const role = user?.role;
    const status = launch?.status;
    const currentIndex = STATUS_ORDER.indexOf(status);

    const canSubmitForReview = (role === "CREATOR" || role === "ADMIN") && status === "Draft";
    const canApprove = (role === "APPROVER" || role === "ADMIN") && status === "In Review";
    const canReject = (role === "APPROVER" || role === "ADMIN") && status === "In Review";
    const canPublish = (role === "ADMIN" || role === "APPROVER") && status === "Approved";
    const canStepBack = (role === "ADMIN" || role === "CREATOR") && currentIndex > 0;

    const showWorkflow = canSubmitForReview || canApprove || canReject || canPublish || canStepBack;

    if (!showWorkflow) return null;

    async function changeStatus(nextStatus) {
        try {
            await api.put(`/launches/${launch._id}/status`, { status: nextStatus });
            addToast(`Status changed to ${nextStatus}.`, "success");
            if (onStatusChanged) onStatusChanged();
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to change status.", "error");
        }
    }

    return (
        <div className="status-workflow" role="group" aria-label="Launch status workflow">
            {canSubmitForReview && (
                <button
                    className="wf-btn submit"
                    onClick={() => changeStatus("In Review")}
                    title="Submit for review"
                >
                    <Send size={16} />
                    Submit for Review
                </button>
            )}
            {canApprove && (
                <button
                    className="wf-btn approve"
                    onClick={() => changeStatus("Approved")}
                    title="Approve launch"
                >
                    <Check size={16} />
                    Approve
                </button>
            )}
            {canReject && (
                <button
                    className="wf-btn reject"
                    onClick={() => changeStatus("Draft")}
                    title="Reject and send back to Draft"
                >
                    <X size={16} />
                    Reject
                </button>
            )}
            {canPublish && (
                <button
                    className="wf-btn publish"
                    onClick={() => changeStatus("Published")}
                    title="Publish launch"
                >
                    <Globe size={16} />
                    Publish
                </button>
            )}
            {canStepBack && (
                <div className="wf-back-group">
                    <span className="wf-back-label">Move back:</span>
                    {STATUS_ORDER.slice(0, currentIndex).map((target) => (
                        <button
                            key={target}
                            className="wf-btn back"
                            onClick={() => changeStatus(target)}
                            title={`Move back to ${target}`}
                        >
                            <Undo2 size={14} />
                            {target}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StatusWorkflow;
