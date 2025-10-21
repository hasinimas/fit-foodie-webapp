import dotenv from "dotenv";
dotenv.config(); // ✅ Load env before anything else

import OpenAI from "openai";
import { db } from "../config/firebase.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ Will now be available
});

export const generateAIPlan = async (userId) => {
  const userDoc = await db.collection("users").doc(userId).get();
  const user = userDoc.data();

  const prompt = `
Generate a 7-day meal plan for a user with goal: ${user.onboarding.goal}.
Each day should have breakfast, lunch, dinner, and total calories.
Return JSON format.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
};
