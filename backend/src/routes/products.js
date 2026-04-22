const express = require("express");
const pool = require("../db");

const router = express.Router();

// Helper to format a DB row as the Product shape the frontend expects
function formatProduct(row) {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price || undefined,
    images: row.images || [],
    category: row.category_id,
    rating: parseFloat(row.rating),
    reviewCount: row.review_count,
    inStock: row.in_stock,
    specs: row.specs || {},
  };
}

// GET /api/products?category=&search=&limit=&offset=
router.get("/", async (req, res) => {
  const { category, search, limit = 100, offset = 0 } = req.query;

  try {
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND p.category_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (
        p.name ILIKE $${params.length} OR
        p.description ILIKE $${params.length} OR
        p.category_id ILIKE $${params.length}
      )`;
    }

    query += ` ORDER BY p.id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json(result.rows.map(formatProduct));
  } catch (err) {
    console.error("Products list error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(formatProduct(result.rows[0]));
  } catch (err) {
    console.error("Product detail error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// GET /api/products/:id/related
router.get("/:id/related", async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 4;

  try {
    // Get the product's category first
    const productResult = await pool.query(
      "SELECT category_id FROM products WHERE id = $1",
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.json([]);
    }

    const { category_id } = productResult.rows[0];

    const result = await pool.query(
      `SELECT * FROM products
       WHERE category_id = $1 AND id != $2
       ORDER BY RANDOM()
       LIMIT $3`,
      [category_id, id, limit]
    );

    res.json(result.rows.map(formatProduct));
  } catch (err) {
    console.error("Related products error:", err);
    res.status(500).json({ error: "Failed to fetch related products" });
  }
});

module.exports = router;
