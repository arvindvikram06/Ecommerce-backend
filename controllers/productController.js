const Product = require("../models/Product");


exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity,benefits,ingredients } = req.body;
    const product = new Product({ name, description, price, quantity,benefits,ingredients });
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products", error });
  }
};


exports.updateProductQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { quantity },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product quantity updated", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity", error });
  }
};
