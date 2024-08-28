const Logo = require('../models/Logo')
const { uploadImageToCloudinary } = require('../utils/imageUploader');


exports.AddLogo = async (req, res) => {
    try {
        const{link} = req.body
        const pic =  req.files.pic ;
        if(!link){
            return res.status(400).json({error: "Link is required"})
        }
        let picUrl = "";
        if(pic){
            const result = await uploadImageToCloudinary(pic);
            picUrl = result.secure_url;
        }
        const logo = await Logo.create({
            link,
            logo: picUrl
        })
        return res.status(200).json({
            success: true,
            logo,
            message: "Logo Added Successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.GetLogo = async (req, res) => {
    try {
        const logo = await Logo.find()
        return res.status(200).json({
            success: true,
            logo
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.DeleteLogo = async (req, res) => {
    try {
        const {id} = req.body
        const logo = await Logo.findByIdAndDelete(id)
        if(!logo){
            return res.status(404).json({
                success: false,
                message: "Logo not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Logo deleted successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}