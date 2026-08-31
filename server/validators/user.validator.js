const { z } = require("zod");

const updateProfileSchema = z.object({

    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters"),

    phone: z
        .string()
        .trim()
        .regex(
            /^[0-9+\-\s()]{7,20}$/,
            "Invalid phone number"
        )
        .optional()
        .or(z.literal("")),

    skills: z
    .array(
        z.string()
            .trim()
            .min(1, "Skill cannot be empty")
            .max(50, "Skill name is too long")
    )
    .max(
        20,
        "Maximum 20 skills are allowed"
    )
    .optional(),

    education: z
        .string()
        .trim()
        .max(
            500,
            "Education information is too long"
        )
        .optional()
});

module.exports = {
    updateProfileSchema
};