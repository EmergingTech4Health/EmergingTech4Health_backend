const Profile = require('../models/Profile');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const mongoose = require('mongoose');
exports.createProfile = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Files:", req.files);

        const { name, email, about, qualifications, designation, AreaofInterest } = req.body;
        const profilePic = req.files ? req.files.profilePic : null;

        console.log("Name:", name);
        console.log("Email:", email);
        console.log("About:", about);
        console.log("ProfilePic:", profilePic);

        // Check if required fields are provided
        if (!name || !email || !about) {
            console.log("Missing required fields");
            return res.status(400).json({ error: "Name, email, and about are required" });
        }

        // Manually parse socialLinks from req.body if not sent as JSON
        const socialLinks = [];
        Object.keys(req.body).forEach((key) => {
            if (key.startsWith('socialLinks')) {
                const index = key.match(/\[(\d+)\]/)[1];
                if (!socialLinks[index]) {
                    socialLinks[index] = {};
                }
                const subKey = key.match(/\[\d+\]\[(\w+)\]/)[1];
                socialLinks[index][subKey] = req.body[key];
            }
        });

        console.log("Parsed Social Links:", socialLinks);

        // Upload profile picture to Cloudinary if it exists
        let profilePicUrl = "";
        if (profilePic) {
            console.log("Uploading profile picture to Cloudinary...");
            const result = await uploadImageToCloudinary(profilePic);
            console.log("Cloudinary upload result:", result);
            profilePicUrl = result.secure_url;
        }

        console.log("Profile Pic URL:", profilePicUrl);

        // Create profile with profile picture URL and validated socialLinks
        const profileDetails = await Profile.create({
            name,
            email,
            about,
            profilePic: profilePicUrl,
            socialLinks,
            qualifications,
            designation,
            AreaofInterest
        });

        console.log("Profile created:", profileDetails);
        return res.status(200).json({
            success: true,
            message: "Profile Created Successfully",
            profile: profileDetails
        });
    } catch (error) {
        console.error("Error in createProfile:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}




exports.updateProfile = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Files:", req.files);

        const { profileId, name, email, about, qualifications, designation, AreaofInterest } = req.body;
        const profilePic = req.files ? req.files.profilePic : null;

        console.log("Profile ID:", profileId);
        console.log("ProfilePic:", profilePic);

        // Fetch the existing profile
        const existingProfile = await Profile.findById(profileId);
        console.log("Existing Profile:", existingProfile);

        // Check if the profile exists
        if (!existingProfile) {
            console.log("Profile not found");
            return res.status(404).json({ error: "Profile not found" });
        }

        // Update profile fields
        if (name) {
            console.log("Updating name to:", name);
            existingProfile.name = name;
        }
        if (email) {
            console.log("Updating email to:", email);
            existingProfile.email = email;
        }
        if (about) {
            console.log("Updating about to:", about);
            existingProfile.about = about;
        }

        // Handle socialLinks parsing and updating
        const socialLinks = [];
        Object.keys(req.body).forEach((key) => {
            if (key.startsWith('socialLinks[')) {
                const match = key.match(/socialLinks\[(\d+)\]\[(\w+)\]/);
                if (match) {
                    const index = match[1];
                    const field = match[2];
                    if (!socialLinks[index]) {
                        socialLinks[index] = {};
                    }
                    socialLinks[index][field] = req.body[key];
                }
            }
        });

        if (socialLinks.length > 0) {
            console.log("Parsed socialLinks:", socialLinks);

            // Validate and update socialLinks array
            const validatedSocialLinks = socialLinks.map(link => {
                console.log("Social link:", link);
                if (!link.name || !link.url) {
                    console.log("Invalid social link object:", link);
                    throw new Error("Social link object must contain 'name' and 'url' properties");
                }
                return {
                    name: link.name,
                    url: link.url
                };
            });

            // Update the existing profile's socialLinks
            existingProfile.socialLinks = validatedSocialLinks;
        }

        if (profilePic) {
            console.log("Uploading new profile picture to Cloudinary...");
            const result = await uploadImageToCloudinary(profilePic, process.env.FOLDER_NAME, 1000, 1000);
            console.log("Cloudinary upload result:", result);
            existingProfile.profilePic = result.secure_url;
        }

        if (qualifications) {
            console.log("Updating qualifications to:", qualifications);
            existingProfile.qualifications = qualifications;
        }
        if (designation) {
            console.log("Updating designation to:", designation);
            existingProfile.designation = designation;
        }
        if (AreaofInterest) {
            console.log("Updating AreaofInterest to:", AreaofInterest);
            existingProfile.AreaofInterest = AreaofInterest;
        }

        // Save the updated profile
        const updatedProfile = await existingProfile.save();
        console.log("Updated Profile:", updatedProfile);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};




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