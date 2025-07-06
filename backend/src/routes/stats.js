const express = require('express');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { mean } = require('../utils/stats'); // 

const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

//  In-memory cache for stats
let cachedStats = null;

/**
 *  Helper: Calculates and updates cached stats
 */
async function updateStatsCache() {
  try {
    const raw = await fsp.readFile(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw);

    cachedStats = {
      total: items.length,
      averagePrice: items.length > 0 ? mean(items.map(i => i.price)) : 0,
    };

    console.log('[Stats] Cache updated');
  } catch (err) {
    console.error('[Stats] Failed to update cache:', err.message);
    cachedStats = null;
  }
}

//  Watch file for changes to update cache dynamically
fs.watchFile(DATA_PATH, updateStatsCache);

//  Initialize cache at server start
updateStatsCache();

//  GET /api/stats - return cached data
router.get('/', (req, res, next) => {
  if (cachedStats) {
    res.json(cachedStats);
  } else {
    const error = new Error('Stats not available');
    error.status = 503;
    next(error);
  }
});

module.exports = router;
