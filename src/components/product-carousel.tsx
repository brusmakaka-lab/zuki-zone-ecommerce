"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { StoreProduct } from "@/lib/demo-data";

export function ProductCarousel({ title, products, action }: { title: string; products: StoreProduct[]; action?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    ref.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-stone-950">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <button className="grid h-10 w-10 place-items-center rounded-md border border-stone-200 bg-white" onClick={() => scroll(-1)} aria-label="Anterior">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-stone-200 bg-white" onClick={() => scroll(1)} aria-label="Siguiente">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex snap-x gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div key={product.id} className="w-[280px] flex-none snap-start sm:w-[310px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
