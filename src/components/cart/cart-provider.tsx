"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  total: number;
  isDrawerOpen: boolean;
  lastAdded: CartLine | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  closeAddedModal: () => void;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "ecomer.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartLine | null>(null);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      isDrawerOpen,
      lastAdded,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      closeAddedModal: () => setLastAdded(null),
      addItem: (item, quantity = 1) => {
        setItems((current) => {
          const existing = current.find((line) => line.productId === item.productId);
          const added = { ...item, quantity: Math.min(quantity, item.stock) };
          setLastAdded(added);
          if (!existing) return [...current, added];
          return current.map((line) =>
            line.productId === item.productId
              ? { ...line, quantity: Math.min(line.quantity + quantity, line.stock) }
              : line,
          );
        });
      },
      updateQuantity: (productId, quantity) => {
        setItems((current) =>
          current.map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.max(1, Math.min(quantity, line.stock)) }
              : line,
          ),
        );
      },
      removeItem: (productId) => {
        setItems((current) => current.filter((line) => line.productId !== productId));
      },
      clear: () => setItems([]),
    }),
    [isDrawerOpen, items, lastAdded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider.");
  return context;
}
