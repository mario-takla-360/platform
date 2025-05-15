const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'please provide your full name'],
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        lowercase: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide a valid email'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^0\d{10}$/, 'Please provide a valid phone number'],
        unique: true,
        // validate: {
        //     validator: async function (value) {
        //         const existingUser = await this.constructor.findOne({ phoneNumber: value });
        //         return !existingUser;
        //     },
        //     message: `Phone number already in use. Contact admin if you haven't used it before.`
        // }
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 6
    }
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// userSchema.methods.createJWT = function () {
//     return jwt.sign(
//         { userId: this._id, firstName: this.firstName },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_LIFETIME })
// }

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', userSchema)