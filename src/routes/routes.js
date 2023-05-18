// Import required modules
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authController = require("../controllers/userController");
const { authenticate } = require("../middlewear/auth");

// Task routes
router.post("/", authenticate, taskController.createTask);
router.get("/", authenticate, taskController.listTasks);
router.patch("/:id/complete", authenticate, taskController.completeTask);
router.patch("/:id/cancel", authenticate, taskController.cancelTask);
router.delete("/:id", authenticate, taskController.deleteTask);
router.get("/report", authenticate, taskController.taskReport);

// Authentication routes
router.post("/register", authController.register);
//router.post('/login', authController.login);

module.exports = router;
