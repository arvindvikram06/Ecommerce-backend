const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const cors = require("cors");
const authRouter = require("./routes/authRoutes.js");
const productRouter = require("./routes/productRoutes.js");
const cartRouter = require("./routes/cartRoutes.js")
const addressRoutes = require("./routes/addressRouter.js");
const checkoutRoutes = require("./routes/checkoutRouter.js");
const paymentRoutes = require("./routes/paymentRouter.js")
const categoryRoutes = require("./routes/categoryRouter.js")
const feedbackRoutes = require("./routes/feedbackRouter.js")
const adminRouters = require("./routes/adminRoutes.js")
const shipmentRouters = require("./routes/shipmentRouter.js")
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.get("/test", (req, res) => res.send("Test route working"));

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/address", addressRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/checkout",checkoutRoutes)
app.use("/api/verify-payment",paymentRoutes)
app.use("/api/admin",adminRouters)
app.use("/api/shipments",shipmentRouters)
// app.use("/api/orders", require("./routes/orderRoutes"));
// app.use("/api/payments", require("./routes/paymentRoutes"));

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    console.error("Server error:", err);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});
