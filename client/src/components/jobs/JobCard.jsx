import { useNavigate } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job }) {
    const navigate = useNavigate();

    const isExpired =
        job.deadline &&
        new Date(job.deadline) < new Date();

    const deadlineText = job.deadline
        ? new Date(job.deadline).toLocaleDateString()
        : "Not specified";

    return (
        <article className="job-card">

            <div className="job-card-header">

                <div>
                    <span className="job-card-type">
                        {job.employmentType || "Job"}
                    </span>

                    <h3>
                        {job.title}
                    </h3>

                    <p className="job-card-company">
                        {job.company}
                    </p>
                </div>

                {isExpired && (
                    <span className="job-expired">
                        Expired
                    </span>
                )}

            </div>


            <div className="job-card-meta">

                <span>
                    📍 {job.location || "Remote"}
                </span>

                <span>
                    💰 {job.salary || "Salary not specified"}
                </span>

                <span>
                    🎓 {job.experience || "Fresher"}
                </span>

            </div>


            {job.skills?.length > 0 && (

                <div className="job-card-skills">

                    {job.skills.slice(0, 5).map(
                        (skill, index) => (
                            <span key={index}>
                                {skill}
                            </span>
                        )
                    )}

                    {job.skills.length > 5 && (
                        <span>
                            +{job.skills.length - 5}
                        </span>
                    )}

                </div>

            )}


            <div className="job-card-footer">

                <div className="job-deadline">

                    <small>
                        Application Deadline
                    </small>

                    <strong className={
                        isExpired
                            ? "expired-text"
                            : ""
                    }>
                        {deadlineText}
                    </strong>

                </div>


                <button
                    className="job-view-button"
                    onClick={() =>
                        navigate(`/jobs/${job._id}`)
                    }
                >
                    View Details
                </button>

            </div>

        </article>
    );
}

export default JobCard;