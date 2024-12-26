const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const currentWareHouse = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("currentWareHouse",currentWareHouse)
