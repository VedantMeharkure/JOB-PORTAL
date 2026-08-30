import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/login";
import Register from "../pages/auth/Register";

import Jobs from "../pages/jobs/Jobs";
import JobDetails from "../pages/jobs/JobDetails";

import StudentDashboard from "../pages/student/StudentDashboard";
import MyApplications from "../pages/student/MyApplications";
import Profile from "../pages/student/Profile";

import RecruiterDashboard from "../pages/Recruiter/RecruiterDashboard";
import PostJob from "../pages/Recruiter/PostJob";
import EditJob from "../pages/Recruiter/EditJob";
import JobApplications from "../pages/Recruiter/JobApplications";

import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

            {/* Public Routes */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/jobs"
                element={<Jobs />}
            />

            <Route
                path="/jobs/:id"
                element={<JobDetails />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />


            {/* Student Routes */}

            <Route
                path="/student/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/applications"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <MyApplications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/profile"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <Profile />
                    </ProtectedRoute>
                }
            />


            {/* Recruiter Routes */}

            <Route
                path="/recruiter/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                        <RecruiterDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/jobs/new"
                element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                        <PostJob />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/jobs/edit/:id"
                element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                        <EditJob />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/jobs/:jobId/applications"
                element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                        <JobApplications />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default AppRoutes;