import { deleteProduct, upsertProduct } from "@/app/gestion-2002/actions";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { getPrisma, hasDatabase } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export default async function AdminProductsPage() {
  if (!hasDatabase()) return <AdminNotice title="Productos" />;
  const prisma = getPrisma();
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true, images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }] } }, orderBy: { createdAt: "desc" } }),
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
        <AdminImageUpload label="Imagen principal" name="mainImageUrl" scope="products" required hint="La card del catalogo usa esta imagen. Tambien se guarda en la galeria." />
        <label className="grid gap-2 text-sm font-bold text-stone-800">
          Galeria de imagenes
          <textarea name="imageUrls" rows={4} placeholder="Una URL por linea" className="rounded-md border border-stone-200 px-3 py-2 font-normal" />
        </label>
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
      <section className="mt-6 grid gap-4">
        <h2 className="text-xl font-black text-stone-950">Editar imagenes existentes</h2>
        {products.map((product) => (
          <form key={product.id} action={upsertProduct} className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4">
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="name" value={product.name} />
            <input type="hidden" name="slug" value={product.slug} />
            <input type="hidden" name="description" value={product.description} />
            <input type="hidden" name="price" value={Number(product.price)} />
            <input type="hidden" name="previousPrice" value={product.previousPrice ? Number(product.previousPrice) : ""} />
            <input type="hidden" name="stock" value={product.stock} />
            <input type="hidden" name="categoryId" value={product.categoryId} />
            {product.featured ? <input type="hidden" name="featured" value="on" /> : null}
            {product.onSale ? <input type="hidden" name="onSale" value="on" /> : null}
            {product.published ? <input type="hidden" name="published" value="on" /> : null}
            {product.active ? <input type="hidden" name="active" value="on" /> : null}
            <p className="font-black">{product.name}</p>
            <AdminImageUpload label="Nueva imagen principal" name="mainImageUrl" scope="products" value={product.images[0]?.url} />
            <label className="grid gap-2 text-sm font-bold text-stone-800">
              Galeria persistida
              <textarea
                name="imageUrls"
                rows={Math.max(3, product.images.length + 1)}
                defaultValue={product.images.map((image) => image.url).join("\n")}
                className="rounded-md border border-stone-200 px-3 py-2 font-normal"
              />
            </label>
            <button className="h-10 rounded-md bg-violet-700 px-4 font-bold text-white md:w-fit">Guardar imagenes</button>
          </form>
        ))}
      </section>
    </div>
  );
}

function AdminNotice({ title }: { title: string }) {
  return <div className="rounded-lg border border-amber-200 bg-amber-50 p-6"><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 text-sm">Configura DATABASE_URL para administrar.</p></div>;
}
