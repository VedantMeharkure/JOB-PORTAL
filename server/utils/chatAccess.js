const mongoose = require('mongoose');
const Application=require("../models/application");
const Job=require("../models/job");
const CHAT_ENABLED_STATUSES=["Shortlisted","Interview","Selected"];
async function getChatAccess(applicationId,userId)
{
    if(
        !mongoose.Types.ObjectId.isValid(
            applicationId
        )
    )
    {
        return {
            allowed:false,
            status:400,
            message:"Invalid Application ID",
        };
    }
    const application=await Application.findById(applicationId);
    if(!application) 
        {
        return{
            allowed: false,
            status: 404,
            message: "Application not found",
        };
    }
    const isStudent =
    application.student.toString() === String(userId);
    if(!isStudent)
    {
        const job=await Job
            .findById(application.job)
            .select("recruiter");
        if (!job) {
            return {
                allowed: false,
                status: 404,
                message: "Associated job not found"
            };
        }
        const isRecruiter =job.recruiter.toString() === String(userId);
        if (!isRecruiter) {
            return {
                allowed: false,
                status: 403,
                message:
                    "You are not a participant in this application"
            };
        }
    }
    if (
            !CHAT_ENABLED_STATUSES.includes(
                application.status
            )
        ) {
            return{
                allowed: false,
                status: 403,
                message:
                    "Chat is available only after the application is shortlisted"
            };
        }
    return {
    allowed: true,
    application
};
}
module.exports = {
    CHAT_ENABLED_STATUSES,
    getChatAccess
};
