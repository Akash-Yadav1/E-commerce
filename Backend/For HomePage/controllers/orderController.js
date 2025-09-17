const Order = require("../models/Order");


exports.getOrders = async (req, res) => {
const orders = await Order.find().populate("user");
res.json(orders);
};