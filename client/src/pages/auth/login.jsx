import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

function Login() {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {
                const data = await login(
                    email,
                    password
                );

                if (data.user.role === "student") {
                    navigate("/student/dashboard");
                } else if (data.user.role === "recruiter") {
                    navigate("/recruiter/dashboard");
                } else {
                    navigate("/");
                }
            } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to your Job Portal account
                </p>

                <ErrorMessage message={error} />
                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}

                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Register
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Login;