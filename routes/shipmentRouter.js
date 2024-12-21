const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createShipment } = require("../controllers/ShipmentController");

const router = express.Router();


router.post("/",authMiddleware,createShipment)

module.exports = router