require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const categories = [
  { id: "electronics", name: "Electronics", icon: "Laptop" },
  { id: "clothing", name: "Clothing", icon: "Shirt" },
  { id: "home", name: "Home & Living", icon: "Home" },
  { id: "sports", name: "Sports", icon: "Dumbbell" },
  { id: "books", name: "Books", icon: "BookOpen" },
  { id: "beauty", name: "Beauty", icon: "Sparkles" },
  { id: "toys", name: "Toys & Games", icon: "Gamepad2" },
  { id: "appliances", name: "Appliances", icon: "Refrigerator" },
];

const products = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Features comfortable memory foam ear cushions and foldable design for easy portability.",
    price: 24999,
    original_price: 34999,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop","https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop","https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&h=600&fit=crop"],
    category_id: "electronics",
    rating: 4.8,
    review_count: 2453,
    in_stock: true,
    specs: { "Battery Life": "30 hours", "Driver Size": "40mm", Connectivity: "Bluetooth 5.2", Weight: "250g" },
  },
  {
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking smartwatch with GPS, heart rate monitoring, and 7-day battery life. Water-resistant to 50m with always-on AMOLED display.",
    price: 37999,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop","https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop"],
    category_id: "electronics",
    rating: 4.6,
    review_count: 1876,
    in_stock: true,
    specs: { Display: '1.4" AMOLED', "Battery Life": "7 days", "Water Resistance": "50m", GPS: "Built-in" },
  },
  {
    name: "Premium Cotton T-Shirt",
    description: "Soft, breathable 100% organic cotton t-shirt with a relaxed fit. Perfect for everyday wear with reinforced stitching for durability.",
    price: 1499,
    original_price: 1999,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop","https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop"],
    category_id: "clothing",
    rating: 4.5,
    review_count: 892,
    in_stock: true,
    specs: { Material: "100% Organic Cotton", Fit: "Relaxed", Care: "Machine Washable" },
  },
  {
    name: "Minimalist Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness and color temperature. Features USB charging port and touch controls.",
    price: 2999,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop"],
    category_id: "home",
    rating: 4.7,
    review_count: 567,
    in_stock: true,
    specs: { "Light Source": "LED", "Color Temp": "2700K-6500K", Power: "12W", Material: "Aluminum" },
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip, eco-friendly yoga mat with alignment marks. Made from natural rubber with superior cushioning for joint protection.",
    price: 3499,
    original_price: 4999,
    images: ["https://images.unsplash.com/photo-1601925228429-b0a27f8b2b0f?w=600&h=600&fit=crop","https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&h=600&fit=crop"],
    category_id: "sports",
    rating: 4.9,
    review_count: 3241,
    in_stock: true,
    specs: { Thickness: "6mm", Material: "Natural Rubber", Size: '68" x 24"', Weight: "1.5kg" },
  },
  {
    name: "Running Shoes Ultra",
    description: "Lightweight, high-performance running shoes with advanced cushioning and breathable mesh upper. Suitable for all terrain types.",
    price: 8999,
    original_price: 11999,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop","https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop"],
    category_id: "sports",
    rating: 4.7,
    review_count: 2187,
    in_stock: true,
    specs: { Upper: "Mesh", Sole: "Rubber", Drop: "8mm", Weight: "280g" },
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Double-walled vacuum insulated water bottle. Keeps drinks cold for 24 hours and hot for 12 hours. BPA-free and leak-proof.",
    price: 1999,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop"],
    category_id: "sports",
    rating: 4.8,
    review_count: 4521,
    in_stock: true,
    specs: { Capacity: "1L", Material: "18/8 Stainless Steel", Insulation: "Double Wall Vacuum", "BPA Free": "Yes" },
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and foreign object detection.",
    price: 1499,
    original_price: 2499,
    images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop"],
    category_id: "electronics",
    rating: 4.5,
    review_count: 1243,
    in_stock: true,
    specs: { Output: "15W Max", Compatibility: "Qi Universal", Cable: "USB-C Included", Indicator: "LED" },
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handcrafted ceramic coffee mugs with a matte finish. Dishwasher and microwave safe with comfortable handle design.",
    price: 1799,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop"],
    category_id: "home",
    rating: 4.6,
    review_count: 876,
    in_stock: true,
    specs: { Capacity: "350ml each", Set: "4 mugs", Material: "Ceramic", Care: "Dishwasher Safe" },
  },
  {
    name: "Bestselling Novel Collection",
    description: "Curated collection of 5 bestselling novels across genres. Perfect for book lovers looking to expand their reading list.",
    price: 2499,
    original_price: 3999,
    images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop"],
    category_id: "books",
    rating: 4.9,
    review_count: 1567,
    in_stock: true,
    specs: { Books: "5", Format: "Paperback", Language: "English", Genre: "Mixed" },
  },
  {
    name: "Vitamin C Serum",
    description: "Brightening vitamin C serum with hyaluronic acid and niacinamide. Reduces dark spots, evens skin tone, and boosts collagen production.",
    price: 1299,
    original_price: 1799,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop"],
    category_id: "beauty",
    rating: 4.7,
    review_count: 2934,
    in_stock: true,
    specs: { "Vitamin C": "20%", Volume: "30ml", "Skin Type": "All", Cruelty: "Cruelty-Free" },
  },
  {
    name: "Mechanical Keyboard TKL",
    description: "Tenkeyless mechanical keyboard with RGB backlighting and tactile switches. Compact design perfect for programmers and gamers.",
    price: 6999,
    original_price: 8999,
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop","https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop"],
    category_id: "electronics",
    rating: 4.8,
    review_count: 1892,
    in_stock: true,
    specs: { Layout: "TKL 87-key", Switches: "Brown Tactile", Backlight: "RGB", Interface: "USB-C" },
  },
  {
    name: "Air Purifier HEPA",
    description: "True HEPA air purifier that removes 99.97% of particles including dust, allergens, and pollutants. Covers up to 500 sq ft.",
    price: 12999,
    original_price: 15999,
    images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop"],
    category_id: "appliances",
    rating: 4.6,
    review_count: 734,
    in_stock: true,
    specs: { Filter: "True HEPA", Coverage: "500 sq ft", Stages: "3-stage filtration", Noise: "25dB(A)" },
  },
  {
    name: "Linen Throw Blanket",
    description: "Soft, breathable 100% linen throw blanket. Perfect for all seasons with a relaxed, natural texture that gets softer with each wash.",
    price: 3499,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&h=600&fit=crop"],
    category_id: "home",
    rating: 4.8,
    review_count: 423,
    in_stock: true,
    specs: { Material: "100% Linen", Size: '50" x 70"', Weight: "500g", Care: "Machine Washable" },
  },
  {
    name: "Resistance Bands Set",
    description: "Set of 5 resistance bands with varying tension levels. Includes door anchor, ankle straps, and carry bag for a complete workout kit.",
    price: 1599,
    original_price: 2299,
    images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop"],
    category_id: "sports",
    rating: 4.7,
    review_count: 3102,
    in_stock: true,
    specs: { Bands: "5 levels", Material: "Natural Latex", "Max Resistance": "150 lbs", Includes: "Carry Bag" },
  },
  {
    name: "Scented Candle Gift Set",
    description: "Luxury scented candle set with 3 fragrances: lavender, vanilla, and sandalwood. Made with natural soy wax and cotton wicks.",
    price: 1999,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1602178506534-1bcd4d753dc9?w=600&h=600&fit=crop"],
    category_id: "home",
    rating: 4.9,
    review_count: 2156,
    in_stock: true,
    specs: { Candles: "3 pack", Wax: "Natural Soy", "Burn Time": "40 hrs each", Scents: "Lavender/Vanilla/Sandalwood" },
  },
  {
    name: "Electric Toothbrush Pro",
    description: "Advanced sonic electric toothbrush with 5 cleaning modes, pressure sensor, and 2-minute timer. Includes 4 replacement brush heads.",
    price: 5499,
    original_price: 6999,
    images: ["https://images.unsplash.com/photo-1559060033-f8b88b6843b5?w=600&h=600&fit=crop"],
    category_id: "beauty",
    rating: 4.8,
    review_count: 1678,
    in_stock: true,
    specs: { Modes: "5", "Brush Heads": "4 included", Battery: "3 weeks", Timer: "2-min + 30s quadrant" },
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "360° surround sound portable speaker with 20-hour battery life. IPX7 waterproof with deep bass and built-in mic for hands-free calls.",
    price: 5999,
    original_price: 7999,
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop","https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=600&fit=crop"],
    category_id: "electronics",
    rating: 4.7,
    review_count: 2876,
    in_stock: true,
    specs: { "Battery Life": "20 hours", "Water Rating": "IPX7", Connectivity: "Bluetooth 5.0", Power: "30W" },
  },
  {
    name: "Self-Help Bestsellers Bundle",
    description: "Collection of 3 transformative self-help books covering productivity, mindfulness, and financial success.",
    price: 1499,
    original_price: 2100,
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"],
    category_id: "books",
    rating: 4.6,
    review_count: 987,
    in_stock: true,
    specs: { Books: "3", Format: "Paperback", Language: "English", Topics: "Productivity/Mindfulness/Finance" },
  },
  {
    name: "Board Game Family Bundle",
    description: "Classic collection of 10 family board games suitable for all ages. Includes strategy, word, and trivia games.",
    price: 3999,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1611891487122-207579d67d98?w=600&h=600&fit=crop"],
    category_id: "toys",
    rating: 4.6,
    review_count: 765,
    in_stock: true,
    specs: { "Games Included": "10", Players: "2-6", "Age Range": "6+", Material: "Wood & Cardboard" },
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Insert categories
    for (const cat of categories) {
      await pool.query(
        `INSERT INTO categories (id, name, icon) VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET name = $2, icon = $3`,
        [cat.id, cat.name, cat.icon]
      );
    }
    console.log(`✅ Seeded ${categories.length} categories`);

    // Insert products
    for (const p of products) {
      await pool.query(
        `INSERT INTO products (name, description, price, original_price, images, category_id, rating, review_count, in_stock, specs)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING`,
        [p.name, p.description, p.price, p.original_price, p.images, p.category_id, p.rating, p.review_count, p.in_stock, JSON.stringify(p.specs)]
      );
    }
    console.log(`✅ Seeded ${products.length} products`);

    console.log("🎉 Database seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    throw err;
  } finally {
    await pool.end();
  }
}

seed();
