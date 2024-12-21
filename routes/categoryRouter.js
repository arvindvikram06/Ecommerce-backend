const express = require("express")
const { adminMiddleware, authMiddleware } = require("../middlewares/authMiddleware")
const { addCategory, deleteCategory } = require("../controllers/categoryController")

const router = express.Router()

router.post("/",authMiddleware,adminMiddleware,addCategory)
router.delete("/", authMiddleware, adminMiddleware, deleteCategory);
module.exports = router