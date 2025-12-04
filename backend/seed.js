/* Simple seed script to create example tasks */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./src/models/Task');

dotenv.config();
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

async function seed() {
  if (!uri) {
    console.error('MongoDB URI not set in environment variables.');
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: 'Cluster0' });
  console.log('Connected to DB for seeding');
  await Task.deleteMany({});
  const tasks = [
    { title: 'Review PR #342', description: 'Go through changes and leave feedback', priority: 'high', status: 'todo', dueDate: new Date().toISOString().split('T')[0] },
    { title: 'Update docs', description: 'Add usage examples for API', priority: 'medium', status: 'inprogress', dueDate: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })() },
    { title: 'Fix payment bug', description: 'Investigate 500 error on checkout', priority: 'critical', status: 'todo', dueDate: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().split('T')[0]; })() },
  ];
  await Task.insertMany(tasks);
  console.log('Seeded tasks');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
