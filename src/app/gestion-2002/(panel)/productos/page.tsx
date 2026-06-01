import { deleteProduct, upsertProduct } from "@/app/gestion-2002/actions";
import { getPrisma, hasDatabase } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export default async function AdminProductsPage() {
  if (!hasDatabase()) return <AdminNotice title="Productos" />;
  const prisma = getPrisma();
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true, images: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-black text-stone-950">Productos</h1>
      <form action={upsertProduct} className="mt-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-black">Crear producto</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="name" placeholder="Nombre" required className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="slug" placeholder="Slug opcional" className="h-11 rounded-md border border-stone-200 px-3" />
        </div>
        <textarea name="description" placeholder="Descripcion" required rows={3} className="rounded-md border border-stone-200 px-3 py-2" />
        <div className="grid gap-4 md:grid-cols-4">
          <input name="price" type="number" placeholder="Precio" required className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="previousPrice" type="number" placeholder="Precio anterior" className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="stock" type="number" placeholder="Stock" required className="h-11 rounded-md border border-stone-200 px-3" />
          <select name="categoryId" required className="h-11 rounded-md border border-stone-200 px-3">
            <option value="">Categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <input name="imageUrl" placeholder="/product-mi-producto.svg o URL de Blob" required className="h-11 rounded-md border border-stone-200 px-3" />
        <div className="flex flex-wrap gap-4 text-sm font-semibold">
          <label><input type="checkbox" name="featured" /> Destacado</label>
          <label><input type="checkbox" name="onSale" /> Oferta</label>
          <label><input type="checkbox" name="published" defaultChecked /> Publicado</label>
          <label><input type="checkbox" name="active" defaultChecked /> Activo</label>
        </div>
        <button className="h-11 rounded-md bg-emerald-700 px-5 font-bold text-white md:w-fit">Guardar producto</button>
      </form>
      <div className="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-600">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Estado</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-stone-100">
                <td className="p-3 font-bold">{product.name}</td>
                <td className="p-3">{product.category.name}</td>
                <td className="p-3">{formatMoney(Number(product.price))}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">{product.published && product.active ? "Publicado" : "Oculto"}</td>
                <td className="p-3 text-right">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button className="font-bold text-rose-700">Eliminar</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminNotice({ title }: { title: string }) {
  return <div className="rounded-lg border border-amber-200 bg-amber-50 p-6"><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 text-sm">Configura DATABASE_URL para administrar.</p></div>;
}
