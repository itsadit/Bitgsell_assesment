const request = require('supertest');
const express = require('express');
const itemsRouter = require('../../src/routes/items');

const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

describe('Items API', () => {
  test('GET /api/items returns all items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/items?q=book filters items by query', async () => {
    const res = await request(app).get('/api/items?q=book');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/items?limit=1 limits the result', async () => {
    const res = await request(app).get('/api/items?limit=1');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(1);
  });

  test('GET /api/items/:id returns a specific item', async () => {
    const resAll = await request(app).get('/api/items');
    const firstId = resAll.body[0]?.id;
    if (!firstId) return;

    const res = await request(app).get(`/api/items/${firstId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(firstId);
  });

  test('GET /api/items/:id returns 404 for invalid ID', async () => {
    const res = await request(app).get('/api/items/999999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/items creates a new item', async () => {
    const newItem = { name: 'Test Item', price: 99 };
    const res = await request(app).post('/api/items').send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Item');
  });

  test('POST /api/items with invalid payload returns 400', async () => {
    const res = await request(app).post('/api/items').send({ price: 99 });
    expect(res.statusCode).toBe(400);
  });
});
