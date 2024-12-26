const express = require("express");
const { getOrder, getAllOrder } = require("../controllers/orderController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router()


router.get("/get",authMiddleware,getOrder)
router.get("/getAll", authMiddleware,adminMiddleware,getAllOrder);

module.exports = router