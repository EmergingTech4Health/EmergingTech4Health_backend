const mongoose = require('mongoose')

const logoSchema = new mongoose.Schema({
    logo:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },

})

module.exports = mongoose.model('Logo', logoSchema);