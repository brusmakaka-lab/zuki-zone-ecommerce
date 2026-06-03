import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatMoney } from "@/lib/utils";
import type { StoreProduct } from "@/lib/demo-data";

export function ProductCard({ product }: { product: StoreProduct }) {
  const discount = product.previousPrice
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0;
  const lowStock = product.stock > 0 && product.stock <= (product.minStock ?? 3);
  const image = product.images[0];
  const badges = [
    product.onSale ? { label: discount ? `${discount}% off` : "Oferta", className: "bg-rose-600 text-white" } : null,
    lowStock ? { label: "Ultimas", className: "bg-amber-500 text-white" } : null,
    !product.onSale && product.isNew ? { label: "Nuevo", className: "bg-emerald-700 text-white" } : null,
    !product.onSale && !product.isNew && product.featured ? { label: "Seleccionado", className: "bg-stone-900 text-white" } : null,
  ].filter(Boolean).slice(0, 2) as { label: string; className: string }[];

  return (
    <article className="group grid grid-cols-[128px_1fr] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:ring-emerald-100 sm:block">
      <Link href={`/producto/${product.slug}`} className="block h-full sm:h-auto">
        <div className="relative h-full min-h-40 overflow-hidden bg-[radial-gradient(circle_at_20%_15%,#fef3c7,transparent_28%),linear-gradient(135deg,#f8fafc,#e0f2fe_48%,#dcfce7)] sm:aspect-[4/3] sm:h-auto sm:min-h-0">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized={image.url.endsWith(".svg") || image.url.endsWith(".ico")}
            />
          ) : (
            <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#fef3c7,transparent_30%),linear-gradient(135deg,#f8fafc,#e0f2fe_48%,#dcfce7)] p-5 text-center">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-emerald-800">{product.category.name}</p>
                <p className="mt-2 text-lg font-black leading-tight text-stone-950">{product.name}</p>
              </div>
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge.label} className={`rounded-full px-2.5 py-1 text-[11px] font-black shadow-sm ${badge.className}`}>{badge.label}</span>
            ))}
          </div>
          <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <AddToCartButton product={product} className="w-full shadow-lg" />
          </div>
        </div>
      </Link>
      <div className="flex min-w-0 flex-col justify-between gap-3 p-3 sm:block sm:space-y-4 sm:p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{product.category.name}</p>
          <Link href={`/producto/${product.slug}`} className="mt-1 line-clamp-2 block text-base font-black leading-tight text-stone-950 sm:text-lg sm:font-semibold">
            {product.name}
          </Link>
          {product.shortDescription ? <p className="mt-2 hidden line-clamp-2 text-sm leading-6 text-stone-500 sm:block">{product.shortDescription}</p> : null}
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-black leading-tight text-stone-950">{formatMoney(product.price)}</p>
            {product.previousPrice ? (
              <p className="text-sm text-stone-400 line-through">{formatMoney(product.previousPrice)}</p>
            ) : null}
          </div>
          <AddToCartButton product={product} className="hidden sm:inline-flex" />
        </div>
        <AddToCartButton product={product} className="h-10 w-full sm:hidden" />
      </div>
    </article>
  );
}
