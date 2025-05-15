const User = require('../models/userModel');
const { StatusCodes } = require('http-status-codes');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request body
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please provide email and password' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' });
        }

        // Check password validity
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' });
        }

        // Send response
        res.status(StatusCodes.OK).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred during login. Please try again.' });
    }
};

module.exports = login