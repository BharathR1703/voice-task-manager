const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// GET /api/tasks - supports ?q=search&status=&priority=&limit=&skip=
router.get('/', async (req, res, next) => {
  try {
    const { q, status, priority, limit = 100, skip = 0 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 }).limit(Number(limit)).skip(Number(skip));
    res.json(tasks);
  } catch (err) { next(err); }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const { title, description = '', status = 'todo', priority = 'medium', dueDate = '' } = req.body;
    if (!title || title.trim() === '') return res.status(400).json({ error: 'Title required' });
    const task = new Task({ title, description, status, priority, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (err) { next(err); }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
  } catch (err) { next(err); }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
