const mongoose = require('mongoose');
const Profile = require('./Profile');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    shortDesc:{
        type: String,
        required: true
    },
    content: {
        type:String, 
        required:true
    },

    // videoUrls:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     // required: true
    //     ref:'Video'
    // }],
    // imageUrls:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     // required: true
    //     ref:'Image'
    // }],
    refrences:[{
        type: String,
        // required: true
    }],
    contributors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile'
    }],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    grant:{
        type:String,
        required:true
    },
    subPost:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubPost'
    }],
    milestones:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Milestone'
    
    }]
    

},
{timestamps:true})

module.exports = mongoose.model('Post', PostSchema);