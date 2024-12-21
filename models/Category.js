const mongoose = require("mongoose")

const catogorySchema = new mongoose.Schema({
    name:{type: String}
})

module.exports = mongoose.model("Category",catogorySchema)