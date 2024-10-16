const express = require('express')
const router = express.Router()

const {createResearchProgress , updateResearchProgress , deleteSingleImage , getResearchProgress,deleteResearchProgress} = require('../controllers/ResearchProgress')

const {auth} = require('../middlewares/auth')

router.post("/createResearchProgress", auth, createResearchProgress)
router.put("/updateResearchProgress", auth, updateResearchProgress)
router.post("/getResearchProgress", getResearchProgress)
router.delete("/deleteSingleImage", auth, deleteSingleImage)
router.delete("/deleteResearchProgress", auth, deleteResearchProgress)
module.exports = router