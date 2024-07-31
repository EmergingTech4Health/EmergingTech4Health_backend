const express = require('express')
const router = express.Router()
const {auth, isAdmin , isSuperAdmin} = require('../middlewares/auth')

const{
    addPublication,updatePublication,showAllPublications,deletePublication
} = require('../controllers/Publication')

// ********************************************************************************************************
//                                      Publication routes
// ********************************************************************************************************

router.post("/addPublication", auth , addPublication);
router.get("/showAllPublications", showAllPublications);
router.put("/updatePublication", auth , updatePublication);
router.delete("/deletePublication", auth ,deletePublication);

module.exports = router