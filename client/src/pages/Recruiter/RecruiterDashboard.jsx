import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || user.role !== "recruiter") {
            setLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setError("");

                const jobsResponse = await api.get("/jobs/my");
                const myJobs = jobsResponse.data.jobs || [];

                setJobs(myJobs);

                const applicationResponses = await Promise.all(
                    myJobs.map((job) =>
                        api.get(`/applications/job/${job._id}`)
                    )
                );

                const allApplications = applicationResponses.flatMap(
                    (response) =>
                        response.data.applications || []
                );

                setApplications(allApplications);
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

    const handleDeleteJob = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) return;

        try {
            setError("");

            await api.delete(`/jobs/${jobId}`);

            setJobs((previousJobs) =>
                previousJobs.filter(
                    (job) => job._id !== jobId
                )
            );

            setApplications((previousApplications) =>
                previousApplications.filter(
                    (application) =>
                        application.job?._id !== jobId &&
                        application.job !== jobId
                )
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete job"
            );
        }
    };

    if (authLoading || loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "recruiter") {
        return <Navigate to="/unauthorized" replace />;
    }

    const now = new Date();

    const activeJobs = jobs.filter((job) => {
        const deadline = new Date(job.deadline);
        deadline.setHours(23, 59, 59, 999);

        return deadline >= now;
    });

    const totalApplications = applications.length;

    return (
        <div className="recruiter-dashboard">

            <section className="dashboard-header">
                <div>
                    <p className="dashboard-label">
                        Recruiter Portal
                    </p>

                    <h1>
                        Welcome back, {user.name}
                    </h1>

                    <p className="dashboard-subtitle">
                        Manage your job postings and applications.
                    </p>
                </div>

                <button
                    className="create-job-btn"
                    onClick={() =>
                        navigate("/recruiter/jobs/new")
                    }
                >
                    + Create New Job
                </button>
            </section>

            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}

            <section className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-icon">💼</div>

                    <div>
                        <span>Total Jobs</span>
                        <strong>{jobs.length}</strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📋</div>

                    <div>
                        <span>Active Postings</span>
                        <strong>{activeJobs.length}</strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👥</div>

                    <div>
                        <span>Applications</span>
                        <strong>{totalApplications}</strong>
                    </div>
                </div>

            </section>

            <section className="jobs-section">

                <div className="section-heading">
                    <div>
                        <h2>My Job Postings</h2>

                        <p>
                            Jobs you have posted on the platform.
                        </p>
                    </div>
                </div>

                {jobs.length === 0 ? (
                    <div className="empty-state">

                        <div className="empty-icon">
                            💼
                        </div>

                        <h3>
                            No jobs posted yet
                        </h3>

                        <p>
                            Create your first job posting and
                            start receiving applications.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/recruiter/jobs/new")
                            }
                        >
                            Create Your First Job
                        </button>

                    </div>
                ) : (
                    <div className="jobs-grid">

                        {jobs.map((job) => {
                            const jobApplications =
                                applications.filter(
                                    (application) =>
                                        application.job?._id ===
                                            job._id ||
                                        application.job ===
                                            job._id
                                );

                            const deadline =
                                new Date(job.deadline);

                            deadline.setHours(
                                23,
                                59,
                                59,
                                999
                            );

                            const isActive =
                                deadline >= new Date();

                            return (
                                <article
                                    className="job-card"
                                    key={job._id}
                                >

                                    <div className="job-card-top">

                                        <div>
                                            <span className="job-type">
                                                {job.employmentType}
                                            </span>

                                            <h3>
                                                {job.title}
                                            </h3>

                                            <p className="company">
                                                {job.company}
                                            </p>
                                        </div>

                                        <div className="job-menu">
                                            ⋮
                                        </div>

                                    </div>

                                    <div className="job-details">

                                        <span>
                                            📍 {job.location}
                                        </span>

                                        <span>
                                            💰{" "}
                                            {job.salary
                                                ? `₹${job.salary}`
                                                : "Not specified"}
                                        </span>

                                        <span>
                                            🎓{" "}
                                            {job.experience ||
                                                "Fresher"}
                                        </span>

                                    </div>

                                    <div className="job-skills">

                                        {job.skills
                                            ?.slice(0, 4)
                                            .map(
                                                (skill, index) => (
                                                    <span
                                                        key={index}
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}

                                    </div>

                                    <div className="job-footer">

                                        <span>
                                            {isActive
                                                ? "🟢 Active"
                                                : "🔴 Closed"}
                                        </span>

                                        <span>
                                            👥{" "}
                                            {
                                                jobApplications.length
                                            }{" "}
                                            applications
                                        </span>

                                    </div>

                                    <div className="job-footer">

                                        <button
                                            className="secondary-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/recruiter/jobs/edit/${job._id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="application-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/recruiter/jobs/${job._id}/applications`
                                                )
                                            }
                                        >
                                            Applications
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDeleteJob(
                                                    job._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}

            </section>

        </div>
    );
}

export default RecruiterDashboard;