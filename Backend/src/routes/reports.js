// backend/src/routes/reports.js
import express from "express";
import { generateMealPlanReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/meal-plan/:userId", generateMealPlanReport);

export default router;
  