const Order = require("../models/Order")

exports.getAllOrder=async(req,res)=>{
    try{
    const orders = await Order.find()
    return res.status(200).json(orders);
    }
    catch(err){
        return res.status(400).json(err)
    }
}

exports.getOrder = async(req,res)=>{
    try{
      
      const orders = await Order.find({ userId: req.user.id });
      return res.status(200).json(orders);
    }catch(err){
        return res.status(400).json(err)
    }
}