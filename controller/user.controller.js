import User from "../model/user.model.js";
import AppError from "../utils/AppError.js";
import ApiFeatures from "../utils/ApiFeatures.js";

export const getAllUser = async (req, res, next) => {
    try {
        const features = new ApiFeatures(User.find(), req.query)
            .filter()
            .sort()
            .paginate();

        const users = await features.query;

        res.status(200).json({
            success: true,
            count: users.length,
            data: {
                users,
            },
        });
    } catch (error) {
        next(error);
    }
};