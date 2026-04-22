const express = require("express");
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Helper to get full cart for user
async function getUserCart(userId) {
  const result = await pool.query(
    `SELECT
      ci.id as cart_item_id,
      ci.quantity,
      p.id,
      p.name,
      p.description,
      p.price,
      p.original_price,
      p.images,
      p.category_id,
      p.rating,
      p.review_count,
      p.in_stock,
      p.specs
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = $1
    ORDER BY ci.created_at ASC`,
    [userId]
  );

  return result.rows.map((row) => ({
    product: {
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
    },
    quantity: row.quantity,
  }));
}

// GET /api/cart
router.get("/", async (req, res) => {
  try {
    const cart = await getUserCart(req.user.id);
    res.json(cart);
  } catch (err) {
    console.error("Cart get error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST /api/cart - add item to cart
router.post("/", async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  try {
    // Check product exists
    const product = await pool.query("SELECT id FROM products WHERE id = $1", [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Upsert cart item
    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3`,
      [req.user.id, productId, quantity]
    );

    const cart = await getUserCart(req.user.id);
    res.json(cart);
  } catch (err) {
    console.error("Cart add error:", err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// PUT /api/cart/:productId - update quantity
router.put("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity == null) {
    return res.status(400).json({ error: "quantity is required" });
  }

  try {
    if (quantity <= 0) {
      // Remove from cart
      await pool.query(
        "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
        [req.user.id, productId]
      );
    } else {
      await pool.query(
        "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
        [quantity, req.user.id, productId]
      );
    }

    const cart = await getUserCart(req.user.id);
    res.json(cart);
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// DELETE /api/cart/:productId - remove item
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [req.user.id, productId]
    );

    const cart = await getUserCart(req.user.id);
    res.json(cart);
  } catch (err) {
    console.error("Cart remove error:", err);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

// DELETE /api/cart - clear entire cart
router.delete("/", async (req, res) => {
  try {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
    res.json([]);
  } catch (err) {
    console.error("Cart clear error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
