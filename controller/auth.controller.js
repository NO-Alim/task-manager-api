// @ts-nocheck
import User from "../model/user.model.js";
import AppError from "../utils/AppError.js";

const registerUser = async (req, res, next) => {
    const {userName, email, password} = req.body;

    try {
        const existingUser = await User.findOne({$or: [{email}, {userName}]});

        if (existingUser) {
            if (existingUser.email === email) {
                return next(new AppError("User with this email already exist", 409));
            }
            if (existingUser.userName === userName) {
                return next(new AppError('User with this username already exist.'))
            }
        }

        const user = await User.create({userName, email, password});

        // generate token
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            data: {
                id: user._id,
                userName: user.userName,
                email: user.email
            }
        })

    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide an email and password', 400));
    }

    try {
        const user = await User.findOne({email}).select('+password')

        if (!user) {
            return next(new AppError('Invalid credentials', 401)); // 401 Unauthorized
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new AppError('Invalid credentials', 401)); // 401 Unauthorized
        }

        const token = user.getSignedJwtToken();

        const cookieOptions = {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' // Only send over HTTPS in production
        };

        res.cookie('jwt', token, cookieOptions);

        // Remove password from output
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: {
                id: user._id,
                userName: user.userName,
                email: user.email
            }
        });
    } catch (error) {
        
        next(error)
    }
}

const logoutUser = (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
        httpOnly: true
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export {registerUser, loginUser, logoutUser}