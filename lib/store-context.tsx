"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import type { Product, CartItem, User } from "./types";
import { setToken, clearToken, authApi, cartApi } from "./api";

// Re-export types so existing imports like `import { Product } from "@/lib/store-context"` keep working
export type { Product, CartItem, User };

// ── State & Actions ───────────────────────────────────────────────────────────

interface StoreState {
  cart: CartItem[];
  user: User | null;
  searchQuery: string;
  selectedCategory: string | null;
}

type StoreAction =
  | { type: "ADD_TO_CART"; product: Product; quantity?: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "SET_CART"; cart: CartItem[] }
  | { type: "CLEAR_CART" }
  | { type: "SET_USER"; user: User | null }
  | { type: "SET_SEARCH_QUERY"; query: string }
  | { type: "SET_CATEGORY"; category: string | null };

const initialState: StoreState = {
  cart: [],
  user: null,
  searchQuery: "",
  selectedCategory: null,
};

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find(
        (item) => item.product.id === action.product.id
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + (action.quantity || 1) }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { product: action.product, quantity: action.quantity || 1 },
        ],
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== action.productId),
      };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.product.id !== action.productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    case "SET_CART":
      return { ...state, cart: action.cart };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "SET_USER":
      return { ...state, user: action.user };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.query };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.category };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const StoreContext = createContext<{
  state: StoreState;
  dispatch: Dispatch<StoreAction>;
} | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Restore session on mount: validate stored token and reload cart
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("bazaar_token")
        : null;
    if (!token) return;

    authApi
      .me()
      .then(({ user }) => {
        dispatch({ type: "SET_USER", user });
        return cartApi.get();
      })
      .then((cart) => {
        dispatch({ type: "SET_CART", cart });
      })
      .catch(() => {
        clearToken();
      });
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}

export function useCart() {
  const { state, dispatch } = useStore();

  const addToCart = async (product: Product, quantity = 1) => {
    dispatch({ type: "ADD_TO_CART", product, quantity });
    try {
      const updated = await cartApi.add(product.id, quantity);
      dispatch({ type: "SET_CART", cart: updated });
    } catch {
      // Not logged in — local cart only
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId });
    try {
      const updated = await cartApi.remove(productId);
      dispatch({ type: "SET_CART", cart: updated });
    } catch {
      // Local only
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
    try {
      const updated = await cartApi.update(productId, quantity);
      dispatch({ type: "SET_CART", cart: updated });
    } catch {
      // Local only
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });
    try {
      await cartApi.clear();
    } catch {
      // Local only
    }
  };

  const cartTotal = state.cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = state.cart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return { cart: state.cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount };
}

export function useSearch() {
  const { state, dispatch } = useStore();
  return {
    searchQuery: state.searchQuery,
    selectedCategory: state.selectedCategory,
    setSearchQuery: (query: string) => dispatch({ type: "SET_SEARCH_QUERY", query }),
    setCategory: (category: string | null) => dispatch({ type: "SET_CATEGORY", category }),
  };
}

export function useAuth() {
  const { state, dispatch } = useStore();

  const login = (user: User, token: string) => {
    setToken(token);
    dispatch({ type: "SET_USER", user });
    cartApi
      .get()
      .then((cart) => dispatch({ type: "SET_CART", cart }))
      .catch(() => {});
  };

  const logout = () => {
    clearToken();
    dispatch({ type: "SET_USER", user: null });
    dispatch({ type: "CLEAR_CART" });
  };

  return {
    user: state.user,
    isAuthenticated: !!state.user,
    login,
    logout,
  };
}
