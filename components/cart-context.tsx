"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type CartItem = {
  id: string;
  quantity: number;
  product?: any;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  addToCart: (product: any, qty?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "novaecart_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const lastAddedRef = useRef<{ product: any; qty: number } | null>(null);

  const addToCart = (product: any, qty = 1) => {
    // record last added item details, then update items state
    lastAddedRef.current = { product, qty };
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) => (it.id === product.id ? { ...it, quantity: it.quantity + qty } : it));
      }
      return [...prev, { id: product.id, quantity: qty, product }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clearCart = () => setItems([]);

  // Emit events after items change (commit) to avoid triggering setState during render
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const added = lastAddedRef.current;
        if (added) {
          window.dispatchEvent(new CustomEvent("novaecart:item-added", { detail: added }));
          lastAddedRef.current = null;
        }
        window.dispatchEvent(new CustomEvent("novaecart:cart-updated", { detail: { items } }));
      }
    } catch {
      // ignore
    }
  }, [items]);

  const value: CartContextValue = {
    items,
    count: items.reduce((s, it) => s + it.quantity, 0),
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export default CartProvider;
