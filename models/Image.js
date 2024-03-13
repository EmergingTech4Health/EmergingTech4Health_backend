const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    imageDesc:{
        type: String,
        required: true
    },
    
    imageUrl:{
        type: String,
        required: true
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
});
module.exports = mongoose.model('Image', ImageSchema);