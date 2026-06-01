import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatMoney } from "@/lib/utils";
import type { StoreProduct } from "@/lib/demo-data";

export function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          <Image
            src={product.images[0]?.url ?? "/product-fallback.svg"}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {product.onSale ? (
              <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">Oferta</span>
            ) : null}
            {product.featured ? (
              <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-bold text-white">Destacado</span>
            ) : null}
          </div>
          <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <AddToCartButton product={product} className="w-full shadow-lg" />
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{product.category.name}</p>
          <Link href={`/producto/${product.slug}`} className="mt-1 block text-lg font-semibold text-stone-950">
            {product.name}
          </Link>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-stone-950">{formatMoney(product.price)}</p>
            {product.previousPrice ? (
              <p className="text-sm text-stone-400 line-through">{formatMoney(product.previousPrice)}</p>
            ) : null}
          </div>
          <AddToCartButton product={product} className="hidden sm:inline-flex" />
        </div>
      </div>
    </article>
  );
}
