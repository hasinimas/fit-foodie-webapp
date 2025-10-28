// src/services/usdaAPI.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const USDA_BASE = "https://api.nal.usda.gov/fdc/v1";

/**
 * Search USDA food database for a text query.
 * Returns parsed JSON (items array) or throws an error with useful info.
 */
export const searchFoodsUSDA = async (query) => {
  if (!process.env.USDA_API_KEY) {
    throw new Error("Missing USDA_API_KEY in environment");
  }

  const url = `${USDA_BASE}/foods/search?api_key=${process.env.USDA_API_KEY}&query=${encodeURIComponent(
    query
  )}&pageSize=10`;

  const res = await fetch(url, { method: "GET" });
  const data = await res.json();

  if (!res.ok) {
    const msg = data?.message || JSON.stringify(data);
    const err = new Error(`USDA search failed: ${msg}`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  // data.foods is the array of matches
  return data.foods || [];
};

/**
 * Take USDA "foods" items and compute a simple aggregated nutrition object.
 * We only extract the nutrients we need: energy (kcal), protein, carbs, fat.
 * USDA nutrient ids vary so we'll match by nutrient name.
 *
 * Returns: { calories: number, protein: number, carbs: number, fat: number }
 */
export const getSimpleNutritionFromUSDAItems = (items = []) => {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // helper to read nutrient by name (case-insensitive)
  const findNutrientValue = (nutrients, names) => {
    if (!Array.isArray(nutrients)) return 0;
    const n = nutrients.find((x) =>
      String(x.nutrientName || "").toLowerCase().includes(names)
    );
    if (!n) return 0;
    // nutrient value usually per 100g or per serving, but USDA search results include "value"
    return Number(n.value || 0);
  };

  for (const item of items) {
    const nutrients = item.foodNutrients || item.foodNutrients || [];

    // Energy: look for "Energy" or "Energy (kcal)"
    const kcal = findNutrientValue(nutrients, "energy") || findNutrientValue(nutrients, "kcal");
    const protein = findNutrientValue(nutrients, "protein");
    const carbs = findNutrientValue(nutrients, "carbohydrate");
    const fat = findNutrientValue(nutrients, "total lipid");

    totals.calories += Number(kcal || 0);
    totals.protein += Number(protein || 0);
    totals.carbs += Number(carbs || 0);
    totals.fat += Number(fat || 0);
  }

  return totals;
};
