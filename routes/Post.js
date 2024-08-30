const express = require('express')
const router = express.Router()

const {auth, isAdmin , isSuperAdmin} = require('../middlewares/auth')
const {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getSinglePost
} = require('../controllers/Post')

const {
    createSubPost,
    updateSubPost,
    deleteSubPost,
    removeImageFromSubPost,
   
} = require('../controllers/subPost');

const {
    createMilestone,
    updateMilestone,
    deleteMilestone,
    getMilestones,
} = require('../controllers/Milestone')
const {
    addVideo,deleteVideo,getVideos
} = require('../controllers/Videos')

// ********************************************************************************************************
//                              POST ROUTES
// ********************************************************************************************************

router.post("/createPost", auth , createPost);
router.put("/updatePost", auth , updatePost);
router.delete("/deletePost", auth, deletePost);
router.get("/getAllPosts", getAllPosts);
router.get("/getSinglePost/:postId", getSinglePost);


// ********************************************************************************************************
//                              SUBPOST ROUTES
// ********************************************************************************************************

router.post("/createSubPost", auth , createSubPost);
router.put("/updateSubPost", auth , updateSubPost);
router.delete("/deleteSubPost", auth, deleteSubPost);
router.delete("/removeImageFromSubPost", auth, removeImageFromSubPost);

// ********************************************************************************************************
//                              MILESTONE ROUTES
// ********************************************************************************************************

router.post("/createMilestone", auth , createMilestone);
router.put("/updateMilestone", auth , updateMilestone);
router.delete('/deleteMilestone',auth,  deleteMilestone);
router.get('/getMilestones', getMilestones)

// ********************************************************************************************************
//                              VIDEO ROUTES
// ********************************************************************************************************
router.post("/addVideo", auth , addVideo);
router.delete("/deleteVideo", auth , deleteVideo);
router.get("/getVideos", getVideos);

module.exports= router; 