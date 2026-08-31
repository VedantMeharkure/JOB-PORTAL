import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import api from "../../services/api";

import "./StudentDashboard.css";

function StudentDashboard() {
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

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/applications/my");

                setApplications(response.data.applications || []);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (authLoading) {
        return <Loading message="Checking authentication..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "student") {
        return <Navigate to="/unauthorized" replace />;
    }

    if (loading) {
        return <Loading message="Loading your dashboard..." />;
    }

    const totalApplications = applications.length;

    const shortlisted = applications.filter(
        (application) =>
            application.status === "Shortlisted"
    ).length;

    const interviews = applications.filter(
        (application) =>
            application.status === "Interview" ||
            application.interview?.date
    ).length;

    const selected = applications.filter(
        (application) =>
            application.status === "Selected"
    ).length;

    const recentApplications = applications.slice(0, 3);

    return (
        <div className="student-dashboard">

            <section className="student-dashboard-header">

                <div>
                    <p className="dashboard-label">
                        STUDENT DASHBOARD
                    </p>

                    <h1>
                        Welcome, {user.name}
                    </h1>

                    <p>
                        Track your applications and discover
                        your next opportunity.
                    </p>
                </div>

                <button
                    className="student-primary-button"
                    onClick={() => navigate("/jobs")}
                >
                    Browse Jobs
                </button>

            </section>


            <ErrorMessage message={error} />


            <section className="student-stats-grid">

                <div className="student-stat-card">
                    <div className="student-stat-icon">
                        📄
                    </div>

                    <div>
                        <span>
                            Applications
                        </span>

                        <strong>
                            {totalApplications}
                        </strong>
                    </div>
                </div>


                <div className="student-stat-card">
                    <div className="student-stat-icon">
                        ⭐
                    </div>

                    <div>
                        <span>
                            Shortlisted
                        </span>

                        <strong>
                            {shortlisted}
                        </strong>
                    </div>
                </div>


                <div className="student-stat-card">
                    <div className="student-stat-icon">
                        📅
                    </div>

                    <div>
                        <span>
                            Interviews
                        </span>

                        <strong>
                            {interviews}
                        </strong>
                    </div>
                </div>


                <div className="student-stat-card">
                    <div className="student-stat-icon">
                        🎯
                    </div>

                    <div>
                        <span>
                            Selected
                        </span>

                        <strong>
                            {selected}
                        </strong>
                    </div>
                </div>

            </section>


            <section className="recent-applications-section">

                <div className="section-heading">

                    <div>
                        <h2>
                            Recent Applications
                        </h2>

                        <p>
                            Keep track of your latest applications.
                        </p>
                    </div>

                    {applications.length > 0 && (
                        <button
                            className="view-all-button"
                            onClick={() =>
                                navigate("/student/applications")
                            }
                        >
                            View All
                        </button>
                    )}

                </div>


                {recentApplications.length === 0 ? (

                    <div className="dashboard-empty-state">

                        <div className="dashboard-empty-icon">
                            📋
                        </div>

                        <h3>
                            No applications yet
                        </h3>

                        <p>
                            Start exploring jobs and apply to
                            opportunities that match your skills.
                        </p>

                        <button
                            className="student-primary-button"
                            onClick={() => navigate("/jobs")}
                        >
                            Find Jobs
                        </button>

                    </div>

                ) : (

                    <div className="recent-applications-list">

                        {recentApplications.map(
                            (application) => (

                                <div
                                    className="recent-application-card"
                                    key={application._id}
                                >

                                    <div className="recent-application-info">

                                        <p>
                                            {application.job?.company}
                                        </p>

                                        <h3>
                                            {application.job?.title}
                                        </h3>

                                        <span>
                                            {application.job?.location}
                                            {" · "}
                                            {application.job?.employmentType}
                                        </span>

                                    </div>


                                    <div className="recent-application-status">

                                        <span
                                            className={`application-status-badge status-${application.status?.toLowerCase()}`}
                                        >
                                            {application.status}
                                        </span>

                                        <small>
                                            Applied{" "}
                                            {new Date(
                                                application.createdAt
                                            ).toLocaleDateString()}
                                        </small>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            <section className="quick-actions-section">

                <div className="section-heading">

                    <div>
                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Manage your job search from one place.
                        </p>
                    </div>

                </div>


                <div className="student-action-grid">

                    <div className="student-action-card">

                        <div className="action-icon">
                            🔎
                        </div>

                        <h3>
                            Browse Jobs
                        </h3>

                        <p>
                            Find jobs and internships that
                            match your skills and interests.
                        </p>

                        <button
                            onClick={() => navigate("/jobs")}
                        >
                            Find Opportunities →
                        </button>

                    </div>


                    <div className="student-action-card">

                        <div className="action-icon">
                            📋
                        </div>

                        <h3>
                            My Applications
                        </h3>

                        <p>
                            Track application status,
                            interviews, and results.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/student/applications")
                            }
                        >
                            View Applications →
                        </button>

                    </div>


                    <div className="student-action-card">

                        <div className="action-icon">
                            👤
                        </div>

                        <h3>
                            My Profile
                        </h3>

                        <p>
                            Keep your profile, skills, and
                            resume up to date.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/student/profile")
                            }
                        >
                            Edit Profile →
                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default StudentDashboard;