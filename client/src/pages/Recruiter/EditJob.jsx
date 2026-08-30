import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function EditJob() {
    const { id } = useParams();
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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);
                const job = response.data.job;
                setFormData({
                    title: job.title || "",
                    description: job.description || "",
                    company: job.company || "",
                    location: job.location || "",
                    employmentType: job.employmentType || "Internship",
                    salary: job.salary || "",
                    skills: job.skills?.join(", ") || "",
                    experience: job.experience || "",
                    deadline: job.deadline
                        ? job.deadline.split("T")[0]
                        : ""
                });
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
        setSaving(true);
        try {
            await api.patch(`/jobs/${id}`, {
                ...formData,
                salary: formData.salary
                    ? Number(formData.salary)
                    : undefined,
                skills: formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
            });
            navigate("/recruiter/dashboard");
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Failed to update job"
            );
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return <p>Loading job...</p>;
    }
    if (error && !formData.title) {
        return <p>{error}</p>;
    }
    return (
        <div>

            <h1>Edit Job</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Job Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Company</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Employment Type</label>
                    <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}>
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
                </div>
                <div>
                    <label>Salary</label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        min="0"
                    />
                </div>
                <div>
                    <label>Skills</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Node.js, MongoDB"
                        required
                    />
                </div>
                <div>
                    <label>Experience</label>
                    <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Deadline</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Update Job"}
                </button>

            </form>
            <button
                onClick={() => navigate("/recruiter/dashboard")}
            >
                Cancel
            </button>
        </div>
    );
}

export default EditJob;