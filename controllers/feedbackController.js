const Feedback = require("../models/Feedback");


exports.createFeedback = async(req,res) =>{
    try{
        const {userId,aspect,description} = req.body;
        const feedback = new Feedback({
            userId,
            aspect,
            description
        })
        await feedback.save();
        return res.status(200).json({message:"feedback posted successfully"})
    }catch(error){
        return res.status(400).json({message:"could not post feedback",error})
    }
}
exports.getFeedback = async (req, res) => {
  try {
     const feedbacks = await Feedback.find();
    return res.status(200).json(feedbacks);
  } catch (error) {
    return res.status(400).json({ message: "could not fetch feedback"})
  }
};