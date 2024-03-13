const mongoose= require('mongoose');

const subPostSchema = new mongoose.Schema({
    sectionName:{
        type:String,
        required:true
    },
    subSectionContent:{
        type:String,
        required:true
    },
    imageUrls:[{
        type: mongoose.Schema.Types.ObjectId,
        // required: true
        ref:'Image'
    }],
    
    videoUrls:[{
        type: mongoose.Schema.Types.ObjectId,
        // required: true
        ref:'Video'
    }],
})

module.exports = mongoose.model('SubPost', subPostSchema);