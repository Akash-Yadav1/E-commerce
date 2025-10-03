import session from "express-session";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Homepage from "./models/Homepage.js";
import Product from "./models/Product.js";
import homepageRoutes from "./routes/homepage.js";
import User from "./models/User.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import slugify from "slugify"; // ✅ add this

// ✅ Fix: define __dirname FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public"), { index: false }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.set("view engine", "ejs");
app.use(express.json({ limit: "50mb" })); // important to parse JSON

// Session
app.use(
  session({
    secret: "electronicsSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// Force root (/) → login.html
app.get("/", (req, res) => {
  res.render("login");
});

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { full_name, email, password, confirm_password } = req.body;

    if (!full_name || !email || !password || !confirm_password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ full_name, email, password_hash: hash });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      redirect: "/home",
      user: { id: user._id, full_name: user.full_name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route: Homepage
app.get("/home", async (req, res) => {
  let homepage = await Homepage.findOne().sort({ createdAt: -1 });

  if (!homepage) {
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

app.use("/api/homepage", homepageRoutes);

// API: Get ALL homepage data
app.get("/api/homepage/all", async (req, res) => {
  try {
    const homepages = await Homepage.find().sort({ createdAt: -1 });
    res.json(homepages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Update homepage data (full replace)
app.put("/api/homepage/:id", async (req, res) => {
  try {
    const homepage = await Homepage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!homepage) {
      return res.status(404).json({ error: "Homepage not found" });
    }
    res.json(homepage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Delete ALL homepage data
app.delete("/api/homepage", async (req, res) => {
  try {
    const result = await Homepage.deleteMany({});
    res.json({
      message: "All homepage data deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Category Route
app.get("/category/:name", async (req, res) => {
  try {
    const category = req.params.name.toLowerCase();
    const products = await Product.find({ category });
    const brands = [...new Set(products.map((p) => p.brand))];
    res.render("category", { products, brands, category });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ✅ Bulk insert products with slug auto-generation
app.post("/api/products/bulk", async (req, res) => {
  try {
    const allProducts = req.body;

    if (!allProducts || Object.keys(allProducts).length === 0) {
      return res
        .status(400)
        .json({
          message: "Request body must contain categories with products",
        });
    }

    let inserted = [];
    for (const category in allProducts) {
      const products = allProducts[category].map((p) => ({
        name: p.name,
        brand: p.brand,
        price: p.price,
        img: p.img || "",
        oldPrice: p.oldPrice || null,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        prime: p.prime || false,
        category: category.toLowerCase(),
        slug: slugify(p.name, { lower: true, strict: true }), // ✅ auto slug
      }));

      const result = await Product.insertMany(products, { ordered: false });
      inserted = inserted.concat(result);
    }

    res.status(201).json({
      message: "✅ Products inserted successfully",
      count: inserted.length,
      inserted,
    });
  } catch (err) {
    console.error("Bulk insert error:", err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get products by category
app.get("/api/products/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const products = await Product.find({ category });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: `No products found in category: ${category}` });
    }

    const brands = [...new Set(products.map((p) => p.brand))];

    res.json({
      category,
      count: products.length,
      brands,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
