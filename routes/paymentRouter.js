const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const { verifyPayment } = require("../controllers/PaymentController");

const router = express.Router()


router.post("/verify-payment",authMiddleware,verifyPayment)


module.exports = router