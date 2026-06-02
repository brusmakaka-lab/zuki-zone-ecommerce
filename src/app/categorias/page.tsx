import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/data";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Categorias</p>
        <h1 className="mt-2 text-4xl font-black text-stone-950">Compra por ambiente o necesidad</h1>
        <p className="mt-2 max-w-2xl text-stone-600">Explora rubros principales y encontra mas rapido lo que estas buscando.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/catalogo?categoria=${category.slug}`} className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="relative aspect-[5/3] bg-stone-100">
              <Image src={category.imageUrl ?? "/product-fallback.svg"} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-black text-stone-950">{category.name}</h2>
              {category.description ? <p className="mt-2 text-sm leading-6 text-stone-600">{category.description}</p> : null}
              {category.children?.length ? (
                <p className="mt-3 text-xs font-bold uppercase text-emerald-700">{category.children.length} subcategorias</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
