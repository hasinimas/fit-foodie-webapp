// backend/src/routes/users.js
import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

/**
 * GET /api/users/:uid
 * Returns user document (or 404 if not found)
 */
router.get("/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ error: "uid required" });

    const docRef = db.collection("users").doc(uid);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: "User not found" });

    return res.json({ ok: true, user: snap.data() });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/users/onboarding
 * Body: { uid: string, onboarding: object }
 * Saves onboarding data under users/{uid}.merge=true
 */
router.post("/onboarding", async (req, res, next) => {
  try {
    const { uid, onboarding } = req.body;
    if (!uid || !onboarding) return res.status(400).json({ error: "uid and onboarding required" });

    const docRef = db.collection("users").doc(uid);
    await docRef.set({ onboarding, completedOnboarding: true, onboardingAt: new Date() }, { merge: true });

    return res.json({ ok: true, message: "Onboarding saved" });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/users/:uid
 * Partial update of user document. Body contains fields to merge.
 */
router.patch("/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const updates = req.body;
    if (!uid || !updates) return res.status(400).json({ error: "uid and updates required" });

    const docRef = db.collection("users").doc(uid);
    await docRef.set(updates, { merge: true });

    return res.json({ ok: true, message: "User updated" });
  } catch (err) {
    next(err);
  }
});

export default router;
