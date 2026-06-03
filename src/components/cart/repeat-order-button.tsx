"use client";

import { ShoppingCart } from "lucide-react";
import { useCart, type CartLine } from "@/components/cart/cart-provider";

type RepeatItem = Omit<CartLine, "quantity"> & {
  quantity: number;
};

export function RepeatOrderButton({ items }: { items: RepeatItem[] }) {
  const { addItem, openDrawer } = useCart();
  const availableItems = items.filter((item) => item.stock > 0);

  return (
    <button
      disabled={!availableItems.length}
      onClick={() => {
        for (const item of availableItems) {
          const { quantity, ...product } = item;
          addItem(product, quantity);
        }
        openDrawer();
      }}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-stone-300"
    >
      <ShoppingCart size={17} />
      Volver a comprar
    </button>
  );
}
