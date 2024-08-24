const express = require('express')
const router = express.Router()

const {auth} = require('../middlewares/auth')
const{createFrontPage, updateFrontPage , deleteFrontPage , showAllFrontPages} = require('../controllers/FrontPage')

// ********************************************************************************************************
//                                      FrontPage routes
// ********************************************************************************************************

router.post("/createFrontPage", auth ,  createFrontPage);
router.put("/updateFrontPage", auth , updateFrontPage);
router.delete("/deleteFrontPage", auth , deleteFrontPage);
router.get('/frontPages', showAllFrontPages);

module.exports = router