const express = require("express");
const {getMessages} = require("../controllers/message.controller");
const authMiddleware =require("../middlewares/auth.middleware");
const authorizeRoles =require("../middlewares/role.middleware");
const asyncHandler =require("../utils/asynchandler");
const router = express.Router();
router.get(
    "/:applicationId",
    authMiddleware,
    authorizeRoles(
        "student",
        "recruiter"
    ),
    asyncHandler(getMessages)
);
module.exports = router;