import { Check } from "lucide-react";

const STATUS_STEPS = ["Draft", "In Review", "Approved", "Published"];

function StatusTimeline({ status }) {
    const currentIndex = STATUS_STEPS.indexOf(status);

    if (currentIndex === -1) return null;

    return (
        <div className="status-timeline" role="group" aria-label="Launch progress">
            {STATUS_STEPS.map((step, index) => {
                const isDone = index <= currentIndex;
                const isCurrent = index === currentIndex;
                return (
                    <div
                        key={step}
                        className={`timeline-step ${isDone ? "done" : "pending"} ${isCurrent ? "current" : ""}`}
                    >
                        <div className="timeline-dot">
                            {isDone && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="timeline-label">{step}</span>
                        {index < STATUS_STEPS.length - 1 && (
                            <div className={`timeline-connector ${index < currentIndex ? "done" : ""}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default StatusTimeline;
