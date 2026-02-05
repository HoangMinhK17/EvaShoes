import express from "express";
import { createOrder, getOrderById, getOrders, updateOrder, deleteOrder, getOrdersByUser, searchOrders, updateStatusOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/orders/", createOrder);
router.get("/orders/:id", getOrderById);
router.get("/orders", getOrders);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);
router.get("/orders/user/:id", getOrdersByUser);
router.get("/orders/search/:query", searchOrders);
router.put("/orders/updateStatus/:id", updateStatusOrder);

export default router;