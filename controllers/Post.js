const Post = require('../models/Post');
// const Image = require('../models/Image');
// const Video = require('../models/Video');
const Category= require('../models/Category');
const Profile = require('../models/Profile');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
// Create a new post
exports.createPost = async (req, res) => {
  try {
      const { title, shortDesc, content, references, contributors, category, grant } = req.body;
      console.log(req.body);
      
      if (!title || !shortDesc || !content || !references || !contributors || !category || !grant) {
          return res.status(400).json({ error: "Please provide all required fields" });
      }

      // Parse JSON fields
      const parsedContributors = JSON.parse(contributors);
      const parsedReferences = JSON.parse(references);

      const contributorsExist = await Profile.find({ _id: { $in: parsedContributors } }).select('_id');
      if (contributorsExist.length !== parsedContributors.length) {
          return res.status(400).json({ error: "One or more contributors do not exist" });
      }

      const categoryExist = await Category.findById(category).select('_id');
      if (!categoryExist) {
          return res.status(400).json({ error: "Category does not exist" });
      }

      let imageUrl = null;
      if (req.files && req.files.image) {
          const result = await uploadImageToCloudinary(req.files.image);
          imageUrl = result.secure_url;
      }

      const post = new Post({
          title,
          shortDesc,
          content,
          references: parsedReferences,
          contributors: parsedContributors,
          category,
          grant,
          image: imageUrl,
      });

      await post.save();

      // Update profiles with the new post ID
      const updateProfilesPromise = Profile.updateMany(
          { _id: { $in: parsedContributors } },
          { $addToSet: { projects: post._id } }
      );

      // Update category with the new post ID
      const updateCategoryPromise = Category.findByIdAndUpdate(
          category,
          { $addToSet: { projects: post._id } },
          { new: true }
      );

      // Wait for both updates to complete
      await Promise.all([updateProfilesPromise, updateCategoryPromise]);

      return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
};
  
  
// update a post

exports.updatePost = async (req, res) => {
  try {
      const { postId, title, shortDesc, content, references, contributors, category, grant } = req.body;
      const existPost = await Post.findById(postId);
      if (!existPost) {
          return res.status(404).json({ error: "Post not found" });
      }

      // Parse JSON fields
      const parsedContributors = contributors ? JSON.parse(contributors) : null;
      const parsedReferences = references ? JSON.parse(references) : null;

      // Store original contributors and category for comparison
      const originalContributors = existPost.contributors;
      const originalCategory = existPost.category;

      // Update post fields
      if (title) existPost.title = title;
      if (content) existPost.content = content;
      if (shortDesc) existPost.shortDesc = shortDesc;
      if (parsedReferences) existPost.references = parsedReferences;
      if (parsedContributors) existPost.contributors = parsedContributors;
      if (category) existPost.category = category;
      if (grant) existPost.grant = grant;

      if (req.files && req.files.image) {
          const result = await uploadImageToCloudinary(req.files.image);
          existPost.image = result.secure_url;
      }

      // Save the updated post
      const updatedPost = await existPost.save();

      // Update Profile documents if contributors have changed
      if (parsedContributors) {
          const contributorsToRemove = originalContributors.filter(c => !parsedContributors.includes(c.toString()));
          const contributorsToAdd = parsedContributors.filter(c => !originalContributors.map(oc => oc.toString()).includes(c));

          if (contributorsToRemove.length > 0) {
              await Profile.updateMany(
                  { _id: { $in: contributorsToRemove } },
                  { $pull: { projects: postId } }
              );
          }

          if (contributorsToAdd.length > 0) {
              await Profile.updateMany(
                  { _id: { $in: contributorsToAdd } },
                  { $addToSet: { projects: postId } }
              );
          }
      }

      // Update Category documents if category has changed
      if (category && category !== originalCategory.toString()) {
          await Category.findByIdAndUpdate(originalCategory, { $pull: { projects: postId } });
          await Category.findByIdAndUpdate(category, { $addToSet: { projects: postId } });
      }

      return res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
  }
};
  
  
  
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

