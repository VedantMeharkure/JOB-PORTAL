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

router.get(
    "/",
    asyncHandler(getAllJobs)
);

router.get(
    "/my",
    authMiddleware,
    authorizeRoles("recruiter"),
    asyncHandler(getMyJobs)
);

router.get(
    "/:id",
    asyncHandler(getJobById)
);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("recruiter"),
    validate(createJobSchema),
    asyncHandler(createJob)
);

router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("recruiter"),
    validate(updateJobSchema),
    asyncHandler(updateJob)
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("recruiter"),
    asyncHandler(deleteJob)
);

module.exports = router;