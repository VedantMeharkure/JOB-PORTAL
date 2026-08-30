const { Router } = require("express");
const validate = require("../middlewares/validate.middleware");

const {
    updateProfileSchema
} = require("../validators/user.validator");
const upload = require("../config/multer");

const {
    getMyProfile,
    updateMyProfile,
    uploadResume
} = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asynchandler");

const router = Router();

router.get(
    "/me",
    authMiddleware,
    asyncHandler(getMyProfile)
);

router.put(
    "/me",
    authMiddleware,
    validate(updateProfileSchema),
    asyncHandler(updateMyProfile)
);

router.post(
    "/resume",
    authMiddleware,
    upload.single("resume"),
    asyncHandler(uploadResume)
);

module.exports = router;