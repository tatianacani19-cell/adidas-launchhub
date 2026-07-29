import { useEffect, useRef } from "react";

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {

    const confirmRef = useRef(null);

    useEffect(() => {
        if (open && confirmRef.current) {
            confirmRef.current.focus();
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") onCancel();
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="confirm-title" className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button
                        className="modal-btn modal-btn-cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        ref={confirmRef}
                        className="modal-btn modal-btn-confirm"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
