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
  getProduct
} = require("../controllers/productController");

router.post("/add", authMiddleware, adminMiddleware, addProduct);

router.get("/", getAllProducts);

router.get("/:id", getProduct);


// Route to update product quantity (Admin only)
router.put(
  "/:productId",
  authMiddleware,
  adminMiddleware,
  updateProductQuantity
);

module.exports = router;
