const { Router }=require("express")
const { registerUser, loginUser,logoutUser,getCurrentUser }=require("../controllers/auth.controllers")
const authMiddleware = require("../middlewares/auth.middleware");
const asyncHandler=require("../utils/asynchandler")
const validate=require("../middlewares/validate.middleware");
const {registerSchema,loginSchema} = require("../validators/auth.validator");
const router = Router();
router.get(
    "/me",
    authMiddleware,
    asyncHandler(getCurrentUser)
);
router.post("/register",validate(registerSchema),asyncHandler(registerUser));
router.post("/login",validate(loginSchema),asyncHandler(loginUser));
router.post("/logout",asyncHandler(logoutUser));
module.exports = router;