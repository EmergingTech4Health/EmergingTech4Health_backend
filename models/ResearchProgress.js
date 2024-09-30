const mongoose = require('mongoose');

const ResearchProgressSchema = new mongoose.Schema({
description:{
    type:String,
    required:true
},
imageUrls:[{
    type: String,
    // required: true
 
}],
contributors:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Profile'
}],
});

module.exports = mongoose.model('ResearchProgress', ResearchProgressSchema);