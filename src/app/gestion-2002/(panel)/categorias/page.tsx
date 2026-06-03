import Image from "next/image";
import { AlertTriangle, Eye, EyeOff, ImageOff, Save } from "lucide-react";
import { deleteCategory, removeCategoryImage, toggleCategoryActive, upsertCategory } from "@/app/gestion-2002/actions";
import { AdminConfirmSubmitButton } from "@/components/admin-confirm-submit-button";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { cn } from "@/lib/utils";
import { getPrisma, hasDatabase } from "@/lib/prisma";

type SearchParams = Promise<{ ok?: string; error?: string }>;

export default async function AdminCategoriesPage({ searchParams }: { searchParams: SearchParams }) {
  if (!hasDatabase()) return <AdminNotice title="Categorias" />;

  const params = await searchParams;
  const prisma = getPrisma();
  const [categories, productRefs] = await Promise.all([
    prisma.category.findMany({
      include: { parent: true, children: { select: { id: true } } },
      orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.product.findMany({ select: { categoryId: true, subcategoryId: true } }),
  ]);
  const parents = categories.filter((category) => !category.parentId);
  const productCountByCategory = new Map<string, number>();
  for (const product of productRefs) {
    productCountByCategory.set(product.categoryId, (productCountByCategory.get(product.categoryId) ?? 0) + 1);
    if (product.subcategoryId) {
      productCountByCategory.set(product.subcategoryId, (productCountByCategory.get(product.subcategoryId) ?? 0) + 1);
    }
  }

  return (
    <div className="grid gap-6">
      <header className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-emerald-700">Catalogo</p>
        <h1 className="mt-1 text-3xl font-black text-stone-950">Categorias y subcategorias</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
          Organiza el menu de productos. Guardar una categoria, quitar una imagen y eliminar una categoria son acciones separadas.
        </p>
      </header>

      {params.ok ? <Notice tone="ok" text={params.ok} /> : null}
      {params.error ? <Notice tone="error" text={params.error} /> : null}

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-stone-950">Crear nueva categoria</h2>
          <p className="text-sm text-stone-600">La categoria queda visible en la tienda al guardarla. La imagen es opcional.</p>
        </div>
        <form action={upsertCategory} className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre">
              <input name="name" placeholder="Ej: Cocina" required className={inputClass} />
            </Field>
            <Field label="Direccion corta" help="Texto que aparece en la URL. Si lo dejas vacio se genera con el nombre.">
              <input name="slug" placeholder="cocina" className={inputClass} />
            </Field>
          </div>
          <Field label="Descripcion">
            <textarea name="description" placeholder="Texto breve para mostrar en bloques de la tienda" rows={3} className={textareaClass} />
          </Field>
          <div className="grid gap-4 md:grid-cols-[1fr_220px_160px]">
            <AdminImageUpload label="Imagen de categoria" name="imageUrl" scope="categories" hint="Se usa en home, catalogo y bloques visuales." />
            <Field label="Ubicacion">
              <select name="parentId" className={inputClass}>
                <option value="">Categoria principal</option>
                {parents.map((category) => (
                  <option key={category.id} value={category.id}>Subcategoria de {category.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Orden">
              <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
            </Field>
          </div>
          <input type="hidden" name="active" value="on" />
          <button className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-emerald-700 px-5 font-bold text-white">
            <Save size={17} />
            Crear categoria
          </button>
        </form>
      </section>

      <section className="grid gap-4">
        {categories.map((category) => {
          const products = productCountByCategory.get(category.id) ?? 0;
          const children = category.children.length;
          const canDelete = products === 0 && children === 0;

          return (
            <article key={category.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
              <div className="grid gap-5 p-5 lg:grid-cols-[220px_1fr]">
                <div>
                  <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                    {category.imageUrl ? (
                      <Image src={category.imageUrl} alt={category.name} fill className="object-cover" unoptimized={category.imageUrl.endsWith(".svg") || category.imageUrl.endsWith(".ico")} />
                    ) : (
                      <div className="grid place-items-center gap-2 text-center text-sm font-semibold text-stone-400">
                        <ImageOff className="mx-auto h-7 w-7" />
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone={category.active ? "ok" : "muted"}>{category.active ? "Visible" : "Oculta"}</Badge>
                    <Badge tone="muted">{category.parent ? "Subcategoria" : "Principal"}</Badge>
                    <Badge tone={products ? "warning" : "muted"}>{products} productos</Badge>
                    {children ? <Badge tone="warning">{children} subcategorias</Badge> : null}
                  </div>
                </div>

                <div className="grid gap-4">
                  <form action={upsertCategory} className="grid gap-4">
                    <input type="hidden" name="id" value={category.id} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Nombre">
                        <input name="name" defaultValue={category.name} required className={inputClass} />
                      </Field>
                      <Field label="Direccion corta" help="Ejemplo: cocina, mesa, regalos. Evita espacios y simbolos.">
                        <input name="slug" defaultValue={category.slug} className={inputClass} />
                      </Field>
                    </div>
                    <Field label="Descripcion">
                      <textarea name="description" defaultValue={category.description ?? ""} rows={3} className={textareaClass} />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-[1fr_220px_160px]">
                      <AdminImageUpload label="Imagen publica" name="imageUrl" scope="categories" value={category.imageUrl} />
                      <Field label="Ubicacion">
                        <select name="parentId" defaultValue={category.parentId ?? ""} className={inputClass}>
                          <option value="">Categoria principal</option>
                          {parents.filter((parent) => parent.id !== category.id).map((parent) => (
                            <option key={parent.id} value={parent.id}>Subcategoria de {parent.name}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Orden">
                        <input name="sortOrder" type="number" defaultValue={category.sortOrder} className={inputClass} />
                      </Field>
                    </div>
                    <label className="flex items-center gap-2 text-sm font-bold text-stone-800">
                      <input name="active" type="checkbox" defaultChecked={category.active} />
                      Mostrar en tienda y menu
                    </label>
                    <button className="inline-flex h-10 w-fit items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-bold text-white">
                      <Save size={16} />
                      Guardar cambios
                    </button>
                  </form>

                  <div className="grid gap-3 rounded-lg border border-stone-100 bg-stone-50 p-4 md:grid-cols-3">
                    <form action={removeCategoryImage}>
                      <input type="hidden" name="id" value={category.id} />
                      <button disabled={!category.imageUrl} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-bold text-stone-800 disabled:cursor-not-allowed disabled:opacity-45">
                        <ImageOff size={16} />
                        Quitar imagen
                      </button>
                    </form>
                    <form action={toggleCategoryActive}>
                      <input type="hidden" name="id" value={category.id} />
                      <input type="hidden" name="active" value={category.active ? "false" : "true"} />
                      <button className={cn("inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-3 text-sm font-bold", category.active ? "border border-amber-300 bg-amber-50 text-amber-900" : "border border-emerald-200 bg-emerald-50 text-emerald-800")}>
                        {category.active ? <EyeOff size={16} /> : <Eye size={16} />}
                        {category.active ? "Ocultar en tienda" : "Mostrar en tienda"}
                      </button>
                    </form>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <AdminConfirmSubmitButton disabled={!canDelete} message="Vas a eliminar la categoria definitivamente. Esta accion no se puede deshacer. Confirmas?">
                        Eliminar categoria
                      </AdminConfirmSubmitButton>
                    </form>
                  </div>
                  {!canDelete ? (
                    <p className="flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      Para eliminarla primero reasigna sus productos y elimina o mueve sus subcategorias. Si solo no queres mostrarla, usa Ocultar en tienda.
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

const inputClass = "h-11 rounded-md border border-stone-200 px-3 text-sm outline-none focus:border-emerald-600";
const textareaClass = "rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-600";

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-stone-800">
      <span>{label}</span>
      {children}
      {help ? <span className="text-xs font-medium leading-5 text-stone-500">{help}</span> : null}
    </label>
  );
}

function Badge({ tone, children }: { tone: "ok" | "warning" | "muted"; children: React.ReactNode }) {
  const styles = tone === "ok" ? "bg-emerald-100 text-emerald-800" : tone === "warning" ? "bg-amber-100 text-amber-900" : "bg-stone-100 text-stone-700";
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-black", styles)}>{children}</span>;
}

function Notice({ tone, text }: { tone: "ok" | "error"; text: string }) {
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-sm font-bold", tone === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-800")}>
      {text}
    </div>
  );
}

function AdminNotice({ title }: { title: string }) {
  return <div className="rounded-lg border border-amber-200 bg-amber-50 p-6"><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 text-sm">El panel necesita la base de datos conectada para administrar esta seccion.</p></div>;
}
