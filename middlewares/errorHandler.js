import AppError from "../utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;
  // mongoose error
  if (error.name === "CastError") {
    const message = `Invalid ${error.path}: ${error.value}.`;
    error = new AppError(message, 400);
  }

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    error = new AppError(message, 400);
  }

  if (error.code === 11000) {
    const value = error.keyValue ? Object.values(error.keyValue)[0] : "unknown";
    const message = `Duplicate field value: ${value}. Please use another value!`;
    error = new AppError(message, 400);
  }

  // Operational error
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // For programming errors or unhandled errors
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
      error: error,
    });
  } else {
    // In production, don't leak internal error details
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export default errorHandler;
