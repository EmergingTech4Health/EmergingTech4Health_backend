const ResearchProgress = require('../models/ResearchProgress');
const Profile = require('../models/Profile');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const Post = require('../models/Post');
const mongoose = require('mongoose');
exports.createResearchProgress = async (req, res) => {
    try {
        const { postId, contributors, description } = req.body;

        let uploadedImageUrls = [];
        if (req.files && req.files.images) {
            const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            for (let i = 0; i < images.length; i++) {
                const result = await uploadImageToCloudinary(images[i]);
                uploadedImageUrls.push(result.secure_url);
            }
        }

        const existPost = await Post.findById(postId);
        if (!existPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            });
        }

        if (!contributors || contributors.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Contributors are required"
            });
        }

        // Parse contributors if it's a string
        const parsedContributors = Array.isArray(contributors) ? contributors : JSON.parse(contributors);

        // Validate that all contributor IDs are valid ObjectIds
        const validContributors = parsedContributors.every(id => mongoose.Types.ObjectId.isValid(id));
        if (!validContributors) {
            return res.status(400).json({
                success: false,
                message: "Invalid contributor ID format"
            });
        }

        const existContributors = await Profile.find({ _id: { $in: parsedContributors } });
        if (existContributors.length !== parsedContributors.length) {
            return res.status(404).json({ error: "One or more contributors not found" });
        }

        const researchProgress = await ResearchProgress.create({
            contributors: parsedContributors,
            description,
            imageUrls: uploadedImageUrls,
        });

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { researchProgress: researchProgress._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            researchProgress,
            message: "Research Progress created successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Research Progress cannot be created. Please try again."
        });
    }
}

exports.updateResearchProgress = async (req, res) => {
    try {
        const { id, contributors, description } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Research Progress Id is required"
            });
        }

        const existResearchProgress = await ResearchProgress.findById(id);
        if (!existResearchProgress) {
            return res.status(404).json({ error: "Research Progress not found" });
        }

        if (description) {
            existResearchProgress.description = description;
        }

        if (contributors) {
            // Parse contributors if it's a string (sent as JSON string from the frontend)
            const parsedContributors = Array.isArray(contributors) ? contributors : JSON.parse(contributors);
            existResearchProgress.contributors = parsedContributors;
        }

        console.log(req.files);
        let uploadedImageUrls = [];
        if (req.files && req.files.images) {
            const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            for (let i = 0; i < images.length; i++) {
                const result = await uploadImageToCloudinary(images[i]);
                uploadedImageUrls.push(result.secure_url);
            }
            existResearchProgress.imageUrls.push(...uploadedImageUrls);
        }

        await existResearchProgress.save();

        return res.status(200).json({
            success: true,
            researchProgress: existResearchProgress,
            message: "Research Progress updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Research Progress cannot be updated. Please try again."
        });
    }
};

exports.getResearchProgress = async (req, res) => {
    try {
        const { postId } = req.body; // Get postId from body

        // Fetch the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        // Fetch all research progress entries associated with this postId
        const researchProgressList = await ResearchProgress.find({ _id: { $in: post.researchProgress } }).populate('contributors');
        console.log(researchProgressList);
        return res.status(200).json({
            success: true,
            researchProgress: researchProgressList // Return the list of research progress entries
        });
       
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Research Progress cannot be retrieved. Please try again."
        });
    }
}



exports.deleteSingleImage = async (req, res) => {
    try {
        const { id,url } = req.body;

        const existResearchProgress = await ResearchProgress.findById(id);
        if (!existResearchProgress) {
            return res.status(404).json({ error: "Research Progress not found" });
        }
       
        const index = existResearchProgress.imageUrls.indexOf(url);
        if (index > -1) {
            existResearchProgress.imageUrls.splice(index, 1);
        }

        await existResearchProgress.save();

        return res.status(200).json({
            success: true,
            researchProgress: existResearchProgress,
            message: "Image deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Image cannot be deleted. Please try again."
        });
    }
}


exports.deleteResearchProgress = async (req, res) => {
    try {
        const { postId, researchProgressId } = req.body;

        // Check if the research progress exists
        const existResearchProgress = await ResearchProgress.findById(researchProgressId);
        if (!existResearchProgress) {
            return res.status(404).json({ error: "Research Progress not found" });
        }

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Update the post to remove the research progress ID
        await Post.findByIdAndUpdate(
            postId,
            { $pull: { researchProgress: researchProgressId } },
            { new: true }
        );

        // Delete the research progress document
        await ResearchProgress.deleteOne({ _id: researchProgressId });

        return res.status(200).json({
            success: true,
            message: "Research Progress deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Research Progress cannot be deleted. Please try again."
        });
    }
}