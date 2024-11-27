const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  weight: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  ingredients: [{ type: String }], 
  benefits: [{ title: { type: String }, description: { type: String } }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
