const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Initialize database tables
async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        original_price INTEGER,
        images TEXT[] DEFAULT '{}',
        category_id VARCHAR(50) REFERENCES categories(id),
        rating NUMERIC(3,1) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        in_stock BOOLEAN DEFAULT TRUE,
        specs JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      );
    `);
    console.log("✅ Database tables initialized");
  } finally {
    client.release();
  }
}

// Retry DB init (useful when Postgres container is starting up)
async function initDBWithRetry(retries = 10, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await initDB();
      return;
    } catch (err) {
      if (i < retries - 1) {
        console.log(
          `⏳ DB not ready yet (attempt ${i + 1}/${retries}), retrying in ${delayMs / 1000}s...`
        );
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
}

initDBWithRetry().catch((err) => {
  console.error("❌ Failed to initialize database:", err.message);
  process.exit(1);
});

module.exports = pool;
