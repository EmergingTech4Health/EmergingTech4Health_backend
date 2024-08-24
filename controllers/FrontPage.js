const FrontPage = require('../models/frontPage');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
exports.createFrontPage = async (req, res) => {
    try {
        const { title, description, link } = req.body;
        const pic = req.files ? req.files.pic : null;
        console.log(req.body);
        if (!title || !description || !pic || !link) {
            return res.status(400).json({ error: "All fields are required" });
        }
        let picUrl = "";
        if (pic) {
            const result = await uploadImageToCloudinary(pic);
            picUrl = result.secure_url;
        }

        const frontPage = await FrontPage.create({ title, description, pic:picUrl, link });
        return res.status(200).json({
            success: true,
            frontPage,
            message: "FrontPage created successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

exports.updateFrontPage = async (req, res) => {
    try {
        const { postId, title, description,  link } = req.body;
        console.log(req.body);
        const pic = req.files ? req.files.pic : null;
      

        const updatedFrontPage = await FrontPage.findById(postId);
        // await FrontPage.findByIdAndUpdate(frontPageId, { title, description, link }, { new: true });
        if (!updatedFrontPage) {
            return res.status(404).json({ error: "FrontPage not found" });
        }
        if(pic){
            const result = await uploadImageToCloudinary(pic);
            updatedFrontPage.pic = result.secure_url;
            await updatedFrontPage.save();
        }
        if(title){
            updatedFrontPage.title = title;
        }
        if(description){
            updatedFrontPage.description = description;
        }
        if(link){
            updatedFrontPage.link = link;
        }

        
        await updatedFrontPage.save();
        return res.status(200).json({
            success: true,
            frontPage: updatedFrontPage,
            message: "FrontPage updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

exports.deleteFrontPage = async (req, res) => {
    try {
        const { postId } = req.body;
        console.log("calling delete");
        console.log(req.body);
        if (!postId) {
            return res.status(400).json({ error: "Invalid frontPage ID" });
        }
        const deletedFrontPage = await FrontPage.findByIdAndDelete(postId);
        if (!deletedFrontPage) {
            return res.status(404).json({ error: "FrontPage not found" });
        }
        return res.status(200).json({
            success: true,
            message: "FrontPage deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}
exports.showAllFrontPages = async (req, res) => {
    try {
        const frontPages = await FrontPage.find();
        // console.log(frontPages);
        return res.status(200).json({
            success: true,
            frontPages,
            message: "All FrontPages"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}