const express = require("express");
const path = require("path");
const morgan = require("morgan");
const itemsRouter = require("./routes/items");
const statsRouter = require("./routes/stats");
const cors = require("cors");
const { notFound } = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000" }));
// Basic middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/items", itemsRouter);
app.use("/api/stats", statsRouter);

// Not Found handler - should be last
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () =>
  console.log("Backend running on http://localhost:" + port)
);
