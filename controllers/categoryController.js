const Category = require("../models/Category");

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = new Category({
      name,
    });

    await category.save();
    return res
      .status(200)
      .json({ message: "Category added successfully", product });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add Category", error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
     const {categoryId} = req.body;
     if(!categoryId){
        return res.status(404).json({message:"Category not found"})
     }
    await Category.deleteOne(categoryId);
    return res
      .status(200)
      .json({ message: "Category added successfully", product });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add Category", error });
  }
};


