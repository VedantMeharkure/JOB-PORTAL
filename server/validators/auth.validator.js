const { z }=require("zod");
const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .min(6, "Password must contain at least 6 characters"),

    role: z.enum(
        ["student", "recruiter"],
        "Role must be student or recruiter"
    )
});
const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
    password: z
        .string()
        .min(1, "Password is required")
});
module.exports = {
    registerSchema,
    loginSchema
};