const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addItemToCart = async (req, res) => {
  const userId = req.user.id;
  // console.log(req.body.productData)
  const { productId, quantity, price, weight } = req.body.productData;

  if (!productId || !quantity || !price || !weight) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const product = await Product.findOne({
      _id: productId,
      weight: { $in: [weight] },
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or weight mismatch." });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price: price, weight: weight }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId && item.weight === weight
      );

      if (itemIndex > -1) {
        // cart.items[itemIndex].quantity += quantity; old
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({ productId, quantity, price, weight });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add item to cart", error });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
      "_id name"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const restructuredArray = cart.items.map((item) => ({
      _id: item._id,
      price: item.price,
      productId: item.productId._id,
      name: item.productId.name.trim(),
      quantity: item.quantity,
      weight: item.weight,
    }));
    res.status(200).json(restructuredArray);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve cart", error });
  }
};

exports.updateCartItem = async (req, res) => {
  const { productId, quantity, weight } = req.body.productData;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId && item.weight === weight
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Cart item updated", cart });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item", error });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const { weight } = req.body;
  console.log(weight);
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    // console.log(cart)

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId.toString() &&
          item.weight === weight
        )
    );

    console.log(cart);
    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item from cart", error });
  }
};
