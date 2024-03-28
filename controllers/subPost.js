const SubPost = require('../models/subPost');
const Post = require('../models/Post');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
exports.createSubPost = async (req, res) => {
    try {
        const { postId,sectionName, subSectionContent, imageUrls } = req.body;
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
         // Upload multiple images to Cloudinary
         const uploadedImageUrls = [];
         if (imageUrls && Array.isArray(imageUrls)) {
             for (const imageUrl of imageUrls) {
                 const result = await uploadImageToCloudinary(imageUrl);
                 uploadedImageUrls.push(result.secure_url);
             }
         }

        const subPost = await SubPost.create({
            sectionName,
            subSectionContent,
            imageUrls: uploadedImageUrls,
            
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
        const { subPostId, sectionName, subSectionContent, imageUrls, videoUrls } = req.body;
        // if(!postId){
        //     return res.status(400).json({
        //         success: false,
        //         message: "Post Id is required"
        //     });
        // }
       
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
        // const updatePost = await Post.findByIdAndUpdate(postId).populate('subPost');
        // console.log(updatePost);
    
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

// delete image from the subpost 

exports.removeImageFromSubPost = async (req, res) => {
    try {
        const { subPostId, imageUrl } = req.body;

        if (!subPostId || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: "SubPost ID and Image URL are required"
            });
        }

        const subPost = await SubPost.findById(subPostId);
        if (!subPost) {
            return res.status(404).json({ error: "SubPost not found" });
        }

        // Remove the image URL from the array
        const index = subPost.imageUrls.indexOf(imageUrl);
        if (index !== -1) {
            subPost.imageUrls.splice(index, 1);
        }

        // Save the updated subPost
        await subPost.save();

        return res.status(200).json({
            success: true,
            message: "Image removed from SubPost successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove image from SubPost. Please try again."
        });
    }
}