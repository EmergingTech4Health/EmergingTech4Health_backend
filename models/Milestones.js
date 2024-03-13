const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    dueDate: {
        type:Date, 
        required:true,
        default:Date.now()
    },
    status:{
        type:String,
        required:true
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }

})
module.exports= mongoose.model("Milestone", MilestoneSchema);