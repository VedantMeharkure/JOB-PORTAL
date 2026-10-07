
const { Router } = require("express");
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
} = require("../controllers/job.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const asyncHandler = require("../utils/asynchandler");

const {
    createJobSchema,
    updateJobSchema
} = require("../validators/job.validator");

const router = Router();

// Get all jobs
router.get(
    "/",
    asyncHandler(getAllJobs)
);

// Get jobs created by logged-in recruiter
router.get(
    "/my",
    authMiddleware,
    authorizeRoles("recruiter"),
    asyncHandler(getMyJobs)
);

// Get single job
router.get(
    "/:id",
    asyncHandler(getJobById)
);

// Create job
router.post(
    "/",
    authMiddleware,
    authorizeRoles("recruiter"),
    validate(createJobSchema),
    asyncHandler(createJob)
);

// Update job
router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("recruiter"),
    validate(updateJobSchema),
    asyncHandler(updateJob)
);

// Delete job
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("recruiter"),
    asyncHandler(deleteJob)
);

module.exports = router;