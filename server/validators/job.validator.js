const { z } = require("zod");

const createJobSchema = z.object({

    title: z
        .string()
        .trim()
        .min(2, "Job title is required"),

    description: z
        .string()
        .trim()
        .min(
            10,
            "Description must contain at least 10 characters"
        ),

    company: z
        .string()
        .trim()
        .min(2, "Company name is required"),

    location: z
        .string()
        .trim()
        .min(2, "Location is required"),

    employmentType: z.enum([
        "Full-time",
        "Part-time",
        "Internship"
    ]),

    salary: z
        .number()
        .nonnegative("Salary cannot be negative")
        .optional(),

    skills: z
        .array(
            z.string()
                .trim()
                .min(1, "Skill cannot be empty")
        )
        .min(
            1,
            "At least one skill is required"
        ),

    experience: z
        .string()
        .trim()
        .optional(),

    deadline: z.coerce.date()

});

const updateJobSchema =
    createJobSchema.partial();

module.exports = {
    createJobSchema,
    updateJobSchema
};