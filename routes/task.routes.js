import express from "express";
import {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTaskById,
} from "../controller/task.controller.js";
const router = express.Router();

router.get("/", getAllTasks);
router.post("/", addTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTaskById);

export default router;
