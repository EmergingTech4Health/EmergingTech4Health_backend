const express = require('express')
const router = express.Router()

const {createResearchProgress , updateResearchProgress , deleteSingleImage , getResearchProgress} = require('../controllers/ResearchProgress')

const {auth} = require('../middlewares/auth')

router.post("/createResearchProgress", auth, createResearchProgress)
router.put("/updateResearchProgress", auth, updateResearchProgress)
router.post("/getResearchProgress", getResearchProgress)
router.delete("/deleteSingleImage", auth, deleteSingleImage)

module.exports = router
