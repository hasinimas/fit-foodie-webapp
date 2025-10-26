import express from "express";
import {
  logMeal,
  analyzeMeals,
  generateMealPlan,
  analyzeIngredients
} from "../controllers/mealController.js";

const router = express.Router();

router.post("/log", logMeal);
router.get("/analyze/:userId", analyzeMeals);
router.post("/generate-plan/:userId", generateMealPlan);
router.post("/analyze-ingredients", analyzeIngredients);

export default router;
