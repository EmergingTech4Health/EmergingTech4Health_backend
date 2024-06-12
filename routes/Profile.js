const express = require('express')
const router = express.Router()
const {auth, isAdmin , isSuperAdmin} = require('../middlewares/auth')
const upload = require('../middlewares/multer')

const {
    createProfile,
    updateProfile,
    deleteProfile,
    showAllProfiles,
} = require('../controllers/Profile')

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

router.delete("/deleteProfile", auth , isSuperAdmin , deleteProfile);
router.post("/createProfile", auth ,  createProfile);
router.put("/updateProfile", auth , updateProfile);
router.get('/profiles',  showAllProfiles);

module.exports = router