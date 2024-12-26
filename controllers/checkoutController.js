const Cart = require("../models/Cart");
const Address = require("../models/Address");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Razorpay = require("razorpay");
const { startSession } = require("mongoose");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.checkout = async (req, res) => {
  const { addressId } = req.body;
  const session = await startSession();

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required." });
    }

    const shippingAddress = await Address.findOne({
      _id: addressId,
      userId: req.user.id,
    });
    if (!shippingAddress) {
      return res.status(404).json({ message: "Address not found." });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Start a session for transaction handling
    session.startTransaction();

    // Deduct stock for the products in the cart
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product.quantity < item.quantity) {
        throw new Error(`Not enough stock for product: ${product.name}`);
      }

      product.quantity -= item.quantity;
      await product.save({ session });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100, // Razorpay accepts amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `order_rcptid_${new Date().getTime()}`,
      payment_capture: 1, // Automatic capture of payment
    });

    // Create the order in our database
    const order = new Order({
      userId: req.user.id,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      shippingAddress,
      orderStatus: "Pending",
      razorpayOrderId: razorpayOrder.id, 
      waybill:""
    });

    await order.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Respond with Razorpay order details
    res.status(201).json({
      message: "Order placed successfully!",
      order,
      razorpayOrder,
      currency: "INR",
      amount: totalAmount,
    });
  } catch (error) {
    // If anything fails, abort the transaction and handle errors
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();

    console.error("Checkout error:", error.message || error);
    res
      .status(500)
      .json({ message: "Checkout process failed.", error: error.message });
  }
};
