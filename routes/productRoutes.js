const express = require("express");
const router = express.Router();

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const {
  addProduct,
  getAllProducts,
  updateProductQuantity,
} = require("../controllers/productController");

router.post("/add", authMiddleware, adminMiddleware, addProduct);

router.get("/", getAllProducts);

// Route to update product quantity (Admin only)
router.put(
  "/:productId",
  authMiddleware,
  adminMiddleware,
  updateProductQuantity
);

module.exports = router;
