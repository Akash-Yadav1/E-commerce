import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema({
  title: { type: String, default: "GlobalMart USA" },
  heroHeadline: String,
  heroSub: String,
  heroSlides: [{ img: String, caption: String }],
  promoBanners: [{ img: String, caption: String }],
  categories: [{ img: String, name: String }],
  deals: [{ title: String, img: String, price: Number, oldPrice: Number }],
  bestSellers: [{ title: String, img: String, price: Number, oldPrice: Number }],
  newArrivals: [{ title: String, img: String, price: Number, oldPrice: Number }],
  trending: [{ title: String, img: String, price: Number, oldPrice: Number }],
  recommended: [{ title: String, img: String, price: Number, oldPrice: Number }],
  brands: [String],
  testimonials: [{ text: String, author: String }],
  footer: {
    about: String,
    shopLinks: [String],
    helpLinks: [String],
    companyLinks: [String],
    year: Number
  }
}, { timestamps: true });

export default mongoose.model("Homepage", homepageSchema);
