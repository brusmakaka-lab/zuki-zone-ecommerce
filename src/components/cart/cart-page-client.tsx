"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatMoney } from "@/lib/utils";

export function CartPageClient() {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-stone-950">Carrito</h1>
      {!items.length ? (
        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-10 text-center">
          <p className="text-lg font-bold">Tu carrito esta vacio.</p>
          <Link href="/catalogo" className="mt-5 inline-flex rounded-md bg-emerald-700 px-5 py-3 font-bold text-white">
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.productId} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-[120px_1fr_auto]">
                <div className="relative aspect-square overflow-hidden rounded-md bg-stone-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <Link href={`/producto/${item.slug}`} className="text-lg font-bold text-stone-950">
                    {item.name}
                  </Link>
                  <p className="mt-2 font-semibold text-stone-700">{formatMoney(item.price)}</p>
                  <p className="mt-1 text-sm text-stone-500">Stock disponible: {item.stock}</p>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <div className="flex h-10 items-center rounded-md border border-stone-200">
                    <button className="px-3" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Restar">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button className="px-3" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Sumar">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-rose-700" onClick={() => removeItem(item.productId)} aria-label="Quitar">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between text-lg font-black">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
            <Link href="/checkout" className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-emerald-700 font-bold text-white">
              Confirmar compra
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
