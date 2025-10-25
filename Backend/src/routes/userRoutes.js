/*import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();

// ✅ Fetch user profile by UID
router.get("/:uid", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;

    // Ensure token matches requested user
    if (req.user.uid !== uid) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userSnap.data();
    console.log("Fetched user data:", userData);

    res.json({ uid, ...userData });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Update user profile
router.put("/:uid", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;

    if (req.user.uid !== uid) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await db.collection("users").doc(uid).set(
      {
        ...req.body,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    res.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
*/
import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();

// ✅ Fetch user profile
router.get("/:uid", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;
    if (req.user.uid !== uid) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

    res.json({ ok: true, user: userSnap.data() });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Update user profile
router.put("/:uid", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;
    if (req.user.uid !== uid) return res.status(403).json({ error: "Unauthorized access" });

    const updateData = { ...req.body, updatedAt: new Date() };
    await db.collection("users").doc(uid).set(updateData, { merge: true });

    res.json({ ok: true, message: "Profile updated successfully", updatedData: updateData });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile", details: err.message });
  }
});

export default router;
