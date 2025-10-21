import { db } from "../config/firebase.js";
import { generateAIPlan } from "../services/mealPlanAI.js";

//  Log a user meal (breakfast/lunch/dinner)
export const logMeal = async (req, res) => {
  try {
    const { userId, mealType, mealText } = req.body;

    if (!userId || !mealType || !mealText) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Save meal to Firestore
    await db.collection("users").doc(userId).collection("meals").add({
      mealType,
      mealText,
      createdAt: new Date().toISOString(),
    });

    return res.json({
      message: `✅ ${mealType} logged successfully! Please log at least 3 meals (breakfast, lunch, dinner) before analyzing.`,
    });
  } catch (err) {
    console.error("Error logging meal:", err);
    res.status(500).json({ error: "Failed to log meal." });
  }
};

// Analyze user's logged meals (show nutrition only after 3 meals)
export const analyzeMeals = async (req, res) => {
  try {
    const { userId } = req.params;
    const mealSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("meals")
      .orderBy("createdAt", "desc")
      .get();

    const meals = mealSnapshot.docs.map(doc => doc.data());

    if (meals.length < 3) {
      return res.json({
        message:
          `🍽️ You've logged ${meals.length} meals. Please log at least 3 (breakfast, lunch, dinner) to view your nutrition analysis.`,
        meals,
      });
    }

    // Simple nutrition summary simulation (for demo)
    const analysis = {
      totalMeals: meals.length,
      avgCalories: 1450,
      protein: "55g",
      carbs: "160g",
      fats: "40g",
    };

    return res.json({
      message: "✅ Nutrition Analysis Ready",
      analysis,
      meals,
    });
  } catch (err) {
    console.error("Error analyzing meals:", err);
    res.status(500).json({ error: "Failed to analyze meals." });
  }
};

//  Generate AI-based weekly meal plan
export const generateMealPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "Missing userId." });

    const plan = await generateAIPlan(userId);

    await db
      .collection("users")
      .doc(userId)
      .collection("mealPlans")
      .add({
        plan,
        createdAt: new Date().toISOString(),
      });

    return res.json({
      message: "✅ AI Meal Plan generated successfully!",
      plan,
    });
  } catch (err) {
    console.error("Error generating AI plan:", err);
    res.status(500).json({ error: "Failed to generate meal plan." });
  }
};
