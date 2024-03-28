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
    removeImageFromSubPost
} = require('../controllers/subPost');

const {
    createMilestone,
    updateMilestone,
    deleteMilestone,
} = require('../controllers/Milestone')
// const {
//     addVideo,deleteVideo
// } = require('../controllers/Video')

// ********************************************************************************************************
//                              POST ROUTES
// ********************************************************************************************************

router.post("/createPost", auth , createPost);
router.put("/updatePost", auth , updatePost);
router.delete("/deletePost", auth,isSuperAdmin , deletePost);
router.get("/getAllPosts", getAllPosts);
router.get("/getSinglePost", getSinglePost);


// ********************************************************************************************************
//                              SUBPOST ROUTES
// ********************************************************************************************************

router.post("/createSubPost", auth , createSubPost);
router.put("/updateSubPost", auth , updateSubPost);
router.delete("/deleteSubPost", auth, isSuperAdmin,deleteSubPost);
router.delete("/removeImageFromSubPost", auth, removeImageFromSubPost);

// ********************************************************************************************************
//                              MILESTONE ROUTES
// ********************************************************************************************************

router.post("/createMilestone", auth , createMilestone);
router.put("/updateMilestone", auth , updateMilestone);
router.delete('/deleteMilestone',auth, isSuperAdmin, deleteMilestone);

// ********************************************************************************************************
//                              VIDEO ROUTES
// ********************************************************************************************************
// router.post("/addVideo", auth , addVideo);
// router.delete("/deleteVideo", auth , deleteVideo);

module.exports= router; 