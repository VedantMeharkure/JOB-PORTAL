import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function Home() {

    const { user } = useContext(AuthContext);

    return (
        <div className="home-page">

            <section className="hero">

                <div className="hero-content">

                    <p className="hero-label">
                        JOB & INTERNSHIP PORTAL
                    </p>

                    <h1>
                        Find the right opportunity
                        for your career
                    </h1>

                    <p className="hero-description">
                        Discover jobs and internships,
                        apply easily, and track your
                        applications in one place.
                    </p>

                    <div className="hero-actions">

                        <Link
                            to="/jobs"
                            className="primary-button"
                        >
                            Browse Jobs
                        </Link>

                        {!user && (
                            <Link
                                to="/register"
                                className="secondary-button"
                            >
                                Create Account
                            </Link>
                        )}

                        {user?.role === "student" && (
                            <Link
                                to="/student/applications"
                                className="secondary-button"
                            >
                                My Applications
                            </Link>
                        )}

                        {user?.role === "recrutier" && (
                            <Link
                                to="/recruiter/dashboard"
                                className="secondary-button"
                            >
                                Recruiter Dashboard
                            </Link>
                        )}

                    </div>

                </div>

            </section>


            <section className="features">

                <h2>
                    Everything you need
                </h2>

                <div className="feature-grid">

                    <div className="feature-card">

                        <h3>
                            Find Opportunities
                        </h3>

                        <p>
                            Search and filter jobs
                            and internships based
                            on your preferences.
                        </p>

                    </div>


                    <div className="feature-card">

                        <h3>
                            Easy Applications
                        </h3>

                        <p>
                            Apply to jobs and keep
                            all your applications
                            organized in one place.
                        </p>

                    </div>


                    <div className="feature-card">

                        <h3>
                            Track Progress
                        </h3>

                        <p>
                            Track your application
                            status from Applied
                            to Selected.
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;