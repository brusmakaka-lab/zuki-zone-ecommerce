import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/data";

type SearchParams = Promise<{
  categoria?: string;
  q?: string;
  destacado?: string;
  oferta?: string;
  min?: string;
  max?: string;
}>;

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      category: params.categoria,
      q: params.q,
      featured: params.destacado === "1",
      onSale: params.oferta === "1",
      min: params.min ? Number(params.min) : undefined,
      max: params.max ? Number(params.max) : undefined,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">Catalogo</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-stone-950 sm:text-4xl">Productos disponibles</h1>
        </div>
        <form className="grid gap-3 rounded-lg border border-stone-200 bg-white p-3 shadow-sm md:grid-cols-5">
          <input name="q" defaultValue={params.q} placeholder="Buscar" className="h-10 rounded-md border border-stone-200 px-3 text-sm outline-emerald-700" />
          <select name="categoria" defaultValue={params.categoria ?? ""} className="h-10 rounded-md border border-stone-200 px-3 text-sm">
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <input name="min" defaultValue={params.min} placeholder="Precio min." className="h-10 rounded-md border border-stone-200 px-3 text-sm" />
          <input name="max" defaultValue={params.max} placeholder="Precio max." className="h-10 rounded-md border border-stone-200 px-3 text-sm" />
          <button className="h-10 rounded-md bg-stone-950 px-4 text-sm font-bold text-white">Filtrar</button>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="destacado" value="1" defaultChecked={params.destacado === "1"} /> Destacados
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="oferta" value="1" defaultChecked={params.oferta === "1"} /> Ofertas
          </label>
          <Link href="/catalogo" className="text-sm font-semibold text-emerald-800 md:col-span-3 md:self-center">
            Limpiar filtros
          </Link>
        </form>
      </div>
      {categories.length ? (
        <div className="mb-8 flex snap-x gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.slice(0, 8).map((category) => (
            <Link key={category.id} href={`/catalogo?categoria=${category.slug}`} className="group relative h-24 w-44 flex-none snap-start overflow-hidden rounded-lg bg-stone-900 text-white shadow-sm">
              {category.imageUrl ? (
                <Image src={category.imageUrl} alt={category.name} fill sizes="176px" className="object-cover opacity-75 transition duration-500 group-hover:scale-105" unoptimized={category.imageUrl.endsWith(".svg") || category.imageUrl.endsWith(".ico")} />
              ) : (
                <div className="h-full bg-[radial-gradient(circle_at_20%_15%,#fef3c7,transparent_28%),linear-gradient(135deg,#f8fafc,#e0f2fe_48%,#dcfce7)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 to-stone-950/10" />
              <span className="absolute bottom-3 left-3 right-3 text-sm font-black leading-tight">{category.name}</span>
            </Link>
          ))}
        </div>
      ) : null}
      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-stone-200 bg-white p-10 text-center">
          <p className="text-lg font-bold text-stone-950">No encontramos productos con esos filtros.</p>
          <Link href="/catalogo" className="mt-4 inline-flex rounded-md bg-emerald-700 px-5 py-3 font-bold text-white">
            Ver catalogo completo
          </Link>
        </div>
      )}
    </div>
  );
}
