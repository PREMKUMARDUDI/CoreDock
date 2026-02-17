import Task from "../models/Task.js";
import User from "../models/User.js"; // Import User to update the array

// 1. Get All Tasks (Only for the Logged-in User)
export const getTasks = async (req, res) => {
  try {
    // AUTHORIZATION: Only find tasks where 'user' matches the logged-in ID
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Create Task (And Link to User)
export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // A. Create the Task
    const task = await Task.create({
      user: req.user.id, // Set the creatingUser ID
      title,
      description,
      status,
    });

    // B. Update User: Push task ID to user's 'tasks' array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { tasks: task._id },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Update Task (Strict Ownership Check)
export const updateTask = async (req, res) => {
  try {
    const { title, status } = req.body;

    // Find task by ID
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // AUTHORIZATION: Check if the creatingUser matches the logged-in user
    if (task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this task" });
    }

    task.title = title || task.title;
    task.status = status || task.status;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. Delete Task (And Remove from User)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // AUTHORIZATION: Check ownership
    if (task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this task" });
    }

    // A. Remove Task ID from User's array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { tasks: task._id },
    });

    // B. Delete the Task document
    await task.deleteOne();

    res.json({ message: "Task removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
