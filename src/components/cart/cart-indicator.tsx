"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatMoney } from "@/lib/utils";

export function CartIndicator() {
  const { count, total, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative inline-flex h-10 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-stone-900 transition hover:border-violet-600"
      aria-label="Abrir carrito"
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="hidden text-sm font-bold lg:inline">{formatMoney(total)}</span>
      {count > 0 ? (
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}
