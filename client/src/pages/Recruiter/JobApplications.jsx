import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./JobApplications.css";
import StatusBadge from "../../components/jobs/StatusBadge";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

function JobApplications() {

    const { jobId } = useParams();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showInterviewForm, setShowInterviewForm] = useState(null);

    const [interviewData, setInterviewData] = useState({
        date: "",
        time: "",
        type: "Online",
        meetingLink: "",
        notes: ""
    });


    const fetchApplications = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/application/job/${jobId}`
            );

            setApplications(
                response.data.applications
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


    useEffect(() => {

        fetchApplications();

    }, [jobId]);


    const handleStatusChange = async (
        applicationId,
        status
    ) => {

        try {

            setError("");

            const response = await api.patch(
                `/application/${applicationId}/status`,
                {
                    status
                }
            );

            setApplications((previousApplications) =>
                previousApplications.map(
                    (application) =>
                        application._id === applicationId
                            ? {
                                ...application,
                                status:
                                    response.data.application.status
                            }
                            : application
                )
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update application status"
            );
        }
    };


    const handleOpenInterviewForm = (applicationId) => {

        setShowInterviewForm(applicationId);

        setInterviewData({
            date: "",
            time: "",
            type: "Online",
            meetingLink: "",
            notes: ""
        });
    };


    const handleScheduleInterview = async (
        event,
        applicationId
    ) => {

        event.preventDefault();

        try {

            setError("");

            const response = await api.patch(
                `/application/${applicationId}/interview`,
                interviewData
            );

            setApplications((previousApplications) =>
                previousApplications.map(
                    (application) =>
                        application._id === applicationId
                            ? response.data.application
                            : application
                )
            );

            setShowInterviewForm(null);

            setInterviewData({
                date: "",
                time: "",
                type: "Online",
                meetingLink: "",
                notes: ""
            });

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to schedule interview"
            );
        }
    };


    if (loading) {

        return (
            <Loading
                message="Loading applications..."
            />
        );
    }


    return (
        <div className="applications-page">

            <div className="page-header">

                <div>

                    <p className="dashboard-label">
                        RECRUITER
                    </p>

                    <h1>
                        Job Applications
                    </h1>

                    <p>
                        Review candidates and manage their
                        application status.
                    </p>

                </div>

                <button
                    className="secondary-button"
                    onClick={() =>
                        navigate("/recruiter/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>


            <ErrorMessage message={error} />


            <div className="applications-summary">

                <span>
                    Total Applications
                </span>

                <strong>
                    {applications.length}
                </strong>

            </div>


            {applications.length === 0 ? (

                <EmptyState
                    title="No applications yet"
                    message="You haven't received any applications for this job."
                />

            ) : (

                <div>

                    {applications.map((application) => (

                        <div
                            className="application-card"
                            key={application._id}
                        >

                            <div className="application-header">

                                <div>

                                    <h3>
                                        {application.student?.name ||
                                            "Unknown Student"}
                                    </h3>

                                    <p>
                                        {application.student?.email ||
                                            "No email available"}
                                    </p>

                                </div>


                                <StatusBadge
                                    status={application.status}
                                />

                            </div>


                            <div className="application-content">

                                <div>

                                    <strong>
                                        Cover Letter
                                    </strong>

                                    <p>
                                        {application.coverLetter ||
                                            "No cover letter provided"}
                                    </p>

                                </div>


                                <div>

                                    <strong>
                                        Resume
                                    </strong>

                                    {application.resume ? (

                                        <p>

                                            <a
                                                href={application.resume}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View Resume
                                            </a>

                                        </p>

                                    ) : (

                                        <p>
                                            No resume available
                                        </p>

                                    )}

                                </div>

                            </div>


                            <div className="application-actions">

                                <select
                                    value={application.status}
                                    onChange={(event) =>
                                        handleStatusChange(
                                            application._id,
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="Applied">
                                        Applied
                                    </option>

                                    <option value="Shortlisted">
                                        Shortlisted
                                    </option>

                                    <option value="Interview">
                                        Interview
                                    </option>

                                    <option value="Selected">
                                        Selected
                                    </option>

                                    <option value="Rejected">
                                        Rejected
                                    </option>

                                </select>


                                {application.status === "Shortlisted" && (

                                    <button
                                        onClick={() =>
                                            handleOpenInterviewForm(
                                                application._id
                                            )
                                        }
                                    >
                                        Schedule Interview
                                    </button>

                                )}

                            </div>


                            {showInterviewForm === application._id && (

                                <form
                                    className="interview-form"
                                    onSubmit={(event) =>
                                        handleScheduleInterview(
                                            event,
                                            application._id
                                        )
                                    }
                                >

                                    <h3>
                                        Schedule Interview
                                    </h3>


                                    <div className="form-group">

                                        <label>
                                            Date
                                        </label>

                                        <input
                                            type="date"
                                            value={
                                                interviewData.date
                                            }
                                            onChange={(event) =>
                                                setInterviewData({
                                                    ...interviewData,
                                                    date: event.target.value
                                                })
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Time
                                        </label>

                                        <input
                                            type="time"
                                            value={
                                                interviewData.time
                                            }
                                            onChange={(event) =>
                                                setInterviewData({
                                                    ...interviewData,
                                                    time: event.target.value
                                                })
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Interview Type
                                        </label>

                                        <select
                                            value={
                                                interviewData.type
                                            }
                                            onChange={(event) =>
                                                setInterviewData({
                                                    ...interviewData,
                                                    type: event.target.value
                                                })
                                            }
                                        >

                                            <option value="Online">
                                                Online
                                            </option>

                                            <option value="Offline">
                                                Offline
                                            </option>

                                        </select>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Meeting Link
                                        </label>

                                        <input
                                            type="url"
                                            value={
                                                interviewData.meetingLink
                                            }
                                            onChange={(event) =>
                                                setInterviewData({
                                                    ...interviewData,
                                                    meetingLink:
                                                        event.target.value
                                                })
                                            }
                                            placeholder="https://meet.google.com/..."
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Notes
                                        </label>

                                        <textarea
                                            value={
                                                interviewData.notes
                                            }
                                            onChange={(event) =>
                                                setInterviewData({
                                                    ...interviewData,
                                                    notes: event.target.value
                                                })
                                            }
                                            placeholder="Interview instructions..."
                                        />

                                    </div>


                                    <div className="interview-actions">

                                        <button type="submit">
                                            Schedule Interview
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowInterviewForm(null)
                                            }
                                            className="secondary-button"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </form>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default JobApplications;