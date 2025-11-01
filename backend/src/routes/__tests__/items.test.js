const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");
const itemsRouter = require("../items");

const app = express();
app.use(express.json());
app.use("/api/items", itemsRouter);

// Add error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

const DATA_PATH = path.join(__dirname, "../../../data/items.json");
const DATA_DIR = path.dirname(DATA_PATH);

// Initial test data
const initialData = [
  { id: 1, name: "Item A", quantity: 10, price: 5 },
  { id: 2, name: "Item B", quantity: 20, price: 10 },
];

beforeEach(() => {
  // Ensure the data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Write initial test data
  fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
});

afterEach(() => {
  // Optionally clean up the file after each test
  if (fs.existsSync(DATA_PATH)) {
    fs.unlinkSync(DATA_PATH);
  }
});

describe("GET /api/items", () => {
  test("should return all items", async () => {
    const res = await request(app).get("/api/items");
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(initialData.length);
    expect(res.body.total).toBe(initialData.length);
  });

  test("should return items filtered by query 'q'", async () => {
    const res = await request(app).get("/api/items?q=Item A");
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe("Item A");
    expect(res.body.total).toBe(1);
  });

  test("should return limited number of items", async () => {
    const res = await request(app).get("/api/items?limit=1");
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.limit).toBe(1);
  });

  test("should handle pagination correctly", async () => {
    const res = await request(app).get("/api/items?page=1&limit=1");
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(1);
    expect(res.body.total).toBe(initialData.length);
  });
});

describe("GET /api/items/:id", () => {
  test("should return a single item by id", async () => {
    const res = await request(app).get("/api/items/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Item A");
  });

  test("should return 404 if item not found", async () => {
    const res = await request(app).get("/api/items/999");
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /api/items", () => {
  test("should add a new item", async () => {
    const newItem = { name: "Item C", quantity: 5, price: 7 };
    const res = await request(app).post("/api/items").send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newItem.name);

    // Check file has been updated
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    expect(data.length).toBe(initialData.length + 1);
  });

  test("should return 400 for invalid item", async () => {
    const invalidItem = { name: "Invalid" }; // missing quantity and price
    const res = await request(app).post("/api/items").send(invalidItem);
    expect(res.statusCode).toBe(400);
  });
});
