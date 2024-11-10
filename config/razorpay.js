const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_MSDRKXkHnptMYU",
  key_secret: "fZH6ibOfpW3YQjBimBou6w8q",
});

module.exports = razorpayInstance;
