import { useEffect, useState } from "react";

import JobCard from "../../components/jobs/JobCard";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import { getJobs } from "../../services/jobService";

function Jobs() {

    const [jobs, setJobs] = useState([]);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [skills, setSkills] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchJobs = async (pageNumber = page) => {

        try {

            setLoading(true);
            setError("");

            const data = await getJobs({
                search,
                location,
                employmentType,
                skills,
                page: pageNumber,
                limit: 10
            });

            setJobs(data.jobs);
            setTotalPages(data.totalPages);
            setTotalJobs(data.totalJobs);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load jobs"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchJobs(page);

    }, [page]);


    const handleSearch = (event) => {

        event.preventDefault();

        setPage(1);
        fetchJobs(1);
    };


    const clearFilters = () => {

        setSearch("");
        setLocation("");
        setEmploymentType("");
        setSkills("");

        setPage(1);

        fetchJobs(1);
    };


    return (
        <div className="jobs-page">

            <div className="page-header">

                <div>

                    <p className="dashboard-label">
                        OPPORTUNITIES
                    </p>

                    <h1>
                        Find Jobs & Internships
                    </h1>

                    <p>
                        Search for opportunities that
                        match your skills and interests.
                    </p>

                </div>

            </div>


            <form
                className="job-filters"
                onSubmit={handleSearch}
            >

                <div className="filter-grid">

                    <div className="form-group">

                        <label>
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Job title, company..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. Pune"
                            value={location}
                            onChange={(event) =>
                                setLocation(event.target.value)
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Employment Type
                        </label>

                        <select
                            value={employmentType}
                            onChange={(event) =>
                                setEmploymentType(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                All Types
                            </option>

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


                    <div className="form-group">

                        <label>
                            Skills
                        </label>

                        <input
                            type="text"
                            placeholder="React, Node.js"
                            value={skills}
                            onChange={(event) =>
                                setSkills(event.target.value)
                            }
                        />

                    </div>

                </div>


                <div className="filter-actions">

                    <button type="submit">
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="secondary-button"
                    >
                        Clear Filters
                    </button>

                </div>

            </form>


            <ErrorMessage message={error} />


            {loading ? (

                <Loading message="Finding opportunities..." />

            ) : (

                <>

                    <div className="results-header">

                        <h2>
                            Available Opportunities
                        </h2>

                        <span>
                            {totalJobs} jobs found
                        </span>

                    </div>


                    {jobs.length === 0 ? (

                        <EmptyState
                            title="No jobs found"
                            message="Try changing your search terms or filters."
                        />

                    ) : (

                        <div>

                            {jobs.map((job) => (

                                <JobCard
                                    key={job._id}
                                    job={job}
                                />

                            ))}

                        </div>

                    )}


                    {totalPages > 1 && (

                        <div className="pagination">

                            <button
                                disabled={page === 1}
                                onClick={() =>
                                    setPage(page - 1)
                                }
                            >
                                ← Previous
                            </button>

                            <span>
                                Page {page} of {totalPages}
                            </span>

                            <button
                                disabled={page === totalPages}
                                onClick={() =>
                                    setPage(page + 1)
                                }
                            >
                                Next →
                            </button>

                        </div>

                    )}

                </>

            )}

        </div>
    );
}

export default Jobs;