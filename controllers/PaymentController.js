const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { startSession } = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { createShipment } = require("../controllers/ShipmentController");

exports.verifyPayment = async (req, res) => {
    console.log("in verify payment")
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const session = await startSession(); // Start a session

  try {
    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature." });
    }

    session.startTransaction();

    order.orderStatus = "Paid";
    order.razorpayPaymentId = razorpayPaymentId;

    await order.save({ session });

    await session.commitTransaction();

    session.endSession();
    // console.log(order.shippingAddress)
    const user = await User.findById(order.userId);
    const shipmentData = {
      name: user.username,
      add:
        order.shippingAddress.addressLine1 +
        "," +
        order.shippingAddress.addressLine2,
      pin: order.shippingAddress.zipCode,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      country: order.shippingAddress.country,
      phone: order.shippingAddress.phoneNumber,
      order: order.id,
      payment_mode: "Prepaid",
      products_desc: order.items.map((p) => p.productId.name).join(", "), // Concatenate all product names
      order_date: order.createdAt.toISOString().split("T")[0],
      total_amount: order.totalAmount,
      quantity: order.items.length.toString(),
    };
     console.log(shipmentData)
    const shipmentResponse = await createShipment(shipmentData, order.id);
    
    res.status(200).json({
      success: true,
      message: "Payment verified successfully and shipment created.",
      order,
      shipment: shipmentResponse, // Return the shipment response
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();

    if (
      error.message.includes("Not enough stock") ||
      error.message.includes("Invalid payment signature")
    ) {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        product.stock += item.quantity;
        await product.save();
      }
    }

    console.error("Payment verification error:", error.message || error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed.",
      error: error.message,
    });
  }
};
