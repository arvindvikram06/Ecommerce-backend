const axios = require("axios");
const Warehouse = require("../models/Warehouse");
const Order = require("../models/Order");
const currentWarehouse = require("../models/currentWarehouse");

exports.createShipment = async (shipmentData, order_id) => {
  // console.log("in shipment")
  try {
    const currentware = await Warehouse.findOne({})

    const warehouse = await Warehouse.findOne({ name: currentware.name });
    if (!warehouse) {
      throw new Error("Warehouse not found.");
    }

    
    const order1 = await Order.findById(order_id); 
    if (!order1) {
      throw new Error("Order not found.");
    }

    const shipments = [
      {
        ...shipmentData,
        return_pin: warehouse.pin,
        return_city: warehouse.city,
        return_phone: warehouse.phone,
        return_add: warehouse.return_address,
        return_state: warehouse.state,
        return_country: warehouse.country,
        shipment_width: "5",
        shipment_height: "5",
        weight: "0.5",
        shipping_mode: "Surface",
      },
    ];

    const payload = `format=json&data=${JSON.stringify({
      shipments,
      pickup_location: {
        name: warehouse.name,
        add: warehouse.address,
        city: warehouse.city,
        pin_code: warehouse.pin,
        country: warehouse.country,
        phone: warehouse.phone,
      },
    })}`;

    // Make API request
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
    //  console.log(response.data.packages);
  
    const waybill = response.data?.packages?.[0]?.waybill;
    if (!waybill) {
      throw new Error("Waybill not found in response.");
    }
    order1.waybill = waybill;
    console.log(response.data.packages);
    // console.log(waybill)
    // console.log(order1)
    await order1.save(); 
    return response.data;
  } catch (error) {
    console.error(
      "Error creating shipment:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};
