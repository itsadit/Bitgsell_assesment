const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');


// Utility to read data (async, non-blocking)
async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

// Utility to write data
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const { limit, q } = req.query;
    let results = await readData();

    if (q) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (limit) {
      const num = parseInt(limit);
      if (!isNaN(num)) {
        results = results.slice(0, num);
      }
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const { id } = req.params;
    const item = data.find(i => String(i.id) === id);


    if (!item) {
      const error = new Error('Item not found');
      error.status = 404;
      throw error;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const item = req.body;

    // Basic validation
    if (!item.name || typeof item.name !== 'string') {
      const error = new Error('Invalid item payload: name is required');
      error.status = 400;
      throw error;
    }

    const data = await readData();
    item.id = Date.now(); // Or use a UUID in real apps
    data.push(item);

    await writeData(data);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
