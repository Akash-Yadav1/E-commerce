import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
};
