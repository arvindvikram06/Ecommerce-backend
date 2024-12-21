const Cart = require("../models/Cart");
const Address = require("../models/Address");
const Order = require("../models/Order");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_MSDRKXkHnptMYU",
  key_secret: "fZH6ibOfpW3YQjBimBou6w8q",
});

exports.checkout = async (req, res) => {
  const { addressId } = req.body;
  console.log("In checkout");

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

    let order = await Order.findOne({
      userId: req.user.id,
      orderStatus: "Pending",
    });

    if (!order) {
      order = new Order({
        userId: req.user.id,
        items: cart.items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        shippingAddress,
        orderStatus: "Pending",
      });
    }

    const amountInPaise = Math.round(totalAmount * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    console.log("Razorpay Order Created:", razorpayOrder);

    res.status(201).json({
      message: "Order placed successfully!",
      order,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Checkout error:", error.message || error);
    res
      .status(500)
      .json({ message: "Checkout process failed.", error: error.message });
  }
};
