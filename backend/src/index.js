require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");       // ADD THIS — needed for file operations
const path = require("path");   // ADD THIS — needed for cross-platform file paths

const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const cartRouter = require("./routes/cart");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Log Directory Setup ──────────────────────────────────────────────────────
// This runs ONCE when the server starts (not on every request).
// It ensures /app/logs exists inside the container before any request
// tries to write to it. Without this, fs.appendFileSync would throw
// an error on the very first request because the folder doesn't exist yet.
const logDir = "/app/logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
// ────────────────────────────────────────────────────────────────────────────

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ── Request Logger Middleware ────────────────────────────────────────────────
// PLACEMENT MATTERS: This goes AFTER cors and json parsing (those need to run
// first), but BEFORE the routes. This way, every incoming request to any route
// gets logged automatically. If you placed this after the routes, requests
// that match a route would never reach this middleware at all.
app.use((req, res, next) => {
  const entry = `${new Date().toISOString()} ${req.method} ${req.url}\n`;
  fs.appendFileSync(path.join(logDir, "app.log"), entry);
  next(); // IMPORTANT: always call next() or the request gets stuck here forever
});
// ────────────────────────────────────────────────────────────────────────────

// Routes
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/cart", cartRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://0.0.0.0:${PORT}`);
});