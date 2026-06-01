"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import type { StoreCategory } from "@/lib/demo-data";

export function MegaMenu({ categories }: { categories: StoreCategory[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden md:block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="inline-flex h-10 items-center gap-1 text-sm font-bold text-stone-800 hover:text-violet-700">
        Productos <ChevronDown className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute left-1/2 top-full z-50 w-[880px] -translate-x-1/2 rounded-b-xl border border-stone-200 bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="grid grid-cols-3 gap-x-8 gap-y-6">
              {categories.map((category) => (
                <div key={category.id}>
                  <Link href={`/catalogo?categoria=${category.slug}`} className="text-sm font-black uppercase tracking-wide text-violet-800">
                    {category.name}
                  </Link>
                  <div className="mt-3 grid gap-2">
                    {(category.children ?? []).slice(0, 8).map((child) => (
                      <Link key={child.id} href={`/catalogo?categoria=${category.slug}&subcategoria=${child.slug}`} className="text-sm text-stone-600 hover:text-stone-950">
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function MobileMenu({ categories }: { categories: StoreCategory[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(categories[0]?.id ?? null);

  return (
    <>
      <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 md:hidden" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {open ? (
          <>
            <motion.button className="fixed inset-0 z-50 bg-stone-950/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="fixed left-0 top-0 z-50 h-dvh w-[86vw] max-w-sm overflow-auto bg-white p-5 shadow-2xl" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}>
              <div className="flex items-center justify-between">
                <p className="text-xl font-black text-stone-950">Productos</p>
                <button className="grid h-10 w-10 place-items-center rounded-md border border-stone-200" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 grid gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="rounded-lg border border-stone-200">
                    <button className="flex w-full items-center justify-between px-4 py-3 font-black" onClick={() => setExpanded(expanded === category.id ? null : category.id)}>
                      {category.name}
                      <ChevronDown className={`h-4 w-4 transition ${expanded === category.id ? "rotate-180" : ""}`} />
                    </button>
                    {expanded === category.id ? (
                      <div className="grid gap-2 border-t border-stone-100 px-4 py-3">
                        <Link onClick={() => setOpen(false)} href={`/catalogo?categoria=${category.slug}`} className="text-sm font-bold text-violet-800">
                          Ver todo
                        </Link>
                        {(category.children ?? []).map((child) => (
                          <Link key={child.id} onClick={() => setOpen(false)} href={`/catalogo?categoria=${category.slug}&subcategoria=${child.slug}`} className="text-sm text-stone-600">
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
