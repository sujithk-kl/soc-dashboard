// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

mongoose.connect('mongodb://localhost:27017/logs', { useNewUrlParser: true, useUnifiedTopology: true });

const LogSchema = new mongoose.Schema({}, { strict: false });
const Log = mongoose.model('Log', LogSchema);

app.get('/api/logs', async (req, res) => {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(50); // latest 50 logs
    res.json(logs);
});

app.listen(5000, () => console.log('Server running on port 5000'));
