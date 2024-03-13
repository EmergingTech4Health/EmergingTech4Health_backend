const SubPost = require('../models/subPost');
const Post = require('../models/Post');

exports.createSubPost = async (req, res) => {
    try {
        const { postId,sectionName, subSectionContent, imageUrls, videoUrls } = req.body;
        if(!postId){
            return res.status(400).json({
                success: false,
                message: "Post Id is required"
            });
        }
        const existPost = await Post.findById(postId);
        if (!existPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        if(!sectionName || !subSectionContent){
            return res.status(400).json({
                success: false,
                message: "Section Name and SubSection Content are required"
            });
        }

        const subPost = await SubPost.create({
            sectionName,
            subSectionContent,
            imageUrls,
            videoUrls
        });
        const updatedPost = await Post.findByIdAndUpdate({
            _id: postId
        }, 
        {
           $push:{subPost: subPost._id}
        }, {
            new: true
        
        }).populate('subPost');
        return res.status(200).json({
            success: true,
            subPost,updatedPost,
            message: "SubPost created successfully "

        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "SubPost cannot be created. Please try again."
        });
    }
}

// update subpost
exports.updateSubPost = async (req, res) => {
    try {
        const { postId,subPostId, sectionName, subSectionContent, imageUrls, videoUrls } = req.body;
        if(!postId){
            return res.status(400).json({
                success: false,
                message: "Post Id is required"
            });
        }
       
        const existSubPost = await SubPost.findById(subPostId);
        if (!existSubPost) {
            return res.status(404).json({ error: "SubPost not found" });
        }
        if (sectionName) {
            existSubPost.sectionName = sectionName;
        }
        if (subSectionContent) {
            existSubPost.subSectionContent = subSectionContent;
        }
        if (imageUrls) {
            existSubPost.imageUrls = imageUrls;
        }
        if (videoUrls) {
            existSubPost.videoUrls = videoUrls;
        }
        const updatedSubPost = await existSubPost.save();
        const updatePost = await Post.findByIdAndUpdate(postId).populate('subPost');
        console.log(updatePost);
    
        return res.status(200).json({
            success: true,
            message: "SubPost updated successfully",
            subPost: updatedSubPost
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "SubPost cannot be updated. Please try again."
        });
    }
}


// delete subpost

exports.deleteSubPost = async (req, res) => {
    try {
        const {postId, subPostId} = req.body;
        const deletedSubPost = await SubPost.findByIdAndDelete(subPostId);
        await Post.findByIdAndUpdate(postId, { $pull: { subPost: subPostId } });
        if (!deletedSubPost) {
            return res.status(404).json({ error: "SubPost not found" });
        }
        return res.status(200).json({
            success: true,
            message: "SubPost deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "SubPost cannot be deleted. Please try again."
        });
    }
}