const mongoose = require('mongoose')

const SocialLinkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        // required: true
    },
    socialLinks: [SocialLinkSchema], // Array of SocialLink objects
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    qualifications: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    AreaofInterest: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Profile', ProfileSchema);
