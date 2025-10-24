import { db } from "../config/firebase.js";
import { generateAIPlan } from "../services/mealPlanAI.js";
import { analyzeWithNutritionix } from "../services/nutritionixAPI.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Log a meal
export const logMeal = async (req, res) => {
  try {
    const { userId, mealType, mealText } = req.body;
    if (!userId || !mealType || !mealText)
      return res.status(400).json({ error: "Missing required fields." });

    await db.collection("users").doc(userId).collection("meals").add({
      mealType,
      mealText,
      createdAt: new Date().toISOString(),
    });

    res.json({
      message: ` ${mealType} logged successfully! Log breakfast, lunch & dinner to analyze.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log meal." });
  }
};

// Analyze nutrition using Nutritionix API
export const analyzeMeals = async (req, res) => {
  try {
    const { userId } = req.params;
    const mealSnap = await db
      .collection("users")
      .doc(userId)
      .collection("meals")
      .orderBy("createdAt", "desc")
      .get();

    const meals = mealSnap.docs.map((d) => d.data());
    if (meals.length < 3)
      return res.json({
        message: `🍽️ Logged ${meals.length} meals. Need 3 to analyze.`,
        meals,
      });

    const allFoods = meals.map((m) => m.mealText).join(", ");
    const url = "https://trackapi.nutritionix.com/v2/natural/nutrients";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": process.env.NUTRITIONIX_APP_ID,
        "x-app-key": process.env.NUTRITIONIX_APP_KEY,
      },
      body: JSON.stringify({ query: allFoods }),
    });

    const data = await response.json();
    if (!data.foods) throw new Error("Nutritionix failed.");

    const totalCalories = data.foods.reduce((a, f) => a + f.nf_calories, 0);
    const totalProtein = data.foods.reduce((a, f) => a + f.nf_protein, 0);
    const totalCarbs = data.foods.reduce((a, f) => a + f.nf_total_carbohydrate, 0);
    const totalFat = data.foods.reduce((a, f) => a + f.nf_total_fat, 0);

    const analysis = {
      totalMeals: meals.length,
      calories: totalCalories.toFixed(1),
      protein: `${totalProtein.toFixed(1)}`,
      carbs: `${totalCarbs.toFixed(1)}`,
      fats: `${totalFat.toFixed(1)}`,
    };

    res.json({ message: " Nutrition analysis ready!", analysis, meals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nutrition analysis failed." });
  }
};

//  Generate AI meal plan via Gemini API (with Firestore safety fix)
export const generateMealPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId." });
    }

    // Get onboarding preferences if available
    const userDoc = await db.collection("users").doc(userId).get();
    const onboarding = userDoc.data()?.onboarding || {};

    // Generate 7-day plan from Gemini
    const plan = await generateAIPlan(userId, onboarding);

    // If Gemini failed, DO NOT save to Firestore
    if (!plan || plan.error) {
      return res.json({
        message: "⚠️ Gemini returned empty or invalid plan.",
        plan,
      });
    }

    // ✅ Save only valid plan to Firestore
    await db.collection("users").doc(userId).collection("mealPlans").add({
      plan,
      createdAt: new Date().toISOString(),
    });

    res.json({
      message: "✅ AI Meal Plan Generated!",
      plan,
    });

  } catch (err) {
    console.error("❌ Error generating meal plan:", err.message || err);
    return res.status(500).json({ error: err.message || "Meal plan generation failed." });
  }
};
