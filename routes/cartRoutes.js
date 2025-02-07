const express = require("express");
const router = express.Router();
const {
  addItemToCart,
  getCart,
  updateCartItem,
  removeItemFromCart,
} = require("../controllers/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, addItemToCart);

router.get("/get", authMiddleware, getCart);

router.put("/update", authMiddleware, updateCartItem);

router.post("/remove/:productId", authMiddleware, removeItemFromCart);

module.exports = router;
