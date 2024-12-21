const express = require("express");
const { createWarehouse } = require("../controllers/adminController");
const { adminMiddleware, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/warehouses",authMiddleware,adminMiddleware,createWarehouse)

module.exports = router
