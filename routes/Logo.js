const express = require('express');
const router = express.Router();
const { auth} = require('../middlewares/auth');
const { AddLogo, GetLogo, DeleteLogo } = require('../controllers/Logo');

// ********************************************************************************************************
//                                      Logo routes
// ********************************************************************************************************

router.post("/addLogo", auth, AddLogo);

router.get("/getLogo", GetLogo);

router.delete("/deleteLogo", auth,  DeleteLogo);

module.exports = router;