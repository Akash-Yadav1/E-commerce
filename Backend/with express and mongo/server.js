import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Homepage from "./models/Homepage.js";
import homepageRoutes from "./routes/homepage.js";
import cors from "cors";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json()); // important to parse JSON

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// Route: Homepage
app.get("/", async (req, res) => {
  let homepage = await Homepage.findOne().sort({ createdAt: -1 });

  if (!homepage) {
    // default values
    homepage = {
      title: "GlobalMart USA",
      heroHeadline: "Shop the World",
      heroSub: "Delivered to your door",
      heroSlides: [],
      promoBanners: [],
      categories: [],
      deals: [],
      bestSellers: [],
      newArrivals: [],
      trending: [],
      recommended: [],
      brands: [],
      testimonials: [],
      footer: {
        about: "GlobalMart USA — your favorite online store.",
        shopLinks: [],
        helpLinks: [],
        companyLinks: [],
        year: new Date().getFullYear(),
      },
    };
  }

  res.render("index", { homepage });
});

app.use("/api/homepage", homepageRoutes); // ✅ this is your POST/GET route

// API: Insert homepage data (for testing)
app.post("/api/homepage", async (req, res) => {
  try {
    const homepage = new Homepage(req.body);
    await homepage.save();
    res.json(homepage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
