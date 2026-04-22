// Central API client for the Bazaar backend.
// All fetch calls go through here so the base URL is configured in one place.

import type { Product, CartItem, AuthResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bazaar_token");
}

export function setToken(token: string): void {
  localStorage.setItem("bazaar_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("bazaar_token");
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () =>
    request<{ user: AuthUser }>("/auth/me", { auth: true }),
};

// Re-export AuthUser so consumers don't need to import from types separately
export type { AuthUser } from "./types";

// ── Products ──────────────────────────────────────────────────────────────────

export const productsApi = {
  list: (params?: { category?: string | null; search?: string }): Promise<Product[]> => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString() ? `?${qs}` : "";
    return request<Product[]>(`/products${query}`);
  },

  get: (id: string): Promise<Product> =>
    request<Product>(`/products/${id}`),

  related: (id: string, limit = 4): Promise<Product[]> =>
    request<Product[]>(`/products/${id}/related?limit=${limit}`),
};

// ── Categories ────────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: (): Promise<{ id: string; name: string; icon: string }[]> =>
    request<{ id: string; name: string; icon: string }[]>("/categories"),
};

// ── Cart ─────────────────────────────────────────────────────────────────────

export const cartApi = {
  get: (): Promise<CartItem[]> =>
    request<CartItem[]>("/cart", { auth: true }),

  add: (productId: string, quantity = 1): Promise<CartItem[]> =>
    request<CartItem[]>("/cart", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ productId, quantity }),
    }),

  update: (productId: string, quantity: number): Promise<CartItem[]> =>
    request<CartItem[]>(`/cart/${productId}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify({ quantity }),
    }),

  remove: (productId: string): Promise<CartItem[]> =>
    request<CartItem[]>(`/cart/${productId}`, {
      method: "DELETE",
      auth: true,
    }),

  clear: (): Promise<CartItem[]> =>
    request<CartItem[]>("/cart", {
      method: "DELETE",
      auth: true,
    }),
};
