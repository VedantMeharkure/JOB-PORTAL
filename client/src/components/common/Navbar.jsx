import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

function Navbar() {

    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);


    const handleLogout = async () => {

        try {

            await logout();

            setMenuOpen(false);

            navigate("/login");

        } catch (error) {

            console.error(error);
        }
    };


    const closeMenu = () => {
        setMenuOpen(false);
    };


    return (
        <header className="navbar">

            <div className="navbar-container">

                <Link
                    to="/"
                    className="navbar-brand"
                    onClick={closeMenu}
                >
                    Job<span>Portal</span>
                </Link>


                <button
                    className="menu-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? "×" : "☰"}
                </button>
                <nav
                    className={`navbar-links ${
                        menuOpen ? "open" : ""
                    }`}
                >

                    <Link
                        to="/"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>

                    <Link
                        to="/jobs"
                        onClick={closeMenu}
                    >
                        Jobs
                    </Link>


                    {user?.role === "student" && (
                        <>
                            <Link
                                to="/student/dashboard"
                                onClick={closeMenu}
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/student/applications"
                                onClick={closeMenu}
                            >
                                Applications
                            </Link>

                            <Link
                                to="/student/profile"
                                onClick={closeMenu}
                            >
                                Profile
                            </Link>
                        </>
                    )}


                    {user?.role === "recruiter" && (
                        <Link
                            to="/recruiter/dashboard"
                            onClick={closeMenu}
                        >
                            Dashboard
                        </Link>
                    )}


                    {!user && (
                        <div className="navbar-auth">

                            <Link
                                to="/login"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="navbar-register"
                                onClick={closeMenu}
                            >
                                Get Started
                            </Link>

                        </div>
                    )}


                    {user && (
                        <div className="navbar-user">

                            <span className="navbar-username">
                                {user.name}
                            </span>

                            <button
                                className="navbar-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>
                    )}

                </nav>

            </div>

        </header>
    );
}

export default Navbar;