
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        console.log("Authenticated user:", req.user);
        console.log("Allowed roles:", allowedRoles);

        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied",
                userRole: req.user?.role || null,
                allowedRoles
            });
        }

        next();
    };
};

module.exports = authorizeRoles;