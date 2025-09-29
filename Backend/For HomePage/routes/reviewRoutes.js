import express from "express";
import { getReviews } from "../controllers/reviewController";

const router = express.Router();

router.get("/", getReviews);

module.exports = router;
