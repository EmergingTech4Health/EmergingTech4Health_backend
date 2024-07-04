// controllers/milestoneController.js
const Milestone = require('../models/Milestones');
const Post = require('../models/Post');

exports.createMilestone = async (req, res) => {
    try {
        const { postId, title, description, dueDate, status } = req.body;
        if (!postId || !title || !description || !status) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const milestone = await Milestone.create({ title, description, dueDate, status, project: postId });
        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $push: { milestones: milestone._id }
        }, { new: true }).populate('milestones');
        return res.status(200).json({
            success: true,
            milestone,
            updatedPost,
            message: "Milestone created successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.updateMilestone = async (req, res) => {
    try {
        const { milestoneId, title, description, dueDate, status } = req.body;
        const existMilestone = await Milestone.findById(milestoneId);
        if (!existMilestone) {
            return res.status(404).json({ error: "Milestone not found" });
        }
        if (title) existMilestone.title = title;
        if (description) existMilestone.description = description;
        if (dueDate) existMilestone.dueDate = dueDate;
        if (status) existMilestone.status = status;
        const updatedMilestone = await existMilestone.save();
        return res.status(200).json({
            success: true,
            updatedMilestone,
            message: "Milestone updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteMilestone = async (req, res) => {
    try {
        const { postId, milestoneId } = req.body;
        await Post.findByIdAndUpdate(postId, {
            $pull: { milestones: milestoneId }
        });
        const deletedMilestone = await Milestone.findByIdAndDelete(milestoneId);
        if (!deletedMilestone) {
            return res.status(404).json({ error: "Milestone not found" });
        }
        return res.status(200).json({
            success: true,
            deletedMilestone,
            message: "Deletion Successful!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the Milestone",
        });
    }
};

exports.getMilestones = async (req, res) => {
    try {
        const { postId } = req.params;
        const milestones = await Milestone.find({ project: postId });
        return res.status(200).json({
            success: true,
            milestones,
            message: "Milestones fetched successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching milestones",
        });
    }
}
