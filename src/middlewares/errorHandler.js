export function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }

    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
}
