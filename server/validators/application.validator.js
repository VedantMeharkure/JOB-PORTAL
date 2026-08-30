const { z } = require("zod");

const applyToJobSchema = z.object({
    jobId: z
        .string()
        .regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid Job ID"
        ),

    resume: z
        .string()
        .min(1, "Resume is required"),

    coverLetter: z
        .string()
        .max(
            2000,
            "Cover letter is too long"
        )
        .optional()
        .or(z.literal(""))
});

const updateApplicationStatusSchema = z.object({
    status: z.enum([
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected"
    ])
});
const scheduleInterviewSchema = z.object({
    date: z
        .string()
        .min(1, "Interview date is required"),

    time: z
        .string()
        .min(1, "Interview time is required"),

    type: z.enum([
        "Online",
        "Offline"
    ]),

    meetingLink: z
        .string()
        .url("Invalid meeting link")
        .optional()
        .or(z.literal("")),

    notes: z
        .string()
        .max(
            2000,
            "Interview notes are too long"
        )
        .optional()
        .or(z.literal(""))
});
module.exports = {
    applyToJobSchema,
    updateApplicationStatusSchema,
    scheduleInterviewSchema
};