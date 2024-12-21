const axios = require("axios");
const Warehouse = require("../models/Warehouse");




const DELHIVERY_API_TOKEN = "0368e03c66b1fc26848d7d4bed4798c45de2b3cf";

const DELHIVERY_API_URL =
  "https://staging-express.delhivery.com/api/backend/clientwarehouse/create/";

const createDelhiveryWarehouse = async (warehouseData) => {
  try {
    const response = await axios.post(
      DELHIVERY_API_URL,
      {
        phone: warehouseData.phone,
        city: warehouseData.city,
        name: warehouseData.name,
        pin: warehouseData.pin,
        address: warehouseData.address,
        country: warehouseData.country,
        email: warehouseData.email,
        registered_name: warehouseData.registered_name,
        return_address: warehouseData.return_address,
        return_pin: warehouseData.return_pin,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${DELHIVERY_API_TOKEN}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating warehouse with Delhivery:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error integrating with Delhivery API");
  }
};


exports.createWarehouse = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      pin,
      city,
      state,
      country,
      return_address,
      return_pin,
    } = req.body;

    
    const newWarehouse = new Warehouse({
      name,
      phone,
      email,
      address,
      pin,
      city,
      state,
      country,
      return_address,
      return_pin,
    });

   

    
    const delhiveryResponse = await createDelhiveryWarehouse(req.body);
    console.log(delhiveryResponse)
     const savedWarehouse = await newWarehouse.save();

    
    savedWarehouse.delhiveryWarehouseId = delhiveryResponse.id;
    await savedWarehouse.save();

 
    res.status(201).json(savedWarehouse);
  } catch (error) {
    console.error("Error creating warehouse:", error.message);
    res
      .status(500)
      .json({ message: "Error creating warehouse", error: error.message });
  }
};
