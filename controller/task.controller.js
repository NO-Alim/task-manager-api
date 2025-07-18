import Task from "../model/task.model.js";
import AppError from "../utils/AppError.js";

// @route GET /api/tasks
export const getAllTasks = async (req, res, next) => {
  const queryObj = {};
  if (req.query.completed) {
    queryObj.completed = req.query.completed === "true";
  }
  try {
    const tasks = await Task.find(queryObj);
    res.status(200).json({
      success: true,
      data: {
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/tasks/123
export const getTaskById = async (req, res, next) => {
  const taskId = req.params.id;
  const task = await Task.findById(taskId);

  try {
    if (!task) {
      return next(new AppError("Book not Found", 404));
    }
    res.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/tasks

export const addTask = async (req, res, next) => {
  const task = req.body;
  if (!task.title) {
    return next(new AppError("Missing Require Fields", 400));
  }
  try {
    const newTask = new Task(task);
    await newTask.save();
    res.status(201).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new AppError("Validation Failed.", 400));
    }
    next(error);
  }
};

// @route PUT /api/tasks/123

export const updateTask = async (req, res, next) => {
  try {
    const task = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, task, {
      new: true,
    });
    if (!updatedTask) {
      next(new AppError("Task not Found", 404));
    }
    res.status(200).json({
      success: true,
      data: {
        updatedTask,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new AppError("Validation Failed.", 400));
    }
    next(error);
  }
};

// @route DELETE /api/task/123

export const deleteTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return next(new AppError("Task Not Found", 404));
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
