const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  try {
    const { name,category, description, price, quantity, benefits, ingredients,weight } =
      req.body;
      // console.log(req.body)
    const product = new Product({
      name,
      category,
      description,
      price,
      quantity,
      benefits,
      ingredients,
      weight,
    });
    console.log(product)
    await product.save();
    return res.status(200).json({ message: "Product added successfully", product });
  } catch (error) {
    console.log(error)
   return  res.status(500).json({ message: "Failed to add product", error});
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const categorizedProducts = Object.values(
      products.reduce((categories, product) => {
        if (!categories[product.name]) {
          categories[product.name] = { category: product.name, products: [] };
        }
        categories[product.name].products.push(product);
        return categories;
      }, {})
    );

    return res.status(200).json(categorizedProducts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve products", error });
  }
};


exports.getProduct = async (req, res) => {
  try {
    console.log("hello");
    const id = req.params.id;
    const products = await Product.findById(id);
    if (id) {
      res.status(200).json(products);
    } else {
      return res.status(200).send({ msg: "not found" });
    }
  } catch (error) {
   return res.status(500).json({ message: "Failed to retrieve products", error });
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
    return res.status(200).json({ message: "Product quantity updated", product });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update quantity", error });
  }
};

exports.mostSaled = async(req,res) =>{
  try{
    const mostsaled = await Products.find().sort({totalSales:-1})
    return res.status(200).json(mostsaled);

  }catch(error){

    return res.status(500).json({message:"failed to fetch",error});
  }
}