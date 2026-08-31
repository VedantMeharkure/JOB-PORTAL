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

                const response = await api.get("/applications/my");

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

                                    {application.job?.deadline && (
                                        <p>
                                            Apply before{" "}
                                            {new Date(
                                                application.job.deadline
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                className="secondary-button"
                                onClick={() =>
                                    application.job?._id &&
                                    navigate(`/jobs/${application.job._id}`)
                                }
                                disabled={!application.job?._id}
                            >
                                View Job
                            </button>

                            <ApplicationStatus
                                status={application.status}
                            />
                            <p className="application-status-message">
                            {application.status === "Applied" &&
                                "Your application has been submitted and is waiting for review."}

                            {application.status === "Shortlisted" &&
                                "Congratulations! The recruiter has shortlisted your application."}

                            {application.status === "Interview" &&
                                "Your interview has been scheduled. Check the details below."}

                            {application.status === "Selected" &&
                                "Congratulations! You have been selected."}

                            {application.status === "Rejected" &&
                                "This application was not selected for the next stage."}
                        </p>

                            {application.status === "Interview" &&
                                application.interview?.date && (
                                    <div className="interview-details">

                                        <h3>Interview Details</h3>

                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {new Date(
                                                application.interview.date
                                            ).toLocaleDateString()}
                                        </p>

                                        <p>
                                            <strong>Time:</strong>{" "}
                                            {application.interview.time}
                                        </p>

                                        <p>
                                            <strong>Type:</strong>{" "}
                                            {application.interview.type}
                                        </p>

                                        {application.interview.meetingLink && (
                                            <a
                                                href={application.interview.meetingLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="primary-button"
                                            >
                                                Join Interview
                                            </a>
                                        )}

                                        {application.interview.notes && (
                                            <p>
                                                <strong>Notes:</strong>{" "}
                                                {application.interview.notes}
                                            </p>
                                        )}

                                    </div>
                                )}
                                {application.status === "Selected" && (
                                    <p>
                                        Congratulations! You have been selected for this position.
                                    </p>
                                )}

                                {application.status === "Rejected" && (
                                    <p>
                                        This application was not selected for the next stage.
                                    </p>
                                )}{application.status === "Applied" && (
                                    <p>
                                        Your application is waiting for recruiter review.
                                    </p>
                                )}

                                {application.status === "Shortlisted" && (
                                    <p>
                                        Your application has been shortlisted.
                                    </p>
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