function ApplicationStatus({ status }) {
    const statuses = [
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected"
    ];

    if (status === "Rejected") {
        return (
            <div className="application-status">
                <p className="status-title">
                    Application Status
                </p>

                <div className="status-rejected-message">
                    Your application was rejected.
                </div>
            </div>
        );
    }

    const currentIndex = statuses.indexOf(status);

    return (
        <div className="application-status">
            <p className="status-title">
                Application Status
            </p>

            <div className="status-progress">
                {statuses.map((item, index) => {
                    const completed =
                        currentIndex >= 0 && index <= currentIndex;

                    const active = index === currentIndex;

                    return (
                        <div
                            className={`status-step ${
                                active ? "active" : ""
                            }`}
                            key={item}
                        >
                            <div
                                className={`status-dot ${
                                    completed ? "completed" : ""
                                }`}
                            >
                                {completed ? "✓" : ""}
                            </div>

                            <span>{item}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ApplicationStatus;