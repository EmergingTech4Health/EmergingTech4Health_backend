const Profile = require('../models/Profile');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const mongoose = require('mongoose');
exports.createProfile = async (req, res) => {
    try {
        const { name, email, about, socialLinks = [] } = req.body;  // Provide default value as an empty array
        const profilePic = req.file; // Assuming you're uploading a single image as profile picture

        // Check if required fields are provided
        if (!name || !email || !about) {
            return res.status(400).json({ error: "Name, email, and about are required" });
        }

        // Validate socialLinks array
        const validatedSocialLinks = Array.isArray(socialLinks) ? socialLinks.map(link => {
            if (!link.name || !link.url) {
                throw new Error("Social link object must contain 'name' and 'url' properties");
            }
            return {
                name: link.name,
                url: link.url
            };
        }) : [];

        // Upload profile picture to Cloudinary
        let profilePicUrl = "";
        if (profilePic) {
            const result = await uploadImageToCloudinary(profilePic);
            profilePicUrl = result.secure_url;
        }

        // Create profile with profile picture URL and validated socialLinks
        const profileDetails = await Profile.create({
            name,
            email,
            about,
            profilePic: profilePicUrl,
            socialLinks: validatedSocialLinks
        });

        console.log(profileDetails);
        return res.status(200).json({
            success: true,
            message: "Profile Created Successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}



exports.updateProfile = async (req, res) => {
    try {
        const { profileId, name, email, about, socialLinks } = req.body;
        const profilePic = req.file; // Assuming you're uploading a single image as profile picture

        // Fetch the existing profile
        const existingProfile = await Profile.findById(profileId);

        // Check if the profile exists
        if (!existingProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        // Update profile fields
        if (name) {
            existingProfile.name = name;
        }
        if (email) {
            existingProfile.email = email;
        }
        if (about) {
            existingProfile.about = about;
        }
        if (socialLinks) {
            // Parse socialLinks if necessary
            const parsedSocialLinks = Array.isArray(socialLinks) ? socialLinks : JSON.parse(socialLinks);

            // Validate socialLinks array
            const validatedSocialLinks = parsedSocialLinks.map(link => {
                if (!link.name || !link.url) {
                    throw new Error("Social link object must contain 'name' and 'url' properties");
                }
                return {
                    name: link.name,
                    url: link.url
                };
            });
            existingProfile.socialLinks = validatedSocialLinks;
        }
        if (profilePic) {
            // Upload profile picture to Cloudinary
            const result = await uploadImageToCloudinary(profilePic, process.env.FOLDER_NAME, 1000, 1000);
            existingProfile.profilePic = result.secure_url;
            console.log('profilePic', existingProfile.profilePic);
        }

        // Save the updated profile
        const updatedProfile = await existingProfile.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


exports.deleteProfile = async (req, res) => {
    try {
        const { profileId } = req.body;

        // Check if profileId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(profileId)) {
            return res.status(400).json({ error: "Invalid profile ID" });
        }

        // Find and delete the profile
        const deletedProfile = await Profile.findByIdAndDelete(profileId);

        // Check if the profile exists
        if (!deletedProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


exports.showAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        return res.status(200).json({
            success: true,
            profiles,
            message: "All Profiles"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}