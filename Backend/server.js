import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mealRoutes from "./src/routes/meals.js";
import userRoutes from "./src/routes/users.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/meals", mealRoutes);
app.use("/api/users", userRoutes);

// Health Check
app.get("/", (req, res) => res.send("FitFoodie Backend Running ✅"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
