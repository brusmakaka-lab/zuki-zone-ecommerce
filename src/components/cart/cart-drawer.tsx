"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const { items, total, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen ? (
        <>
          <motion.button
            aria-label="Cerrar carrito"
            className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <div className="flex h-16 items-center justify-between border-b border-stone-200 px-5">
              <div>
                <p className="text-lg font-black text-stone-950">Su pedido</p>
                <p className="text-sm text-stone-500">{items.length} productos</p>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-md border border-stone-200" onClick={closeDrawer}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {items.length ? (
                <div className="grid gap-4">
                  {items.map((item) => (
                    <div key={item.productId} className="grid grid-cols-[76px_1fr] gap-3">
                      <div className="relative aspect-square overflow-hidden rounded-md bg-stone-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="flex justify-between gap-2">
                          <p className="font-bold leading-tight text-stone-950">{item.name}</p>
                          <button className="text-sm font-bold text-rose-700" onClick={() => removeItem(item.productId)}>
                            Quitar
                          </button>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-stone-600">{formatMoney(item.price)}</p>
                        <div className="mt-3 inline-flex h-9 items-center rounded-md border border-stone-200">
                          <button className="px-3" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                          <button className="px-3" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto h-10 w-10 text-stone-300" />
                    <p className="mt-4 font-bold text-stone-950">Tu carrito esta vacio.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-stone-200 p-5">
              <div className="flex items-center justify-between text-xl font-black">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
              <div className="mt-4 grid gap-3">
                <Link onClick={closeDrawer} href="/checkout" className="inline-flex h-12 items-center justify-center rounded-md bg-violet-700 font-black text-white">
                  Ver mi compra
                </Link>
                <Link onClick={closeDrawer} href="/catalogo" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 font-bold">
                  Seguir comprando
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
