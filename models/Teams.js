const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    peoples:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }],
});
module.exports = mongoose.model('Team', teamSchema);
