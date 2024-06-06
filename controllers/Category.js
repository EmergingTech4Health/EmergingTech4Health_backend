const Category = require("./../models/Category");
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// Add validation to category if it exists or not
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);
    return res.status(200).json({
      success: true,
      message: "Categorys Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      success: true,
      categories,
      message: "All Categories",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId ,name, description } = req.body;
    // const categoryId = req.params.id; // Assuming you get category ID from request parameters

    // Fetch the existing category
    const existingCategory = await Category.findById(categoryId);

    // Validate the category
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Update only the provided fields
    if (name) {
      existingCategory.name = name;
    }
    if (description) {
      existingCategory.description = description;
    }

    // Save the updated category
    const updatedCategory = await existingCategory.save();

    // Then you can send back the updated category as response
    return res.status(200).json(updatedCategory);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error occurred while updating category:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Show a category Page

exports.showCategoryPage = async (req, res) => {
  const { categoryId } = req.params; // Extract category ID from URL parameters
  try {
    console.log(categoryId);
    const selectedCategory = await Category.findById(categoryId)
      .populate("projects")
      .exec();
    console.log("selected category", selectedCategory);
    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    
    // Handle the case when there are no projects
    if (selectedCategory.projects.length === 0) {
      console.log("No projects found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No projects found for the selected category.",
      });
    }
    
    // Get projects for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate("projects")
      .exec();
    console.log("different category", differentCategory);

    // Respond with the selected category and a different category
    return res.status(200).json({
      success: true,
      selectedCategory: selectedCategory,
      differentCategory: differentCategory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.deleteCategory = async(req, res) => {
    try {
        const {categoryId} = req.body;
        if(!categoryId){
            return res.status(400).json({error: "Category ID is required"});
        }
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        
        if (!deletedCategory) {
            return res.status(404).json({error: "Category not found"});
        }

        res.status(200).json({success: true, message: "Category deleted successfully"});
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
          });
    }
}