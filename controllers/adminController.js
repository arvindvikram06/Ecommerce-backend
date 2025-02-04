const axios = require("axios");

const DELHIVERY_PICKUP_URL =
  "";

exports.createPickupreq = async (req, res) => {
  const { pickup_time, pickup_date, pickup_location, expected_package_count } =
    req.body;

  if (
    !pickup_time ||
    !pickup_date ||
    !pickup_location ||
    !expected_package_count
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pickResponse = await axios.post(
      DELHIVERY_PICKUP_URL,
      {
        pickup_time,
        pickup_date,
        pickup_location,
        expected_package_count,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${process.env.DELHIVERY_SECRET}`,
        },
      }
    );

    console.log("Pickup Response:", pickResponse.data);
    return res
      .status(200)
      .json({
        message: "Pickup request created successfully",
        data: pickResponse.data,
      });
  } catch (err) {
    console.error("Error while creating pickup request:", err.message);
    return res
      .status(400)
      .json({ message: `Error while creating request: ${err.message}` });
  }
};
