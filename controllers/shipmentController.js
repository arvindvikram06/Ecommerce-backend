const axios = require("axios");

exports.createShipment = async (req, res) => {
  try {
    const { shipments, pickup_location } = req.body;

    const payload = `format=json&data=${JSON.stringify({
      shipments,
      pickup_location,
    })}`;

    
    const response = await axios.post(
      "https://staging-express.delhivery.com/api/cmu/create.json",
      payload, 
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", 
          Accept: "application/json",
          Authorization: `Token ${process.env.DELHIVERY_SECRET}`, 
        },
      }
    );

   
    res.status(200).json({
      success: true,
      message: "Shipment created successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error creating shipment:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to create shipment",
      error: error.response?.data || error.message,
    });
  }
};
