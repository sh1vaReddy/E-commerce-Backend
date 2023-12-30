const ErrorHAndlers = require("../utils/errorhandlers");
const catchAsyc = require("./catchAsyc");
const jwt=require("jsonwebtoken")
const User=require('../Models/usermodel');

exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHAndlers("Please Login to access the product", 401));
    }

    try {
        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Successful login");
        
        // Assuming you have a User model and it's properly imported
        const user = await User.findById(decodeData.id);
        if (!user) {
            return next(new ErrorHAndlers("User not found", 404));
        }
        req.user = user;

        next();
    } catch (error) {
        return next(new e("Invalid token", 401));
    }
};
 exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHAndlers(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        }

        next();
    };
};








