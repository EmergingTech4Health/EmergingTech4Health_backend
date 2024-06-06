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
router.put("/updateCategory", auth , updateCategory);
router.delete("/deleteCategory", auth , isSuperAdmin,deleteCategory);
router.get('/category/:categoryId', showCategoryPage); 

module.exports = router