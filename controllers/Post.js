const Post = require('../models/Post');
// const Image = require('../models/Image');
// const Video = require('../models/Video');
const Category= require('../models/Category');
const Profile = require('../models/Profile');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
// Create a new post
exports.createPost = async (req, res) => {
  try {
      // Extract data from request body
      const { title, shortDesc, content, references, contributors, category,grant } = req.body;

      // Validate required fields
      if (!title || !shortDesc || !content || !references || !contributors || !category || !grant) {
          return res.status(400).json({ error: "Please provide all required fields" });
      }

      // Check if contributors exist
      const contributorsExist = await Profile.find({ _id: { $in: contributors } }).select('_id');
      if (contributorsExist.length !== contributors.length) {
          return res.status(400).json({ error: "One or more contributors do not exist" });
      }

      // Check if category exists
      const categoryExist = await Category.findById(category).select('_id');
      if (!categoryExist) {
          return res.status(400).json({ error: "Category does not exist" });
      }

      // Create the post
      const post = new Post({
          title,
          shortDesc,
          content,
          references,
          contributors,
          category,
          grant
      });

      // Save the post
      await post.save();

      // Add post ID to all contributors
      await Profile.updateMany({ _id: { $in: contributors } }, { $push: { projects: post._id } });

      // Add post ID to category
      await Category.findByIdAndUpdate(category, { $push: { projects: post._id } });

      // Return success response
      return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
};

// // Upload images to a post
// exports.uploadImage = async(req, res) => {
//   try {
//     const uploadedImages = [];

//         for (const image of images) {
//             const { name, imageDesc, imageData } = image;

//             // Upload image to Cloudinary
//             const { secure_url: imageUrl } = await uploadImageToCloudinary(imageData);

//             // Create image document
//             const newImage = new Image({
//                 name,
//                 imageDesc,
//                 imageUrl,
//                 project: projectId,
//                 category: categoryId
//             });

//             // Save image document
//             await newImage.save();

//             // Push the uploaded image to the array
//             uploadedImages.push(newImage);
//         }

//         return uploadedImages;
//     } catch (error) {
//         console.error("Error uploading images:", error);
//         throw error;
//     }
// };

// // Remove an image from a post
// exports.removeImage = async (req, res) => {
//     // const { id: imageId } = req.params;
//     try {
//       const {name} = req.body;
//       const image = await Image.findOneAndDelete({name: name});
      
//       if (!image) {
//         return res.status(404).json({ error: "Image not found" });
//       }
  
//       const deletedImage = await Image.findOneAndDelete({ name });
  
//           // Check if image was found and deleted
//           if (!deletedImage) {
//               return res.status(404).json({ error: "Image not found" });
//           }
  
//           // Return success response
//           return res.status(200).json({ message: "Image removed successfully", deletedImage });
      
//     } catch (error) {
//         console.error("Error deleting image:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };


// // Upload videos to a post
// exports.addVideo = async (req, res) => {
//   try {
//     const { title, description, videoUrl, project, category } = req.body;

//     // Validate required fields
//     if (!title || !description || !videoUrl || !project || !category) {
//         return res.status(400).json({ error: "Please provide all required fields" });
//     }

//     // Create the video
//     const video = new Video({
//         title,
//         description,
//         videoUrl,
//         project,
//         category
//     });

//     // Save the video
//     await video.save();

//     // Return success response
//     return res.status(201).json({ message: "Video added successfully", video });
// } catch (error) {
//     console.error("Error adding video:", error);
//     return res.status(500).json({ error: "Internal server error" });
// }
// }

// // Controller to remove video by name
// exports.removeVideoByName = async (req, res) => {
//   try {
//       const { name } = req.body;

//       // Validate required field
//       if (!name) {
//           return res.status(400).json({ error: "Please provide the name of the video to remove" });
//       }

//       // Find and delete the video by name
//       const deletedVideo = await Video.findOneAndDelete({ title: name });

//       // Check if video was found and deleted
//       if (!deletedVideo) {
//           return res.status(404).json({ error: "Video not found" });
//       }

//       // Return success response
//       return res.status(200).json({ message: "Video removed successfully", deletedVideo });
//   } catch (error) {
//       console.error("Error removing video:", error);
//       return res.status(500).json({ error: "Internal server error" });
//   }
// };

// update a post

exports.updatePost = async (req, res) => {
  try {
    // const { postId } = req.params; // Extract post ID from request parameters
        const { postId ,title, shortDesc, content, references, contributors, category, grant } = req.body; // Extract allowed fields from request body
        const existPost = await Post.findById(postId);
        if (!existPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (title) {
            existPost.title = title;
        }
        if (content) {
            existPost.content = content;
        }
        if(shortDesc){
            existPost.shortDesc = shortDesc;
        }
        if(references) {
            existPost.references = references;
        }
        if(contributors){
            existPost.contributors = contributors;
        }
        if(category){
            existPost.category = category;
        }
        if(grant){
            existPost.grant = grant;
        }
        
    
        
        const updatedPost = await existPost.save();
        return res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// delete a post

exports.deletePost = async (req, res) => {
    try {
        const {postId, categoryId}= req.body;
        const deletedPost = await Post.findByIdAndDelete(postId);
        await Category.findByIdAndUpdate(categoryId ,{ $pull : { projects: postId } });
        
        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        // await subPost.deleteMany({id:{ $in: deletedPost.subPost}});
       return res.status(200).json({ message: "Post deleted successfully" });


    } catch (error) {
        console.error("Error deleting Post:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
    }




}

// get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.getSinglePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate('contributors')
            .populate('category')
            .populate('subPost')
            .populate('milestones');

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};