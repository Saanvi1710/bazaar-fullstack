// This file keeps the same exported function signatures that the rest of the app
// depends on (fetchProducts, fetchProduct, fetchRelatedProducts, categories).
// The only change is that each function now calls the real backend API instead
// of filtering the local mock array.

import type { Product } from "./store-context";
import { productsApi, categoriesApi } from "./api";

// Static category list (also returned by /api/categories, kept here for the
// CategoryFilter component which renders icons from lucide-react by name).
export const categories = [
  { id: "electronics", name: "Electronics", icon: "Laptop" },
  { id: "clothing", name: "Clothing", icon: "Shirt" },
  { id: "home", name: "Home & Living", icon: "Home" },
  { id: "sports", name: "Sports", icon: "Dumbbell" },
  { id: "books", name: "Books", icon: "BookOpen" },
  { id: "beauty", name: "Beauty", icon: "Sparkles" },
  { id: "toys", name: "Toys & Games", icon: "Gamepad2" },
  { id: "appliances", name: "Appliances", icon: "Refrigerator" },
];

// ─── API-backed fetch functions ────────────────────────────────────────────

export async function fetchProducts(
  category?: string | null,
  search?: string
): Promise<Product[]> {
  return productsApi.list({ category, search });
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    return await productsApi.get(id);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("404")) return null;
    throw err;
  }
}

export async function fetchRelatedProducts(
  productId: string,
  limit = 4
): Promise<Product[]> {
  return productsApi.related(productId, limit);
}
