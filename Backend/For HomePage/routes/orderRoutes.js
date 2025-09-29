import express from "express";
import { getOrders } from "../controllers/orderController";
const router = express.Router();

router.get("/", getOrders);

export default router;
