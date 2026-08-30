import { useNavigate } from "react-router-dom";

function JobCard({ job }) {

    const navigate = useNavigate();

    return (
        <article className="job-card">

            <div className="job-card-header">

                <div>
                    <p className="job-company">
                        {job.company}
                    </p>

                    <h2>
                        {job.title}
                    </h2>
                </div>

                <span className="job-type-badge">
                    {job.employmentType}
                </span>

            </div>


            <div className="job-card-meta">

                <span>
                    📍 {job.location}
                </span>

                {job.experience && (
                    <span>
                        🧑‍💻 {job.experience}
                    </span>
                )}

                {job.salary && (
                    <span>
                        💰 {job.salary}
                    </span>
                )}

            </div>


            <div className="skills-list">

                {job.skills?.map((skill) => (
                    <span
                        className="skill-badge"
                        key={skill}
                    >
                        {skill}
                    </span>
                ))}

            </div>


            <button
                className="primary-button"
                onClick={() =>
                    navigate(`/jobs/${job._id}`)
                }
            >
                View Details
            </button>

        </article>
    );
}

export default JobCard;