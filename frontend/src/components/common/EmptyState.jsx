import { PackageOpen } from "lucide-react";

function EmptyState({ icon: Icon = PackageOpen, title = "No data found", message = "There are no items to display." }) {
    return (
        <div className="empty-state" role="status">
            <Icon size={48} strokeWidth={1.5} className="empty-state-icon" />
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-message">{message}</p>
        </div>
    );
}

export default EmptyState;
