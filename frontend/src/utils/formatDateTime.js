export function formatDateTime(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}

export function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

export function formatTime(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

export function getActivityIcon(action) {
    const actionIcons = {
        "Launch Created": "FilePlus",
        "Launch Updated": "Edit3",
        "Status Changed": "ArrowRightLeft",
        "Asset Uploaded": "Upload",
        "Asset Deleted": "Trash2",
        "Product Image Updated": "Image",
        "Product Image Deleted": "Trash2",
        "Launch Approved": "CheckCircle",
        "Launch Published": "Globe",
        "Launch Archived": "Archive",
    };
    return actionIcons[action] || "Activity";
}
