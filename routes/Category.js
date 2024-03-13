const express = require('express')
const router = express.Router()
const {auth, isAdmin , isSuperAdmin} = require('../middlewares/auth')

const {
    addCategory,
    showAllCategories,
    updateCategory,
    showCategoryPage,
    deleteCategory
} = require('../controllers/Category')

// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************

router.post("/addCategory", auth , addCategory);
router.get("/showAllCategories", showAllCategories);
router.put("/updateCategory/:id", auth , updateCategory);
router.delete("/deleteCategory/:id", auth , isSuperAdmin,deleteCategory);
router.get('/showCategoryPage',  showCategoryPage);

module.exports = router