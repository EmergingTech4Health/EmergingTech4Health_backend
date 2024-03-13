// create milestone
exports.createMilestone = async (req, res) => {
    try {
        const {postId , title, description, dueDate, status} = req.body;
        if(!postId || !title || !description || !dueDate || !status){
            return res.status(400).json({error: "All fields are required"});
        }
        const milestone = await Milestone.create({
           
            title,
            description,
            dueDate,
            status
        });
        const updatedPost = await Post.findByIdAndUpdate({_id : postId}, {
            $push:{milestones: milestone._id}
        }, {
            new: true
        }).populate('milestones');
        return res.status(200).json({
            success: true,
            milestone, updatedPost,
            message: "Milestone created successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
          })
    }
}

// update milestone
exports.updateMilestone = async (req, res) => {
    try {
        const {postId, milestoneId, title, description, dueDate, status} = req.body;
        if(!postId){
            return res.status(400).json({
                success: false,
                message: "Post Id is required"
            });
        }
        const existMilestone = await Milestone.findById(milestoneId);
        if (!existMilestone) {
            return res.status(404).json({ error: "Milestone not found" });
        }
        if (title) {
            existMilestone.title = title;
        }
        if (description) {
            existMilestone.description = description;
        }
        if (dueDate) {
            existMilestone.dueDate = dueDate;
        }
        if (status) {
            existMilestone.status = status;
        }
        const updatedMilestone = await existMilestone.save();
        const updatedPost = await Post.findByIdAndUpdate({_id : postId}, {
            $push:{milestones: updatedMilestone._id}
        }, {
            new: true
        }).populate('milestones');
        return res.status(200).json({
            success: true,
            updatedMilestone,updatedPost,
            message: "Milestone updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// delete milestone

exports.deleteMilestone = async (req, res) => {
    try {
        const {postId , mileStoneId}= req.body;
        await Post.findByIdAndUpdate({
            _id: postId
        }, {
            $pull: {milestones: mileStoneId}
        
        });
        const deletedMilestone = await Milestone.findByIdAndDelete(mileStoneId);
        if (!deletedMilestone) {
            return res.status(404).json({ error: "Milestone not found" });
        }
        return res.status(200).json({ 
            success:true,
            deletedMilestone,
            message:"Deletion Successful!"});
    } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while deleting the Milestone",
        })
    }
    
}