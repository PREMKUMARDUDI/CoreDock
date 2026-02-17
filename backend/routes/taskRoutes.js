import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected
router.route("/").get(protect, getTasks).post(protect, createTask);

router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

export default router;
