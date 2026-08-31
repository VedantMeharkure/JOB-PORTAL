import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function PostJob() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        company: "",
        location: "",
        employmentType: "Internship",
        salary: "",
        skills: "",
        experience: "",
        deadline: ""
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const deadline = new Date(formData.deadline);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    if (deadline < today) {
        setError("Deadline must be today or in the future");
        return;
    }
    setLoading(true);
    try {
        const payload = {
        title: formData.title.trim(),
            description: formData.description.trim(),
            company: formData.company.trim(),
            location: formData.location.trim(),
            employmentType: formData.employmentType,
            salary: formData.salary
                ? Number(formData.salary)
                : undefined,
            skills: [
                ...new Set(
                    formData.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean)
                )
            ],
            experience: formData.experience.trim(),
            deadline: formData.deadline
        };
        await api.post("/jobs",payload);
        navigate("/recruiter/dashboard");
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to create job"
        );
    } finally {

        setLoading(false);
    }
};
    return (
        <div>
            <h1>Post a Job</h1>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Job title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Job description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />
                <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                >
                    <option value="Internship">
                        Internship
                    </option>

                    <option value="Full-time">
                        Full-time
                    </option>

                    <option value="Part-time">
                        Part-time
                    </option>
                </select>
                <input
                    type="number"
                    name="salary"
                    placeholder="Salary"
                    value={formData.salary}
                    onChange={handleChange}
                    min="0"
                />
                <input
                    type="text"
                    name="skills"
                    placeholder="Skills (React, Node.js, MongoDB)"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="experience"
                    placeholder="Experience (e.g. Fresher)"
                    value={formData.experience}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Posting..." : "Post Job"}
                </button>
            </form>
            <button onClick={() => navigate("/recruiter/dashboard")}>
                Back to Dashboard
            </button>
        </div>
    );
}

export default PostJob;