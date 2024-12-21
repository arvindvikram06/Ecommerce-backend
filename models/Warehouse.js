const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  pin: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  return_address: { type: String, required: true },
  return_pin: { type: String, required: true },
});

module.exports = mongoose.model("Warehouse", warehouseSchema);
