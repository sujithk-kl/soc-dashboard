const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// GET route to fetch logs
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }); // optional: sort by latest
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching logs' });
  }
});

// POST route to save logs
router.post('/', async (req, res) => {
  try {
    const logs = Array.isArray(req.body) ? req.body : [req.body];
    await Log.insertMany(logs);
    res.status(201).json({ message: 'Logs saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error saving logs' });
  }
});

module.exports = router;
