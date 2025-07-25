import AppError from "../utils/AppError.js"

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        
        if (!req.user || !req.user.role) {
            return next(new AppError('User role not found in token.', 403));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError(
                `User with role '${req.user.role}' is not authorized to access this route.`,
                403
            ));
        }
        next();
    }
}

export default authorizeRole;