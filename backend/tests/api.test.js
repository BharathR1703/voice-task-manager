const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;
const tasksRouter = require('../src/routes/tasks');
const parseRouter = require('../src/routes/parse');

const app = express();
app.use(bodyParser());
app.use('/api/tasks', tasksRouter);
app.use('/api/parse', parseRouter);

describe('API endpoints (unit-level)', () => {
  test('parse endpoint returns JSON', async () => {
    const res = await request(app).post('/api/parse').send({ transcript: 'Create a task to test parsing tomorrow' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('transcript');
    expect(res.body).toHaveProperty('parsed');
  });
});
