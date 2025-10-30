// src/controllers/mealController.js
import { db } from "../config/firebase.js";
import { generateAIPlan } from "../services/mealPlanAI.js";
import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";

// optional Nutritionix helper (keep for backward compatibility)
const callNutritionix = async (query) => {
  const url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
  if (!process.env.NUTRITIONIX_APP_ID || !process.env.NUTRITIONIX_APP_KEY) {
    const e = new Error("Missing Nutritionix keys");
    e.code = "NO_NUTRITIONIX";
    throw e;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": process.env.NUTRITIONIX_APP_ID,
      "x-app-key": process.env.NUTRITIONIX_APP_KEY,
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

// USDA helpers (import local service)
import { searchFoodsUSDA, getSimpleNutritionFromUSDAItems } from "../services/usdaAPI.js";

/**
 * Try Nutritionix first (if configured); if it fails or is rate-limited/broken,
 * fall back to USDA FoodData Central. This keeps the exact frontend contract.
 */
const analyzeQueryWithFallback = async (query) => {
  // 1) Try Nutritionix if keys present
  if (process.env.NUTRITIONIX_APP_ID && process.env.NUTRITIONIX_APP_KEY) {
    try {
      const { ok, status, data } = await callNutritionix(query);
      if (ok && data && Array.isArray(data.foods) && data.foods.length) {
        // map to simple totals using Nutritionix fields if present
        const totalCalories = data.foods.reduce((a, f) => a + (f.nf_calories || 0), 0);
        const totalProtein = data.foods.reduce((a, f) => a + (f.nf_protein || 0), 0);
        const totalCarbs = data.foods.reduce((a, f) => a + (f.nf_total_carbohydrate || 0), 0);
        const totalFat = data.foods.reduce((a, f) => a + (f.nf_total_fat || 0), 0);

        return {
          source: "nutritionix",
          totals: { calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fats: totalFat },
          raw: data,
        };
      }

      // If Nutritionix responded but no foods or non-ok, throw to fall back.
      const err = new Error("Nutritionix returned empty or error");
      err.details = { status, data };
      throw err;
    } catch (err) {
      console.warn("Nutritionix fallback:", err?.message || err, err?.details || "");
      // continue to USDA fallback
    }
  }

  // 2) Fallback to USDA
  try {
    // We'll search USDA using the query; USDA returns multiple items — approximate totals from first hits
    const items = await searchFoodsUSDA(query); // may throw on auth/quota
    if (!items || items.length === 0) {
      throw new Error("USDA returned no results");
    }
    const totals = getSimpleNutritionFromUSDAItems(items);
    return { source: "usda", totals: { calories: totals.calories, protein: totals.protein, carbs: totals.carbs, fats: totals.fat }, raw: items };
  } catch (err) {
    // bubble meaningful error up
    const e = new Error("External nutrition API failed");
    e.original = err;
    throw e;
  }
};

// Log a meal
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
      message: `${mealType} logged successfully! Log breakfast, lunch & dinner to analyze.`,
    });
  } catch (err) {
    console.error("logMeal error:", err);
    res.status(500).json({ error: "Failed to log meal." });
  }
};

