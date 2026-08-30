const Job = require("../models/job");
const mongoose = require("mongoose");

async function getMyJobs(req, res) {

    const jobs = await Job.find({
        recruiter: req.user.id
    }).sort({
        createdAt: -1
    });

    return res.status(200).json({
        count: jobs.length,
        jobs
    });
}


async function createJob(req, res) {

    const {
        title,
        description,
        company,
        location,
        employmentType,
        salary,
        skills,
        experience,
        deadline
    } = req.body;

    const job = await Job.create({
        title,
        description,
        company,
        location,
        employmentType,
        salary,
        skills,
        experience,
        deadline,
        recruiter: req.user.id
    });

    return res.status(201).json({
        message: "Job created successfully",
        job
    });
}


async function getAllJobs(req, res) {

    const {
        search,
        location,
        employmentType,
        skills,
        page = 1,
        limit = 10
    } = req.query;

    const query = {};


    if (search) {

        query.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                company: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }


    if (location) {

        query.location = {
            $regex: location,
            $options: "i"
        };
    }


    if (employmentType) {

        query.employmentType = employmentType;
    }


    if (skills) {

        const skillArray = skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);

        if (skillArray.length > 0) {

            query.skills = {
                $in: skillArray
            };
        }
    }


    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);


    const pageNumber = Number.isNaN(parsedPage)
        ? 1
        : Math.max(parsedPage, 1);


    const limitNumber = Number.isNaN(parsedLimit)
        ? 10
        : Math.min(
            Math.max(parsedLimit, 1),
            50
        );


    const skip =
        (pageNumber - 1) * limitNumber;


    const jobs = await Job.find(query)
        .populate(
            "recruiter",
            "name email"
        )
        .sort({
            createdAt: -1
        })
        .skip(skip)
        .limit(limitNumber);


    const totalJobs =
        await Job.countDocuments(query);


    return res.status(200).json({
        count: jobs.length,
        totalJobs,
        currentPage: pageNumber,
        totalPages: Math.ceil(
            totalJobs / limitNumber
        ),
        jobs
    });
}


async function getJobById(req, res) {

    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).json({
            message: "Invalid Job Id"
        });
    }


    const job = await Job.findById(id)
        .populate(
            "recruiter",
            "name email"
        );


    if (!job) {

        return res.status(404).json({
            message: "Job not found"
        });
    }


    return res.status(200).json({
        job
    });
}


async function updateJob(req, res) {

    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).json({
            message: "Invalid Job Id"
        });
    }


    const job = await Job.findById(id);


    if (!job) {

        return res.status(404).json({
            message: "Job not found"
        });
    }


    if (job.recruiter.toString() !== req.user.id) {

        return res.status(403).json({
            message: "You can only update your own job"
        });
    }


    const {
        title,
        description,
        company,
        location,
        employmentType,
        salary,
        skills,
        experience,
        deadline
    } = req.body;


    job.title =
        title ?? job.title;

    job.description =
        description ?? job.description;

    job.company =
        company ?? job.company;

    job.location =
        location ?? job.location;

    job.employmentType =
        employmentType ?? job.employmentType;

    job.salary =
        salary ?? job.salary;

    job.skills =
        skills ?? job.skills;

    job.experience =
        experience ?? job.experience;

    job.deadline =
        deadline ?? job.deadline;


    await job.save();


    return res.status(200).json({
        message: "Job updated successfully",
        job
    });
}


async function deleteJob(req, res) {

    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).json({
            message: "Invalid Job Id"
        });
    }


    const job = await Job.findById(id);


    if (!job) {

        return res.status(404).json({
            message: "Job not found"
        });
    }


    if (job.recruiter.toString() !== req.user.id) {

        return res.status(403).json({
            message: "You can only delete your own job"
        });
    }


    await Job.findByIdAndDelete(id);


    return res.status(200).json({
        message: "Job deleted successfully"
    });
}


module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
};