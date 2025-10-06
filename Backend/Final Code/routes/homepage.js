import express from "express";
import Homepage from "../models/Homepage.js";

const router = express.Router();

// GET homepage
router.get("/", async (req, res) => {
  try {
    const homepage = await Homepage.findOne();
    res.json(homepage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST homepage
router.post("/", async (req, res) => {
  try {
    const homepage = new Homepage(req.body);
    await homepage.save();
    res.status(201).json(homepage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;  // ✅ default export
