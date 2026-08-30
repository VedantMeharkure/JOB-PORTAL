const express = require("express");

const {
    applyToJob,
    getMyApplication,
    getJobApplications,
    updateApplicationStatus,
    scheduleInterview
} = require("../controllers/application.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const asyncHandler = require("../utils/asynchandler");

const {
    applyToJobSchema,
    updateApplicationStatusSchema,
    scheduleInterviewSchema
} = require("../validators/application.validator");

const router = express.Router();

router.get(
    "/my",
    authMiddleware,
    authorizeRoles("student"),
    asyncHandler(getMyApplication)
);

router.get(
    "/job/:jobId",
    authMiddleware,
    authorizeRoles("recruiter"),
    asyncHandler(getJobApplications)
);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("student"),
    validate(applyToJobSchema),
    asyncHandler(applyToJob)
);

router.patch(
    "/:id/status",
    authMiddleware,
    authorizeRoles("recruiter"),
    validate(updateApplicationStatusSchema),
    asyncHandler(updateApplicationStatus)
);

router.patch(
    "/:id/interview",
    authMiddleware,
    authorizeRoles("recruiter"),
    validate(scheduleInterviewSchema),
    asyncHandler(scheduleInterview)
);

module.exports = router;