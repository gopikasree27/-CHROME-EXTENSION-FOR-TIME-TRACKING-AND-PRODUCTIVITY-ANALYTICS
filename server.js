import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/productivityDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const timeLogSchema = new mongoose.Schema({
    url: String,
    timeSpent: Number,
    date: String,
});

const TimeLog = mongoose.model('TimeLog', timeLogSchema);

// POST Route
app.post('/log-time', async (req, res) => {
    try {
        const { url, timeSpent, date } = req.body;
        console.log('Received log:', req.body);  // ✅ Debug log

        const newLog = new TimeLog({ url, timeSpent, date });
        await newLog.save();
        res.status(201).send('Time logged');
    } catch (error) {
        console.error('Error saving log:', error);
        res.status(500).send('Server error');
    }
});

// GET Route
app.get('/weekly-report', async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const formattedDate = oneWeekAgo.toISOString().slice(0, 10);

        const data = await TimeLog.find({ date: { $gte: formattedDate } });
        res.json(data);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).send('Error fetching report');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
