const express = require("express");
const fs = require("fs").promises; // Use promises API
const path = require("path");
const router = express.Router();
const DATA_PATH = path.join(__dirname, "../../data/items.json");

// Memory cache for average of prices.
let avgCache = null;

// Last time the avg was modified.
let lastFileMtime = null;

// Calculate average (CPU-intensive)
function calculateAvg(items) {
  return {
    total: items.length,
    averagePrice: items.length
      ? items.reduce((acc, cur) => acc + cur.price, 0) / items.length
      : 0, // Handle empty array
  };
}

// GET /api/stats
router.get("/", async (req, res, next) => {
  try {
    const stats = await fs.stat(DATA_PATH);
    const fileMtime = stats.mtime.getTime();

    // Return cached stats if file hasn't changed
    if (avgCache && lastFileMtime === fileMtime) {
      return res.json(avgCache);
    }

    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const items = JSON.parse(raw);

    avgCache = calculateAvg(items);
    lastFileMtime = fileMtime;

    res.json(avgCache);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
