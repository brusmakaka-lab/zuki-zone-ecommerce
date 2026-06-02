import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/data";

export default async function OffersPage() {
  const products = await getProducts({ onSale: true });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">Ofertas</p>
          <h1 className="mt-2 text-4xl font-black text-stone-950">Oportunidades para tu casa</h1>
          <p className="mt-2 text-stone-600">Productos seleccionados con precio especial por tiempo limitado o hasta agotar stock.</p>
        </div>
        <Link href="/catalogo" className="rounded-md border border-stone-300 px-4 py-2 text-sm font-bold text-stone-900">Ver catalogo completo</Link>
      </div>
      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-stone-200 bg-white p-10 text-center">
          <h2 className="text-xl font-black text-stone-950">No hay ofertas activas ahora</h2>
          <p className="mt-2 text-stone-600">Mientras tanto, podes recorrer el catalogo completo.</p>
          <Link href="/catalogo" className="mt-5 inline-flex rounded-md bg-emerald-700 px-5 py-3 font-bold text-white">Ver productos</Link>
        </div>
      )}
    </main>
  );
}
