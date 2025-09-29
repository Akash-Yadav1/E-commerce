import Category from "../models/Category";

exports.getCategories = async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
};
