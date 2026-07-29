function Skeleton({ variant = "text", width, height, count = 1 }) {

    const baseStyle = {
        width: width || "100%",
        height: height || (variant === "text" ? "16px" : variant === "circle" ? "40px" : "120px"),
    };

    return (
        <div className="skeleton-group" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`skeleton skeleton-${variant}`}
                    style={baseStyle}
                />
            ))}
        </div>
    );
}

export function SkeletonRow() {
    return (
        <tr className="skeleton-row">
            <td><div className="skeleton skeleton-circle" style={{ width: 16, height: 16 }} /></td>
            <td><div className="skeleton skeleton-rect" style={{ width: 40, height: 40 }} /></td>
            <td>
                <div className="skeleton skeleton-text" style={{ width: "60%", height: 14, marginBottom: 6 }} />
                <div className="skeleton skeleton-text" style={{ width: "80%", height: 12 }} />
            </td>
            <td><div className="skeleton skeleton-text" style={{ width: 70, height: 14 }} /></td>
            <td><div className="skeleton skeleton-text" style={{ width: 80, height: 14 }} /></td>
            <td><div className="skeleton skeleton-badge" style={{ width: 72, height: 26 }} /></td>
            <td><div className="skeleton skeleton-text" style={{ width: 90, height: 14 }} /></td>
            <td><div className="skeleton skeleton-text" style={{ width: 60, height: 14 }} /></td>
            <td>
                <div style={{ display: "flex", gap: 6 }}>
                    <div className="skeleton skeleton-circle" style={{ width: 32, height: 32 }} />
                    <div className="skeleton skeleton-circle" style={{ width: 32, height: 32 }} />
                </div>
            </td>
        </tr>
    );
}

export default Skeleton;
