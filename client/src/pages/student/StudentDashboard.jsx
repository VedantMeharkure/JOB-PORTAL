import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

function RecruiterDashboard() {

    const { user, loading: authLoading } = useContext(AuthContext);

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!user || user.role !== "recrutier") {
            setLoading(false);
            return;
        }

        const fetchDashboardData = async () => {

            try {

                const jobsResponse = await api.get("/jobs/my");

                const myJobs = jobsResponse.data.jobs;

                setJobs(myJobs);

                let allApplications = [];

                for (const job of myJobs) {

                    const applicationsResponse =
                        await api.get(
                            `/applications/job/${job._id}`
                        );

                    allApplications = [
                        ...allApplications,
                        ...applicationsResponse.data.applications
                    ];
                }

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

    if (authLoading || loading) {
        return <p>Loading Dashboard...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "recrutier") {
        return <Navigate to="/unauthorized" replace />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totalApplications = applications.length;

    const shortlisted = applications.filter(
        (application) =>
            application.status === "Shortlisted"
    ).length;

    const interviews = applications.filter(
        (application) =>
            application.status === "Interview"
    ).length;

    const selected = applications.filter(
        (application) =>
            application.status === "Selected"
    ).length;

    const rejected = applications.filter(
        (application) =>
            application.status === "Rejected"
    ).length;

    return (
    <div className="dashboard-page">

        <div className="dashboard-header">
            <div>
                <p className="dashboard-label">
                    STUDENT DASHBOARD
                </p>

                <h1>
                    Welcome, {user.name}
                </h1>

                <p>
                    Track your job applications and discover new opportunities.
                </p>
            </div>

            <button
                onClick={() => navigate("/jobs")}
                className="primary-button"
            >
                Browse Jobs
            </button>
        </div>


        <section className="stats-grid">

            <div className="stat-card">
                <p>Total Applications</p>
                <h2>{totalApplications}</h2>
            </div>

            <div className="stat-card">
                <p>Shortlisted</p>
                <h2>{shortlisted}</h2>
            </div>

            <div className="stat-card">
                <p>Interviews</p>
                <h2>{interviews}</h2>
            </div>

            <div className="stat-card">
                <p>Selected</p>
                <h2>{selected}</h2>
            </div>

        </section>


        <section className="dashboard-actions">

            <h2>Quick Actions</h2>

            <div className="action-grid">

                <div className="action-card">

                    <h3>
                        Browse Jobs
                    </h3>

                    <p>
                        Find jobs and internships
                        that match your skills.
                    </p>

                    <button
                        onClick={() => navigate("/jobs")}
                    >
                        Find Opportunities
                    </button>

                </div>


                <div className="action-card">

                    <h3>
                        My Applications
                    </h3>

                    <p>
                        Track your applications,
                        interviews, and results.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/student/applications")
                        }
                    >
                        View Applications
                    </button>

                </div>


                <div className="action-card">

                    <h3>
                        My Profile
                    </h3>

                    <p>
                        Keep your profile and resume
                        up to date.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/student/profile")
                        }
                    >
                        Edit Profile
                    </button>

                </div>

            </div>

        </section>

    </div>
);
}

export default RecruiterDashboard;