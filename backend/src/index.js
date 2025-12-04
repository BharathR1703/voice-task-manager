const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const tasksRouter = require('./routes/tasks');
const parseRouter = require('./routes/parse');

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
// Connect to MongoDB
async function connectDb() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('MongoDB URI not set in environment variables.');
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: 'Cluster0' });
  console.log('Connected to MongoDB');
}


connectDb().catch((err) => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/parse', parseRouter);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Voice backend listening on port ${PORT}`);
});
