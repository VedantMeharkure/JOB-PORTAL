const multer = require("multer");

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                message: "File too large. Maximum size is 5 MB."
            });
        }

        return res.status(400).json({
            message: err.message
        });
    }

    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors)
            .map((error) => error.message);

        return res.status(400).json({
            message: messages.join(", ")
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: `Invalid ${err.path}`
        });
    }

    if (err.name === "MongoServerError" && err.code === 11000) {
        return res.status(409).json({
            message: "A record with these details already exists"
        });
    }

    const statusCode =
        err.statusCode ||
        err.status ||
        500;

    const message =
        statusCode >= 500
            ? "Internal server error"
            : err.message || "Something went wrong";

    return res.status(statusCode).json({
        message
    });
};

module.exports = errorMiddleware;