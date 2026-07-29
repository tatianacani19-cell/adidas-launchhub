import { AlertTriangle, RefreshCw } from "lucide-react";

function ErrorState({ message = "Something went wrong.", onRetry }) {
    return (
        <div className="error-state" role="alert">
            <AlertTriangle size={48} strokeWidth={1.5} className="error-state-icon" />
            <h3 className="error-state-title">Error</h3>
            <p className="error-state-message">{message}</p>
            {onRetry && (
                <button className="error-state-retry" onClick={onRetry}>
                    <RefreshCw size={16} />
                    Try again
                </button>
            )}
        </div>
    );
}

export default ErrorState;
