const axios = require("axios");
const Warehouse = require("../models/Warehouse");
const currentWarehouse = require("../models/currentWarehouse");

const DELHIVERY_API_TOKEN = process.env.DELHIVERY_SECRET;

const DELHIVERY_WAREHOUSE_URL =
  "https://staging-express.delhivery.com/api/backend/clientwarehouse/create/";

const createDelhiveryWarehouse = async (warehouseData) => {
  try {
    const response = await axios.post(
      DELHIVERY_WAREHOUSE_URL,
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
    // console.log(delhiveryResponse)
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

exports.selectWareHouse = async(req,res) =>{
  try{
    const {name} = req.body
    const warehouse = await Warehouse.findOne({name:name})
    if(warehouse){
        const ware = await currentWarehouse.deleteMany({})
        const currWare = new currentWarehouse({ name: name });
          currWare.save();
          return res.status(200).json({ message: "selected successfully" });
    }
    else{
      return res.status(400).json({message:"Warehouse Not exists,create a warehouse and try it"})
    }
   
  }catch(err){
    return res.status(500).json("could select due to error" + err.message);
  }
    
}