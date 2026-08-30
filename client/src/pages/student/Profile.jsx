import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import api from "../../services/api";

function Profile() {

    const { user, loading: authLoading } =
        useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        resume: "",
        skills: "",
        education: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    useEffect(() => {

        if (!user || user.role !== "student") {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {

            try {

                const response =
                    await api.get("/users/me");

                const profile = response.data.user;

                setFormData({
                    name: profile.name || "",
                    phone: profile.phone || "",
                    resume: profile.resume || "",
                    skills: profile.skills?.join(", ") || "",
                    education: profile.education || ""
                });

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchProfile();

    }, [user]);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    const handleResumeChange = (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (file.type !== "application/pdf") {

            setError("Only PDF files are allowed");
            setResumeFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {

            setError("Resume must be smaller than 5 MB");
            setResumeFile(null);
            return;
        }

        setError("");
        setResumeFile(file);
    };


    const handleResumeUpload = async () => {

        if (!resumeFile) {

            setError("Please select a resume first");
            return;
        }

        setError("");
        setMessage("");
        setUploadingResume(true);

        try {

            const uploadData = new FormData();

            uploadData.append(
                "resume",
                resumeFile
            );

            const response = await api.post(
                "/users/resume",
                uploadData
            );

            setFormData((previous) => ({
                ...previous,
                resume: response.data.resume
            }));

            setResumeFile(null);

            setMessage(
                response.data.message
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to upload resume"
            );

        } finally {

            setUploadingResume(false);
        }
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setSaving(true);

        try {

            const response = await api.put(
                "/users/me",
                {
                    name: formData.name,
                    phone: formData.phone,
                    resume: formData.resume,

                    skills: formData.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean),

                    education: formData.education
                }
            );

            setMessage(
                response.data.message
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);
        }
    };


    if (authLoading) {

        return (
            <Loading
                message="Checking authentication..."
            />
        );
    }


    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    if (user.role !== "student") {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }


    if (loading) {

        return (
            <Loading
                message="Loading profile..."
            />
        );
    }


    return (
        <div className="profile-page">

            <div className="page-header">

                <div>

                    <p className="dashboard-label">
                        STUDENT PROFILE
                    </p>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Keep your personal information,
                        skills and resume up to date.
                    </p>

                </div>

            </div>


            <ErrorMessage message={error} />


            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            <div className="profile-layout">

                <form
                    className="profile-card"
                    onSubmit={handleSubmit}
                >

                    <div className="profile-section">

                        <h2>
                            Personal Information
                        </h2>

                        <div className="form-group">

                            <label>
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={user.email}
                                disabled
                            />

                            <small>
                                Email cannot be changed here.
                            </small>

                        </div>


                        <div className="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />

                        </div>

                    </div>


                    <div className="profile-section">

                        <h2>
                            Professional Information
                        </h2>

                        <div className="form-group">

                            <label>
                                Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB"
                            />

                            <small>
                                Separate skills with commas.
                            </small>

                        </div>


                        <div className="form-group">

                            <label>
                                Education
                            </label>

                            <textarea
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                placeholder="B.Tech in ECE"
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="primary-button profile-save-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Profile"}
                    </button>

                </form>


                <div className="profile-card resume-card">

                    <div className="profile-section">

                        <h2>
                            Resume
                        </h2>

                        <p className="profile-muted">
                            Upload your latest resume as a PDF.
                        </p>


                        {formData.resume && (

                            <div className="current-resume">

                                <span>
                                    Current Resume
                                </span>

                                <a
                                    href={formData.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View Resume
                                </a>

                            </div>

                        )}


                        <div className="resume-upload">

                            <label>
                                Choose PDF
                            </label>

                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleResumeChange}
                            />

                            {resumeFile && (
                                <p className="selected-file">
                                    Selected:{" "}
                                    {resumeFile.name}
                                </p>
                            )}

                            <button
                                type="button"
                                className="primary-button"
                                onClick={handleResumeUpload}
                                disabled={
                                    !resumeFile ||
                                    uploadingResume
                                }
                            >
                                {uploadingResume
                                    ? "Uploading..."
                                    : "Upload Resume"}
                            </button>

                            <small>
                                PDF only, maximum 5 MB.
                            </small>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;