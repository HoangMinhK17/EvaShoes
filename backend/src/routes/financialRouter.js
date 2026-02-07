import express from "express";
import { getFinancials } from "../controllers/financialController.js";

const router = express.Router();

router.get("/financials", getFinancials);

export default router;
