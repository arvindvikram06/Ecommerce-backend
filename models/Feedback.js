const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  aspect: { type: String, required: true },
  description:{type:String,required: true}
});


module.exports = mongoose.model("Feedback",feedbackSchema);