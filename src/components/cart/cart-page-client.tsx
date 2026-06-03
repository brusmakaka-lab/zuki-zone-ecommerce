"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductCard } from "@/components/product-card";
import { formatMoney } from "@/lib/utils";
import type { StoreCategory, StoreProduct } from "@/lib/demo-data";

export function CartPageClient({ recommended, categories }: { recommended: StoreProduct[]; categories: StoreCategory[] }) {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-stone-950">Carrito</h1>
      {!items.length ? (
        <div className="mt-8 grid gap-8">
          <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-11 w-11 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-black text-stone-950">Tu carrito esta vacio</h2>
            <p className="mx-auto mt-2 max-w-xl text-stone-600">Elegi productos del catalogo y volve para coordinar tu compra por WhatsApp con seguimiento del pedido.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/catalogo" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 font-bold text-white">
                Seguir comprando
                <ArrowRight size={18} />
              </Link>
              <Link href="/ofertas" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 px-5 font-bold text-stone-900">
                Ver ofertas
              </Link>
            </div>
          </section>
          {categories.length ? (
            <section>
              <h2 className="text-xl font-black text-stone-950">Comprar por categoria</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                  <Link key={category.id} href={`/catalogo?categoria=${category.slug}`} className="rounded-lg border border-stone-200 bg-white px-4 py-4 text-center text-sm font-black text-stone-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50">
                    {category.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          {recommended.length ? (
            <section>
              <h2 className="text-xl font-black text-stone-950">Recomendados para empezar</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {recommended.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          ) : null}
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
