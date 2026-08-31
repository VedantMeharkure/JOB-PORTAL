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
    .trim()
    .url("Resume must be a valid URL")
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
        .trim()
        .max(
            2000,
            "Interview notes are too long"
        )
        .optional()
        .or(z.literal(""))
}).superRefine((data, ctx) => {
    const interviewDateTime = new Date(
        `${data.date}T${data.time}`
    );

    if (Number.isNaN(interviewDateTime.getTime())) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid interview date or time",
            path: ["date"]
        });

        return;
    }

    if (interviewDateTime <= new Date()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Interview must be scheduled in the future",
            path: ["date"]
        });
    }

    if (
        data.type === "Online" &&
        !data.meetingLink
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
                "Meeting link is required for online interviews",
            path: ["meetingLink"]
        });
    }
});
module.exports = {
    applyToJobSchema,
    updateApplicationStatusSchema,
    scheduleInterviewSchema
};