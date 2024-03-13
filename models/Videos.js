const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type:String, 
        required:true
    
    },
    videoUrl:{
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
module.exports = mongoose.model('Video', VideoSchema);