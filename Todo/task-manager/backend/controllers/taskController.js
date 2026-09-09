const Task = require('../models/Task');

// @desc    Get all tasks (with optional query filtering & sorting)
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    const { status, priority, completed, search, sortBy } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'dueDate') {
      sortOption = { dueDate: 1 };
    } else if (sortBy === 'priority') {
      sortOption = { priority: 1 };
    }

    const tasks = await Task.find(filter).sort(sortOption);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, completed } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a title' });
    }

    const isCompleted = completed !== undefined ? completed : status === 'completed';
    const taskStatus = status || (isCompleted ? 'completed' : 'pending');

    const task = await Task.create({
      title,
      description,
      status: taskStatus,
      priority,
      dueDate,
      completed: isCompleted
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const updateData = { ...req.body };

    // Synchronize status and completed boolean flags
    if (updateData.status === 'completed' && updateData.completed === undefined) {
      updateData.completed = true;
    } else if (updateData.completed === true && !updateData.status) {
      updateData.status = 'completed';
    } else if (updateData.completed === false && updateData.status === 'completed') {
      updateData.status = 'pending';
    }

    task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
