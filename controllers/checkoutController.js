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

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    const shippingAddress = await Address.findOne({
      _id: addressId,
      userId: req.user.id,
    });
    if (!shippingAddress) {
      return res.status(404).json({ message: "Address not found." });
    }

    const order = new Order({
      userId: req.user.id,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      totalAmount,
      shippingAddress,
      orderStatus: "Pending",
    });

    
    await Cart.deleteMany({ userId: req.user.id });

   
    const amountInPaise = Math.round(totalAmount * 100);

    const options = {
      amount: amountInPaise, 
      currency: "INR",
      receipt: order._id.toString(),
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

// // controllers/checkoutController.js
// const Cart = require("../models/Cart");
// const Address = require("../models/Address");
// const Order = require("../models/Order");

// exports.checkout = async (req, res) => {
//   const { addressId } = req.body;

//   try {
//     // Fetch the cart associated with the user and populate the items
//     const cart = await Cart.findOne({ userId: req.user.id }).populate(
//       "items.productId"
//     );

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Your cart is empty." });
//     }

//     // Calculate the total amount for the order
//     const totalAmount = cart.items.reduce((sum, item) => {
//       return sum + item.productId.price * item.quantity; // Ensure you're referencing the correct item
//     }, 0);

//     // Find the shipping address
//     const shippingAddress = await Address.findOne({
//       _id: addressId,
//       userId: req.user.id,
//     });

//     if (!shippingAddress) {
//       return res.status(404).json({ message: "Address not found." });
//     }

//     // Create a new order with the cart items
//     const order = new Order({
//       userId: req.user.id,
//       items: cart.items.map((item) => ({
//         productId: item.productId._id,
//         quantity: item.quantity,
//         price: item.productId.price,
//       })),
//       totalAmount,
//       shippingAddress,
//       orderStatus: "Pending",
//     });

//     // Save the order to the database
//     await order.save();

//     // Clear the cart after checkout
//     await Cart.deleteMany({ userId: req.user.id });

//     // Respond with a success message
//     res.status(201).json({ message: "Order placed successfully!", order });
//   } catch (error) {
//     console.error("Checkout error:", error.message);
//     res.status(500).json({ message: "Checkout process failed." });
//   }
// };
