import express from 'express';
import { getAllTasks } from '../controllers/tasksController.js';
import { createTask } from '../controllers/tasksController.js';
import { updateTask } from '../controllers/tasksController.js';
import { deleteTask } from '../controllers/tasksController.js';
import { authMiddleware } from '../middlewares/auth.js';
const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllTasks);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);
export default router;