const Video = require('../models/Videos');
const SubPost = require('../models/subPost');
exports.addVideo = async (req, res) => {
    try {
        const {subPostId ,title, description, videoUrl} = req.body;
        const existedSubPost = await SubPost.findById(subPostId);
        if(!existedSubPost){
            return res.status(404).json({message: "Sub post not found"});
        }
        if(!title || !description || !videoUrl){
            return res.status(400).json({message: "Title, description and videoUrl are required"});
        }
        const video = await Video.create({
            title,
            description,
            videoUrl,
        });

        const updatedSubPost = await SubPost.findByIdAndUpdate(subPostId, {
            $push: {videoUrls: video._id}
        }, {new: true}).populate('videoUrls');
       
        res.status(201).json({success: true, video,updatedSubPost, message: "Video added successfully"});
        
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: "Failed to add video. Please try again."
        });
    }
}

// Delete Video from post

exports.deleteVideo = async (req, res) => {
    try {
        const { subPostId, videoId } = req.body;

        if (!subPostId || !videoId) {
            return res.status(400).json({
                success: false,
                message: "SubPost ID and Video ID are required"
            });
        }

        const subPost = await SubPost.findById(subPostId);
        if (!subPost) {
            return res.status(404).json({ error: "SubPost not found" });
        }

        // Check if the video exists in the subPost
        const index = subPost.videoUrls.indexOf(videoId);
        if (index === -1) {
            return res.status(404).json({ error: "Video not found in the SubPost" });
        }

        // Remove the video ID from the array
        subPost.videoUrls.splice(index, 1);

        // Save the updated subPost
        await subPost.save();

        return res.status(200).json({
            success: true,
            message: "Video deleted from SubPost successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete video from SubPost. Please try again."
        });
    }
}

exports.getVideos = async (req, res) => {
    try {
        // console.log("Received request for getVideos");
        // console.log("req.query:", req.query);
        
        const { subPostId } = req.query;
        // console.log("Extracted subPostId:", subPostId);

        if (!subPostId) {
            return res.status(400).json({ success: false, message: "subPostId is required" });
        }

        const subPost = await SubPost.findById(subPostId).populate('videoUrls');
        if (!subPost) {
            return res.status(404).json({ success: false, message: "Sub post not found" });
        }
        res.status(200).json({ success: true, videos: subPost.videoUrls });
    } catch (error) {
        console.error("Error in getVideos:", error);
        res.status(500).json({ success: false, message: "Failed to get videos. Please try again." });
    }
}

