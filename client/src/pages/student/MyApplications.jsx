import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./MyApplications.css";

import { AuthContext } from "../../context/AuthContext";
import ApplicationStatus from "../../components/ApplicationStatus";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

function MyApplications() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || user.role !== "student") {
            setLoading(false);
            return;
        }

        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/application/my");

                setApplications(
                    response.data.applications || []
                );
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load applications"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [user]);

    if (authLoading) {
        return (
            <Loading message="Checking authentication..." />
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "student") {
        return <Navigate to="/unauthorized" replace />;
    }

    if (loading) {
        return (
            <Loading message="Loading your applications..." />
        );
    }

    return (
        <div className="applications-page">
            <div className="page-header">
                <div>
                    <p className="dashboard-label">
                        STUDENT
                    </p>

                    <h1>
                        My Applications
                    </h1>

                    <p>
                        Track your applications and
                        interview progress.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={() => navigate("/jobs")}
                >
                    Browse Jobs
                </button>
            </div>

            <ErrorMessage message={error} />

            {applications.length === 0 ? (
                <EmptyState
                    title="No applications yet"
                    message="Browse available jobs and apply to opportunities that match your skills."
                />
            ) : (
                <div className="student-applications-list">
                    {applications.map((application) => (
                        <div
                            className="application-card"
                            key={application._id}
                        >
                            <div className="application-header">
                                <div>
                                    <p className="job-company">
                                        {application.job?.company}
                                    </p>

                                    <h2>
                                        {application.job?.title}
                                    </h2>

                                    <p>
                                        {application.job?.location}
                                        {" · "}
                                        {application.job?.employmentType}
                                    </p>
                                </div>
                            </div>

                            <ApplicationStatus
                                status={application.status}
                            />

                            {application.interview?.date && (
                                <div className="student-interview-card">
                                    <div className="student-interview-header">
                                        <h3>
                                            Interview Details
                                        </h3>

                                        <span className="status-badge status-interview">
                                            Interview
                                        </span>
                                    </div>

                                    <div className="interview-details-grid">
                                        <div>
                                            <span>Date</span>

                                            <strong>
                                                {new Date(
                                                    application.interview.date
                                                ).toLocaleDateString()}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Time</span>

                                            <strong>
                                                {application.interview.time}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Type</span>

                                            <strong>
                                                {application.interview.type}
                                            </strong>
                                        </div>
                                    </div>

                                    {application.interview.meetingLink && (
                                        <a
                                            className="primary-button"
                                            href={application.interview.meetingLink}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Join Interview
                                        </a>
                                    )}

                                    {application.interview.notes && (
                                        <div className="interview-notes">
                                            <strong>
                                                Notes
                                            </strong>

                                            <p>
                                                {application.interview.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="application-footer">
                                <span>
                                    Applied on
                                </span>

                                <strong>
                                    {new Date(
                                        application.createdAt
                                    ).toLocaleDateString()}
                                </strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyApplications;