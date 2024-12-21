const express = require("express")
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware")
const { createFeedback, getFeedback } = require("../controllers/feedbackController")

const router = express.Router()

router.post("/add",authMiddleware,createFeedback)
router.get("/",authMiddleware,adminMiddleware,getFeedback)

module.exports = router