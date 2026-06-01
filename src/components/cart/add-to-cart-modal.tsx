"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function AddToCartModal() {
  const { lastAdded, closeAddedModal, openDrawer } = useCart();

  return (
    <AnimatePresence>
      {lastAdded ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/40 px-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl"
            initial={{ y: 24, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.96 }}
          >
            <button className="ml-auto grid h-9 w-9 place-items-center rounded-md border border-stone-200" onClick={closeAddedModal}>
              <X className="h-4 w-4" />
            </button>
            <CheckCircle2 className="mx-auto h-12 w-12 text-violet-700" />
            <h2 className="mt-4 text-2xl font-black text-stone-950">Se agrego al carrito</h2>
            <p className="mt-2 text-sm text-stone-600">{lastAdded.name}</p>
            <div className="mt-6 grid gap-3">
              <button className="h-11 rounded-md border border-stone-300 font-bold" onClick={closeAddedModal}>
                Seguir comprando
              </button>
              <Link
                href="/carrito"
                onClick={() => {
                  closeAddedModal();
                  openDrawer();
                }}
                className="inline-flex h-11 items-center justify-center rounded-md bg-violet-700 font-black text-white"
              >
                Ver mi compra
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
