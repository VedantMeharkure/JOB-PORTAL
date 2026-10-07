const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/auth");

async function registerUser(req, res) {
    try {
        const { name, email, password, role } = req.body;

        console.log("REGISTER REQUEST:", {
            name,
            email,
            role
        });

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required"
            });
        }

        // Normalize input
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanRole = role.trim().toLowerCase();

        // Validate role
        if (!["student", "recruiter"].includes(cleanRole)) {
            return res.status(400).json({
                message: "Invalid role. Role must be student or recruiter"
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Check whether user already exists
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            role: cleanRole
        });

        console.log("USER CREATED:", user._id.toString());

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        // Duplicate email protection
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Mongoose validation error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation failed",
                error: error.message
            });
        }

        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
}


async function getCurrentUser(req, res) {
    try {
        const user = await User
            .findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        console.error("GET CURRENT USER ERROR:", error);

        return res.status(500).json({
            message: "Failed to get current user",
            error: error.message
        });
    }
}


async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        // Local development:
        // Frontend: http://localhost:5173
        // Backend:  http://localhost:8000
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
}


async function logoutUser(req, res) {

    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    return res.status(200).json({
        message: "Logout successful"
    });
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
};