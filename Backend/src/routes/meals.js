import express from "express";
import {
  logMeal,
  analyzeMeals,
  generateMealPlan
} from "../controllers/mealController.js";

const router = express.Router();

router.post("/log", logMeal);
router.get("/analyze/:userId", analyzeMeals);
router.post("/generate-plan/:userId", generateMealPlan);

export default router;
