import mongoose from "mongoose";
import dotenv from "dotenv";
import Homepage from "./models/Homepage.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Homepage.deleteMany(); // clear old data

  await Homepage.create({
    title: "GlobalMart USA — Shop the World",
    heroHeadline: "Shop the World — Delivered in the USA",
    heroSub: "Explore 10M+ global products with fast US shipping, secure payments, and 24/7 support.",
    promoBanners: [
      { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600", caption: "🎉 Mega Sale – Up to 50% Off" }
    ],
    heroSlides: [
      { img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600", caption: "Flagship Phones" }
    ],
    categories: [
      { name: "Phones", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=300" }
    ],
    deals: [
      { title: "Noise Cancelling Headphones", price: 199, oldPrice: 299, rating: 4.5, img: "https://picsum.photos/seed/deal1/480/480" }
    ],
    bestSellers: [],
    newArrivals: [],
    trending: [],
    recommended: [],
    brands: ["Nike", "Adidas", "Apple"],
    testimonials: [
      { text: "Amazing service! Got my shoes from Italy in just 5 days!", author: "Alex" }
    ],
    footer: {
      about: "Your gateway to global shopping.",
      shopLinks: ["Electronics", "Home & Kitchen", "Fashion"],
      helpLinks: ["Shipping", "Returns", "Support"],
      companyLinks: ["About", "Careers", "Affiliates"],
      year: new Date().getFullYear()
    }
  });

  console.log("✅ Database seeded!");
  process.exit();
};

seed();
