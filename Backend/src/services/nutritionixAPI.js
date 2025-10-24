import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const analyzeWithNutritionix = async (query) => {
  const res = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": process.env.NUTRITIONIX_APP_ID,
      "x-app-key": process.env.NUTRITIONIX_APP_KEY,
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
};
