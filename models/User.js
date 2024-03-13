const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    userType:{
        type: String,
        required: true,
        enum:["Admin", "SuperAdmin"],
    },
    approved: {
        type: Boolean,
        default: true,
      },
      token: {
        type: String,
      },
      resetPasswordExpires: {
        type: Date,
      },
})
module.exports = mongoose.model('User', UserSchema);