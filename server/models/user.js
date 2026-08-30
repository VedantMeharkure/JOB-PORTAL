const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["student", "recruiter", "admin"],
        default: "student",
    },

    phone: {
        type: String,
        default: "",
    },

    resume: {
        type: String,
        default: "",
    },

    skills: {
        type: [String],
        default: [],
    },

    education: {
        type: String,
        default: "",
    }

});

const User = mongoose.model("User", userSchema);

module.exports = User;