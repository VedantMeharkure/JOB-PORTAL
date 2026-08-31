const mongoose = require("mongoose");
const Application = require("../models/application");
const Job = require("../models/job");
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
async function applyToJob(req, res) {

    const {
        jobId,
        resume,
        coverLetter
    } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }
    const deadline = new Date(job.deadline);
deadline.setHours(23, 59, 59, 999);
    if (new Date() > new Date(deadline)) {
        return res.status(400).json({
            message: "The application deadline for this job has passed"
        });
    }

    const existingApplication =
        await Application.findOne({
            student: req.user.id,
            job: jobId
        });

    if (existingApplication) {
        return res.status(409).json({
            message: "You have already applied for this job"
        });
    }

    const application = await Application.create({
        student: req.user.id,
        job: jobId,
        resume,
        coverLetter
    });

    return res.status(201).json({
        message: "Application submitted successfully",
        application
    });
}


async function getMyApplication(req, res) {

    const applications =
        await Application.find({
            student: req.user.id
        })
        .populate(
            "job",
            "title company location employmentType salary skills experience deadline"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json({
        count: applications.length,
        applications
    });
}


async function getJobApplications(req, res) {
    const { jobId } = req.params;

    if (!isValidObjectId(jobId)) {
        return res.status(400).json({
            message: "Invalid Job ID"
        });
    }

    const job = await Job.findById(jobId);

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    if (job.recruiter.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You can only view applications for your own jobs"
        });
    }

    const applications =
        await Application.find({
            job: jobId
        })
        .populate(
            "student",
            "name email phone skills education"
        )
        .populate(
            "job",
            "title company location employmentType"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json({
        count: applications.length,
        applications
    });
}
const allowedTransitions = {
    Applied: ["Shortlisted", "Rejected"],
    Shortlisted: ["Interview", "Rejected"],
    Interview: ["Selected", "Rejected"],
    Selected: [],
    Rejected: []
};

async function updateApplicationStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid Application ID"
        });
    }

    const allowedStatuses = [
    "Applied",
    "Shortlisted",
    "Interview",
    "Selected",
    "Rejected"
];

if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
        message: "Invalid application status"
    });
}

    const application =
        await Application.findById(id);

    if (!application) {
        return res.status(404).json({
            message: "Application not found"
        });
    }
    const allowedNextStatuses =
        allowedTransitions[application.status] || [];

    if (!allowedNextStatuses.includes(status)) {
        return res.status(400).json({
            message:
                `Cannot change application status from ${application.status} to ${status}`
        });
    }
    const job =
        await Job.findById(application.job);

    if (!job) {
        return res.status(404).json({
            message: "Associated job not found"
        });
    }

    if (job.recruiter.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You can only update applications for your own jobs"
        });
    }

    application.status = status;

    await application.save();

    return res.status(200).json({
        message: "Application status updated successfully",
        application
    });
}

async function scheduleInterview(req, res) {
    const { id } = req.params;
    const {
        date,
        time,
        type,
        meetingLink,
        notes
    } = req.body;

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid Application ID"
        });
    }

    const application =
        await Application.findById(id);

    if (!application) {
        return res.status(404).json({
            message: "Application not found"
        });
    }

    const job =
        await Job.findById(application.job);

    if (!job) {
        return res.status(404).json({
            message: "Associated job not found"
        });
    }

    if (job.recruiter.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You can only schedule interviews for your own jobs"
        });
    }
    if (application.status !== "Shortlisted") {
        return res.status(400).json({
            message: "Interview can only be scheduled for shortlisted applications"
        });
    }

    application.interview = {
        date,
        time,
        type,
        meetingLink,
        notes
    };

    application.status = "Interview";

    await application.save();

    return res.status(200).json({
        message: "Interview scheduled successfully",
        application
    });
}

module.exports = {
    applyToJob,
    getMyApplication,
    getJobApplications,
    updateApplicationStatus,
    scheduleInterview
};