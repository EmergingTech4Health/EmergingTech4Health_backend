const mongoose= require('mongoose');

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
    
});
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
        type: String,
        // required: true
     
    }],
    
    videoUrls:[
        VideoSchema
    ],
})

module.exports = mongoose.model('SubPost', subPostSchema);