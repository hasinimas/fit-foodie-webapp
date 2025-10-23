// Backend/src/services/mealPlanAI.js
import dotenv from "dotenv";
import { GoogleGenAI } from '@google/genai'; // Import the Google Gen AI SDK

dotenv.config();

// Initialize the AI client
// The SDK automatically looks for the GEMINI_API_KEY in process.env
const ai = new GoogleGenAI({}); 

export const generateAIPlan = async (userId, onboarding = {}) => {
  const prompt = `
You are a health and nutrition planner.
Generate a 7-day meal plan in strict JSON format (no markdown, no extra text).
Each day should include: breakfast, lunch, snack, and dinner with title, description, calories, and protein.
Format exactly as:
{
  "days": [
    { "day": "Monday", "meals": { "breakfast": {...}, "lunch": {...}, "snack": {...}, "dinner": {...} } },
    ...
  ]
}

User goal: ${onboarding.goal || "balanced"}
Preferences: ${onboarding.preferences || "none"}
Avoid: ${onboarding.restrictions || "none"}
Calories target per day: around 2000.
`;

  try {
    // Use the SDK to call the API, which handles the correct URL
    console.log("--- Attempting Gemini API Call ---");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Specify the model name
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      config: { temperature: 0.7 }
    });

    // The response object from the SDK is cleaner
    const text = response.text; 

    if (!text) {
      return { error: "AI plan unavailable", raw: "No response" };
    }

    // Remove markdown if Gemini wraps output in ```json ... ```
    const cleaned = text.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ Gemini returned invalid JSON:", text);
      return { error: "AI plan unavailable", raw: text };
    }

  } catch (err) {
    // This will now catch any network or API key errors
    console.error("❌ Error calling Gemini API:", err.message || err);
    return { error: "AI plan unavailable", raw: err.message || err };
  }
};

