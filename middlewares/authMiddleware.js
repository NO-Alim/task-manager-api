// @ts-nocheck
import User from "../model/user.model.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
    let token;

    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {

        return next(new AppError('You are not logged in! Please log in to get access', 401))
    }
    try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'helloWorld');

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }
        req.user = currentUser;
    next();
        
    } catch (error) {
        next(error);
    }
}

export default protectRoute;