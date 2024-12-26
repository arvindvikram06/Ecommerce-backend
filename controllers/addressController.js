const Address = require("../models/Address");


exports.addAddress = async (req, res) => {
  try {
    console.log(req.body)
    const newAddress = new Address({
      userId: req.user.id,
      ...req.body, 
    });
    await newAddress.save();
    res.json(newAddress);
  } catch (error) {
    console.error("Error adding address:", error.message);
    res.status(500).json({ message: "Failed to add address" });
  }
};


exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedAddress)
      return res.status(404).json({ message: "Address not found" });
    res.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error.message);
    res.status(500).json({ message: "Failed to update address" });
  }
};
