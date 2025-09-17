const Review = require("../models/Review");


exports.getReviews = async (req, res) => {
const reviews = await Review.find().populate("user");
res.json(reviews);
};