// Analyze nutrition using Nutritionix (with USDA fallback)
export const analyzeMeals = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "Missing userId." });

    const mealSnap = await db
      .collection("users")
      .doc(userId)
      .collection("meals")
      .orderBy("createdAt", "desc")
      .get();

    const meals = mealSnap.docs.map((d) => d.data());

    if (meals.length < 3) {
      return res.json({
        message: `🍽 Logged ${meals.length} meals. Need 3 to analyze.`,
        meals,
      });
    }

    // Combine all meal texts into one natural query for Nutritionix / USDA search
    const allFoods = meals.map((m) => m.mealText).join(", ");

    // analyze via Nutritionix -> fallback USDA
    const result = await analyzeQueryWithFallback(allFoods);

    // result.totals contains raw numeric totals; format for frontend
    const totals = result.totals;
    const analysis = {
      totalMeals: meals.length,
      calories: Number(totals.calories || 0).toFixed(1),
      protein: Number(totals.protein || 0).toFixed(1),
      carbs: Number(totals.carbs || 0).toFixed(1),
      fats: Number(totals.fats || 0).toFixed(1),
      source: result.source, // helpful for debugging (frontend can ignore)
    };

    // write rounded integers to dailySummaries (non-fatal)
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const dayRef = db.collection("users").doc(userId).collection("dailySummaries").doc(today);

      // Filter only today's meals using ISO string matching
      const todaysMeals = meals.filter((m) => {
        if (!m.createdAt) return false;

        let mealDate;
        if (typeof m.createdAt === "string") {
          mealDate = m.createdAt.split("T")[0];
        } else if (m.createdAt && m.createdAt._seconds) {
          mealDate = new Date(m.createdAt._seconds * 1000).toISOString().split("T")[0];
        } else if (m.createdAt && typeof m.createdAt.toDate === "function") {
          mealDate = m.createdAt.toDate().toISOString().split("T")[0];
        }
        return mealDate === today;
      });

      const mealDescriptions = todaysMeals.map((m) => `${m.mealType}: ${m.mealText}`).join("\n");

      await dayRef.set(
        {
          date: today,
          description: mealDescriptions,
          totals: {
            calories: Math.round(Number(analysis.calories || 0)),
            protein: Math.round(Number(analysis.protein || 0)),
            carbs: Math.round(Number(analysis.carbs || 0)),
            fats: Math.round(Number(analysis.fats || 0)),
          },
          analysisCreatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (writeErr) {
      console.error("Warning: failed to save daily summary totals:", writeErr);
    }

    // respond (keeps the same API contract)
    res.json({ message: "Nutrition analysis ready!", analysis, meals });
  } catch (err) {
    console.error("Analyze Meals Error:", err);
    // If wrapped external error, show helpful message without exposing secrets
    const details = err?.original?.message || err?.message || "Unknown";
    res.status(500).json({ error: "Nutrition analysis failed.", details });
  }
};

// Generate AI meal plan (unchanged)
export const generateMealPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId." });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    const onboarding = userDoc.data()?.onboarding || {};

    const plan = await generateAIPlan(userId, onboarding);

    if (!plan || plan.error) {
      return res.json({
        message: "⚠ Gemini returned empty or invalid plan.",
        plan,
      });
    }

    await db.collection("users").doc(userId).collection("mealPlans").add({
      plan,
      createdAt: new Date().toISOString(),
    });

    res.json({
      message: "AI Meal Plan Generated!",
      plan,
    });
  } catch (err) {
    console.error("❌ Error generating meal plan:", err.message || err);
    return res.status(500).json({ error: err.message || "Meal plan generation failed." });
  }
};

// Analyze ingredients route — uses Nutritionix if available, else USDA search
export const analyzeIngredients = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query parameter." });

    // Try Nutritionix first
    if (process.env.NUTRITIONIX_APP_ID && process.env.NUTRITIONIX_APP_KEY) {
      try {
        const { ok, status, data } = await callNutritionix(query);
        if (ok && data && Array.isArray(data.foods) && data.foods.length) {
          return res.json({ foods: data.foods });
        }
        // if nutritionix returned ok but no foods -> fallthrough to USDA
        console.warn("Nutritionix returned no foods for analyzeIngredients:", status, data);
      } catch (err) {
        console.warn("Nutritionix error in analyzeIngredients, falling back to USDA:", err?.message || err);
      }
    }

    // USDA fallback: search and return simplified items
    const items = await searchFoodsUSDA(query);
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No ingredients found.", data: items });
    }

    // normalize a few fields so frontend can still iterate (fdcId, description, foodNutrients)
    const simplified = items.map((it) => ({
      fdcId: it.fdcId,
      description: it.description || it.lowercaseDescription || "",
      brandOwner: it.brandOwner || null,
      foodNutrients: it.foodNutrients || [],
    }));

    res.json({ foods: simplified });
  } catch (err) {
    console.error("Error analyzing ingredients:", err);
    res.status(500).json({ error: "Failed to analyze ingredients.", details: err?.message || err });
  }
};
