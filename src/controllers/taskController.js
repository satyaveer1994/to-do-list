const Task = require("../models/taskMode");

// Create a task
exports.createTask = async (req, res) => {
  const { title, priority } = req.body;

  try {
    const task = new Task({ title, priority });
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error creating task", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// List all tasks
exports.listTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks", error);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
};

// Mark a task as completed
exports.completeTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
    } else {
      task.completed = true;
      await task.save();
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error marking task as completed", error);
    res.status(500).json({ error: "Failed to mark task as completed" });
  }
};

// Mark a task as canceled
exports.cancelTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
    } else {
      task.canceled = true;
      await task.save();
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error marking task as canceled", error);
    res.status(500).json({ error: "Failed to mark task as canceled" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const result = await Task.deleteOne({ _id: taskId });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error deleting task", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Report of tasks
exports.taskReport = async (req, res) => {
  try {
    const pendingTasks = await Task.countDocuments({
      completed: false,
      canceled: false,
    });
    const canceledTasks = await Task.countDocuments({ canceled: true });
    const deletedTasks = await Task.countDocuments({
      completed: true,
      canceled: true,
    });
    const completedTasks = await Task.countDocuments({
      completed: true,
      canceled: false,
    });

    const tasks = await Task.find().sort({ status: 1 });

    res.json({
      pendingTasks,
      canceledTasks,
      deletedTasks,
      completedTasks,
      tasks,
    });
  } catch (error) {
    console.error("Error generating task report", error);
    res.status(500).json({ error: "Failed to generate task report" });
  }
};
