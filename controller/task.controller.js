import Task from "../model/task.model.js";
import AppError from "../utils/AppError.js";

// @route GET /api/tasks
export const getAllTasks = async (req, res, next) => {

  try {
    let query;

    const reqQuery = {...req.query};
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
    
    excludeFields.forEach(param => delete reqQuery[param]);
    
    let queryStr = JSON.stringify(reqQuery);
    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // initial mongoose query
    query = Task.find(JSON.parse(queryStr));

    //Search (using regex for specific fields like title, description)

    if (req.query.title) {
      query = query.find({
        title: { $regex: req.query.title, $options: 'i' }
      });
    }

    if (req.query.description) {
      query = query.find({
        description: { $regex: req.query.description, $options: 'i' }
      });
    }



    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else{
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10 // Default limit 10 per page
    const skip = (page -1) * limit;

    query = query.skip(skip).limit(limit);

    const tasks = await query;

    const totalTasks = await Task.countDocuments(JSON.parse(queryStr)); // count based on filter
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      total: totalTasks,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalTasks / limit),
      data: tasks
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
