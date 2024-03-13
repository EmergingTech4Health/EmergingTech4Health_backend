const express = require('express')
const router = express.Router()
const {auth, isAdmin , isSuperAdmin} = require('../middlewares/auth')

const {
    createProfile,
    updateProfile,
    deleteProfile,
    getAllProfiles,
} = require('../controllers/Profile')

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

router.delete("/deleteProfile", auth , isSuperAdmin , deleteProfile);
router.post("/createProfile", auth ,  createProfile);
router.put("/updateProfile", auth , updateProfile);
router.get('/profiles',  getAllProfiles);

module.exports = router