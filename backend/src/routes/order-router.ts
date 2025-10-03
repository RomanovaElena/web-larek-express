import express from "express";
import { createOrder } from "../controllers/order-controller";
import { orderRouteValidator } from "../middlewares/validator";

const router = express.Router();

router.post("/", orderRouteValidator, createOrder);

export default router;
