const mongoose = require('mongoose')
const frontPageSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
   pic:{
         type: String,
         required: true
   },
   link:{
        type: String,
        required: true
   }
});
module.exports = mongoose.model('FrontPage', frontPageSchema);