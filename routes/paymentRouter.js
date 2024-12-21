const express = require("express");
const crypto = require("crypto");
const Order = require("../models/Order");
const RAZORPAY_KEY_SECRET = "fZH6ibOfpW3YQjBimBou6w8q";
const router = express.Router();
const Cart = require("../models/Cart.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");

router.post("/",authMiddleware,async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
   
  try {
  
    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      console.log("Order not found in database for Razorpay Order ID:", razorpayOrderId);
      return res.status(404).json({ message: "Order not found." });}

    
    const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest("hex");

  
    console.log("Generated Signature:", generatedSignature);

    if (generatedSignature !== razorpaySignature) {
       
      return res.status(400).json({ message: "Invalid payment signature." });
    }

   
    order.orderStatus = "Paid";
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();
    
    await Cart.deleteMany({ userId: req.user.id });
    
    res.status(200).json({ message: "Payment verified and order completed.", order });
  } catch (error) {
    console.error("Payment verification error:", error.message);
    res.status(500).json({ message: "Payment verification failed." });
  }
});

module.exports = router;
