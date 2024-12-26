const express = require("express");
const { createWarehouse, selectWareHouse } = require("../controllers/warehouseController");
const { adminMiddleware, authMiddleware } = require("../middlewares/authMiddleware");
const { createPickupreq } = require("../controllers/adminController");
const router = express.Router();

router.post("/warehouse",authMiddleware,adminMiddleware,createWarehouse)
router.post("/warehouse/current", authMiddleware, adminMiddleware, selectWareHouse);
router.post("/pickupRequest",authMiddleware,adminMiddleware,createPickupreq)
module.exports = router
