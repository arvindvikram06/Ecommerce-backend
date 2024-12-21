const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: { type: String, required: true },
  weight: [{ type: String, required: true, unique: true }],
  category: { type: String, required: true },
  price: [{ type: Number, required: true, unique: true }],
  quantity: { type: Number, required: true },
  ingredients: [{ type: String, required: true }],
  benefits: [{ title: { type: String }, description: { type: String } }],
  totalSales: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
