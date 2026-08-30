function StatusBadge({ status }) {

    const className = status
        ? status.toLowerCase().replace(/\s+/g, "-")
        : "unknown";

    return (
        <span className={`status-badge status-${className}`}>
            {status || "Unknown"}
        </span>
    );
}

export default StatusBadge;