const { z } = require("zod");

const createJobSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Job title is required")
        .max(100, "Job title is too long"),

    description: z
        .string()
        .trim()
        .min(
            10,
            "Description must contain at least 10 characters"
        )
        .max(
            5000,
            "Description is too long"
        ),

    company: z
        .string()
        .trim()
        .min(2, "Company name is required")
        .max(100, "Company name is too long"),

    location: z
        .string()
        .trim()
        .min(2, "Location is required")
        .max(100, "Location is too long"),

    employmentType: z.enum([
        "Full-time",
        "Part-time",
        "Internship"
    ]),

    salary: z
        .number()
        .finite("Salary must be a valid number")
        .nonnegative("Salary cannot be negative")
        .optional(),

    skills: z
        .array(
            z
                .string()
                .trim()
                .min(1, "Skill cannot be empty")
                .max(50, "Skill name is too long")
        )
        .min(
            1,
            "At least one skill is required"
        )
        .max(
            20,
            "Maximum 20 skills are allowed"
        ),

    experience: z
        .string()
        .trim()
        .max(
            100,
            "Experience information is too long"
        )
        .optional(),

    deadline: z.coerce
        .date()
        .refine(
            (date) => {
                const deadline = new Date(date);
                deadline.setHours(23, 59, 59, 999);

                return deadline >= new Date();
            },
            {
                message:
                    "Deadline must be today or in the future"
            }
        )
});

const updateJobSchema =
    createJobSchema.partial();

module.exports = {
    createJobSchema,
    updateJobSchema
};