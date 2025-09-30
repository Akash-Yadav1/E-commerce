import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema({
  title: { type: String, default: "GlobalMart USA — Shop the World" },
  heroHeadline: {
    type: String,
    default: "Shop the World — Delivered in the USA",
  },
  heroSub: {
    type: String,
    default: "Explore 10M+ global products with fast US shipping.",
  },
  promoBanners: [
    {
      image: String,
      caption: String,
    },
  ],
  categories: [
    {
      name: String,
      image: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Homepage = mongoose.model("Homepage", homepageSchema);

export default Homepage;

// const mongoose = require("mongoose");

// const homepageSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   location: { type: String, default: "USA" },
//   image: { type: String }, // optional image url
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Homepage", homepageSchema);
