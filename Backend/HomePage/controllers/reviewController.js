import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
  const reviews = await Review.find().populate("user");
  res.json(reviews);
};
