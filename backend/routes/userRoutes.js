import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect these routes with JWT middleware
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
