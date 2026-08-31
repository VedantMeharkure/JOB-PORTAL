import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import "../student/JobDetails.css";
function JobDetails() {
    const { id } = useParams();
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [resume, setResume] = useState("");
    const [changeResume, setChangeResume] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [applicationMessage, setApplicationMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    const isStudent = user?.role === "student";

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/jobs/${id}`);

                setJob(response.data.job);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load job"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    useEffect(() => {
        if (!user || user.role !== "student") {
            return;
        }
        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/me");

                setResume(response.data.user.resume || "");
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, [user]);

    const handleApply = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "student") {
            setApplicationMessage(
                "Only students can apply for jobs."
            );
            return;
        }
        if (hasApplied) {
    setApplicationMessage(
        "You have already applied for this job."
    );
    return;
}
        const deadline = new Date(job.deadline);
        deadline.setHours(23, 59, 59, 999);

        if (new Date() > deadline) {
            setApplicationMessage(
                "The application deadline for this job has passed."
            );
            return;
        }

        setApplicationMessage("");
        setChangeResume(false);
        setShowApplicationForm(true);
    };

    const handleApplicationSubmit = async (event) => {
        event.preventDefault();

        if (!resume.trim()) {
            setApplicationMessage(
                "Please provide a resume before applying."
            );
            return;
        }

        try {
            setSubmitting(true);
            setApplicationMessage("");
            const response = await api.post(
                "/applications",
                {
                    jobId: id,
                    resume: resume.trim(),
                    coverLetter: coverLetter.trim(),
                }
            );
            setHasApplied(true);
            setApplicationMessage(
                response.data.message ||
                "Application submitted successfully."
            );

            setShowApplicationForm(false);
        } catch (error) {
            console.error(error);

            setApplicationMessage(
                error.response?.data?.message ||
                "Failed to submit application"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="job-details-loading">
                <div className="loader"></div>
                <p>Loading job details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="job-details-page">
                <div className="job-details-container">
                    <p className="job-error">{error}</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="job-details-page">
                <div className="job-details-container">
                    <p className="job-error">Job not found</p>
                </div>
            </div>
        );
    }

    const deadline = new Date(job.deadline);
    deadline.setHours(23, 59, 59, 999);

    const isExpired = new Date() > deadline;

    return (
        <div className="job-details-page">
            <div className="job-details-container">

                <button
                    className="back-btn"
                    onClick={() => navigate("/jobs")}
                >
                    ← Back to Jobs
                </button>

                <div className="job-details-card">

                    <div className="job-details-header">

                        <div>
                            <span className="job-type">
                                {job.employmentType}
                            </span>

                            <h1>{job.title}</h1>

                            <p className="job-company">
                                {job.company}
                            </p>
                        </div>

                        {isStudent && (
                            isExpired ? (
                                    <button
                                        className="apply-btn deadline-btn"
                                        disabled
                                    >
                                        Application Closed
                                    </button>
                                ) : hasApplied ? (
                                    <button
                                        className="apply-btn deadline-btn"
                                        disabled
                                    >
                                        Already Applied
                                    </button>
                                ) : (
                                    <button
                                        className="apply-btn"
                                        onClick={handleApply}
                                    >
                                        Apply Now
                                    </button>
                                )
                            )}

                    </div>

                    <div className="job-meta">

                        <div className="meta-item">
                            <span>📍</span>
                            <div>
                                <small>Location</small>
                                <strong>{job.location}</strong>
                            </div>
                        </div>

                        <div className="meta-item">
                            <span>💰</span>
                            <div>
                                <small>Salary</small>
                                <strong>
                                    {job.salary
                                        ? `₹${job.salary}`
                                        : "Not specified"}
                                </strong>
                            </div>
                        </div>

                        <div className="meta-item">
                            <span>🧑‍💻</span>
                            <div>
                                <small>Experience</small>
                                <strong>
                                    {job.experience || "Fresher"}
                                </strong>
                            </div>
                        </div>

                        <div className="meta-item">
                            <span>📅</span>
                            <div>
                                <small>Deadline</small>
                                <strong>
                                    {deadline.toLocaleDateString()}
                                </strong>
                            </div>
                        </div>

                    </div>

                    <div className="job-content">

                        <section>
                            <h2>Description</h2>

                            <p>
                                {job.description}
                            </p>
                        </section>

                        <section>
                            <h2>Required Skills</h2>

                            <div className="skills-list">
                                {job.skills?.map((skill) => (
                                    <span key={skill}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2>Application Deadline</h2>

                            <p>
                                {deadline.toLocaleDateString()}
                            </p>

                            {isExpired && (
                                <span className="deadline-expired">
                                    Applications closed
                                </span>
                            )}
                        </section>

                        {applicationMessage && (
                            <div className="application-message">
                                {applicationMessage}
                            </div>
                        )}

                        {isStudent && !isExpired && showApplicationForm && (
                            <section className="application-form">

                                <h2>
                                    Apply for this position
                                </h2>

                                <form
                                    onSubmit={handleApplicationSubmit}
                                >

                                    <div className="form-group">

                                        <label>
                                            Resume
                                        </label>

                                        {!changeResume && resume ? (
                                            <div className="resume-box">

                                                <a
                                                    href={resume}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View Saved Resume
                                                </a>

                                                <button
                                                    type="button"
                                                    className="secondary-button"
                                                    onClick={() =>
                                                        setChangeResume(true)
                                                    }
                                                >
                                                    Use Different Resume
                                                </button>

                                            </div>
                                        ) : (
                                            <>
                                                <input
                                                    type="url"
                                                    value={resume}
                                                    onChange={(event) =>
                                                        setResume(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="https://example.com/resume.pdf"
                                                    required
                                                />

                                                {resume && (
                                                    <button
                                                        type="button"
                                                        className="secondary-button"
                                                        onClick={() =>
                                                            setChangeResume(false)
                                                        }
                                                    >
                                                        Use Saved Resume
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {!resume && !changeResume && (
                                            <p className="resume-warning">
                                                No resume found. Please enter a valid resume URL.
                                            </p>
                                        )}

                                    </div>

                                    <div className="form-group">

                                        <label>
                                            Cover Letter
                                        </label>

                                        <textarea
                                            value={coverLetter}
                                            onChange={(event) =>
                                                setCoverLetter(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Write your cover letter..."
                                            rows="6"
                                            maxLength="2000"
                                        />

                                        <small>
                                            {coverLetter.length}/2000
                                        </small>

                                    </div>

                                    <div className="application-form-actions">

                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={() =>
                                                setShowApplicationForm(false)
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="primary-button"
                                            disabled={submitting}
                                        >
                                            {submitting
                                                ? "Submitting..."
                                                : "Submit Application"}
                                        </button>

                                    </div>

                                </form>

                            </section>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;