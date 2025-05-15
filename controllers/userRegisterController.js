const User = require('../models/userModel')
const { StatusCodes } = require('http-status-codes')


const register = async (req, res) => {
    try {
        // Create user
        const user = await User.create(req.body);

        // Send response with selected fields
        res.status(StatusCodes.CREATED).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber
            },
        });
    } catch (error) {
        // Handle MongoDB unique constraint error (duplicate fullname, email or phone)
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0]; // Detect which field caused the error
            return res.status(StatusCodes.CONFLICT).json({
                error: `This ${duplicateField} is already registered. Please use another one. or contact admin if you haven't used it before.`,
            });
        }

        // Handle unexpected errors
        console.error("Registration Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "An error occurred during registration. Please try again later."
        });
    }
};

module.exports = register