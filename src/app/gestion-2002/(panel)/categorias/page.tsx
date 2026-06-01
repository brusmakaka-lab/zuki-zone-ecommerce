import { upsertCategory } from "@/app/gestion-2002/actions";
import { getPrisma, hasDatabase } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  if (!hasDatabase()) return <AdminNotice title="Categorias" />;
  const categories = await getPrisma().category.findMany({ include: { parent: true }, orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }] });
  const parents = categories.filter((category) => !category.parentId);

  return (
    <div>
      <h1 className="text-3xl font-black text-stone-950">Categorias</h1>
      <form action={upsertCategory} className="mt-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-black">Crear categoria</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <input name="name" placeholder="Nombre" required className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="slug" placeholder="Slug" className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="imageUrl" placeholder="Imagen" className="h-11 rounded-md border border-stone-200 px-3" />
          <select name="parentId" className="h-11 rounded-md border border-stone-200 px-3">
            <option value="">Categoria principal</option>
            {parents.map((category) => (
              <option key={category.id} value={category.id}>Subcategoria de {category.name}</option>
            ))}
          </select>
        </div>
        <textarea name="description" placeholder="Descripcion" rows={3} className="rounded-md border border-stone-200 px-3 py-2" />
        <button className="h-11 rounded-md bg-emerald-700 px-5 font-bold text-white md:w-fit">Guardar categoria</button>
      </form>
      <div className="mt-6 grid gap-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="font-black">{category.parent ? `${category.parent.name} / ${category.name}` : category.name}</p>
            <p className="text-sm text-stone-500">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminNotice({ title }: { title: string }) {
  return <div className="rounded-lg border border-amber-200 bg-amber-50 p-6"><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 text-sm">Configura DATABASE_URL para administrar.</p></div>;
}
