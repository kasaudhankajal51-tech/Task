const Task = require('../models/Task');

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, category, completed, search, sortBy } = req.query;
    
    // Strictly isolate by logged in user ID
    const filter = { user: req.user._id };

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (category && category !== 'all') filter.category = category;
    if (completed !== undefined) filter.completed = completed === 'true';
    
    if (search) {
      filter.$and = [
        { user: req.user._id },
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      // Clean duplicate user key
      delete filter.user;
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'dueDate') {
      sortOption = { dueDate: 1 };
    } else if (sortBy === 'priority') {
      sortOption = { priority: -1 };
    } else if (sortBy === 'title') {
      sortOption = { title: 1 };
    }

    const tasks = await Task.find(filter).sort(sortOption);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new task for authenticated user
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, category, status, priority, dueDate, completed } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a title' });
    }

    const isCompleted = completed !== undefined ? completed : status === 'completed';
    const taskStatus = status || (isCompleted ? 'completed' : 'pending');

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Personal',
      status: taskStatus,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      completed: isCompleted
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
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

    task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get user productivity stats
// @route   GET /api/tasks/stats/summary
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [stats] = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $and: [{ $eq: ['$completed', false] }, { $ne: ['$status', 'in-progress'] }] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $and: [{ $eq: ['$completed', false] }, { $eq: ['$priority', 'high'] }] }, 1, 0] } }
        }
      }
    ]);

    const result = stats || {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      highPriority: 0
    };

    result.completionRate = result.total > 0 ? Math.round((result.completed / result.total) * 100) : 0;

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
