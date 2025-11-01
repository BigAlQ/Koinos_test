const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const router = express.Router();
const DATA_PATH = path.join(__dirname, "../../data/items.json");

const JSON_INDENT = 2;
const JSON_NO_REPLACER = null;

// Utility to write data asynchronously
async function readData() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

// Utility to write data asynchronously
async function writeData(data) {
  await fs.writeFile(
    DATA_PATH,
    JSON.stringify(data, JSON_NO_REPLACER, JSON_INDENT)
  );
}

// This function returns items from your data file, optionally filtered by a search keyword (q) and/or limited in number (limit).
// GET /api/items
router.get("/", async (req, res, next) => {
  try {
    const data = await readData();
    let { limit, page, q } = req.query;

    // Convert query params to integers with defaults
    limit = limit ? parseInt(limit) : data.length; // default: all items
    page = page ? parseInt(page) : 1; // default: page 1

    let results = data;

    // Search filter
    if (q) {
      results = results.filter((item) =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    // Return paginated results with meta info
    res.json({
      page,
      limit,
      total: results.length,
      items: paginatedResults,
    });
  } catch (err) {
    next(err);
  }
});

// This function retrieves a single item by its id from the data.
// GET /api/items/:id
router.get("/:id", async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find((i) => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error("Item not found");
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// This function adds a new item to the data file.
router.post("/", async (req, res, next) => {
  try {
    // Payload validation
    const { name, quantity, price } = req.body;
    if (!name || typeof quantity !== "number" || typeof price !== "number") {
      return res.status(400).json({ error: "Invalid item data" });
    }

    const data = await readData();
    const item = { id: Date.now(), name, quantity, price };
    data.push(item);

    // Async write to avoid blocking
    await writeData(data);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
