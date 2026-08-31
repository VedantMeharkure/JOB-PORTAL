const User = require("../models/user");
const cloudinary = require("../config/cloudinary");
function isPdfFile(buffer) {
    if (!buffer || buffer.length < 5) {
        return false;
    }

    return buffer
        .subarray(0, 5)
        .toString("ascii") === "%PDF-";
}
async function getMyProfile(req, res) {

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
}
async function updateMyProfile(req, res) {

    const {
        name,
        phone,
        skills,
        education
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.name =
        name ?? user.name;

    user.phone =
        phone ?? user.phone;

    user.skills =
        skills ?? user.skills;

    user.education =
        education ?? user.education;

    await user.save();

    return res.status(200).json({
        message: "Profile updated successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            resume: user.resume,
            skills: user.skills,
            education: user.education
        }
    });
}


async function uploadResume(req, res) {

    if (!req.file) {
        return res.status(400).json({
            message: "Please upload a PDF resume"
        });
    }
if (!isPdfFile(req.file.buffer)) {
    return res.status(400).json({
        message: "The uploaded file is not a valid PDF"
    });
}
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const result = await new Promise((resolve, reject) => {

        const stream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "job-portal/resumes",
                    resource_type: "raw"
                },
                (error, result) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

        stream.end(req.file.buffer);
    });

    user.resume = result.secure_url;

    await user.save();

    return res.status(200).json({
        message: "Resume uploaded successfully",
        resume: user.resume
    });
}


module.exports = {
    getMyProfile,
    updateMyProfile,
    uploadResume
};