const express = require("express");
const {
  addAddress,
  getAddresses,
  updateAddress,
} = require("../controllers/addressController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addAddress);

router.get("/", authMiddleware, getAddresses);

router.put("/:id", authMiddleware, updateAddress);

module.exports = router;
