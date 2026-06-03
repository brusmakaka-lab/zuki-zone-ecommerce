"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  ArrowUpDown,
  BadgePercent,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Grid2X2,
  ImageOff,
  ImagePlus,
  Layers3,
  Package,
  Plus,
  Search,
  Star,
  Table2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  archiveProduct,
  bulkUpdateProducts,
  deleteProduct,
  duplicateProduct,
  permanentlyDeleteProduct,
  restoreProduct,
  updateProductQuickAction,
  upsertProduct,
} from "@/app/gestion-2002/actions";
import { cn, formatMoney, slugify } from "@/lib/utils";

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  description: string;
  price: number;
  previousPrice: number | null;
  stock: number;
  minStock: number;
  tags: string[];
  featured: boolean;
  onSale: boolean;
  isNew: boolean;
  published: boolean;
  active: boolean;
  archivedAt: string | null;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string;
  subcategoryId: string | null;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  images: { id: string; url: string; alt: string | null; isMain: boolean; sortOrder: number }[];
};

type Props = {
  products: AdminProduct[];
  categories: AdminCategory[];
};

const tabs = ["Basico", "Precio y stock", "Categoria", "Imagenes", "Publicacion"] as const;

export function AdminProductsManager({ products, categories }: Props) {
  const searchParams = useSearchParams();
  const okMessage = searchParams.get("ok");
  const errorMessage = searchParams.get("error");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [status, setStatus] = useState("all");
  const [stock, setStock] = useState("all");
  const [flag, setFlag] = useState("all");
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "1") || 1);
  const initialEditing = products.find((item) => item.id === searchParams.get("edit")) ?? null;
  const [editing, setEditing] = useState<AdminProduct | null>(initialEditing);
  const [selected, setSelected] = useState<string[]>([]);

  const parents = categories.filter((category) => !category.parentId);
  const subcategories = categories.filter((category) => category.parentId);
  const pageSize = 20;

  const metrics = useMemo(
    () => ({
      total: products.filter((product) => !product.archivedAt).length,
      published: products.filter((product) => !product.archivedAt && product.published && product.active).length,
      noStock: products.filter((product) => !product.archivedAt && product.stock <= 0).length,
      sale: products.filter((product) => product.onSale).length,
      featured: products.filter((product) => product.featured).length,
      drafts: products.filter((product) => !product.archivedAt && (!product.published || !product.active)).length,
      archived: products.filter((product) => product.archivedAt).length,
      withoutImage: products.filter((product) => !product.archivedAt && !product.images.length).length,
      lowStock: products.filter((product) => !product.archivedAt && product.stock > 0 && product.stock <= product.minStock).length,
    }),
    [products],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products
      .filter((product) => {
        const matchesQuery =
          !normalizedQuery ||
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery) ||
          product.shortDescription?.toLowerCase().includes(normalizedQuery) ||
          product.sku?.toLowerCase().includes(normalizedQuery);
        const matchesCategory = !categoryId || product.categoryId === categoryId;
        const matchesSubcategory = !subcategoryId || product.subcategoryId === subcategoryId;
        const matchesStatus =
          status === "all" ||
          (status === "published" && product.published && product.active) ||
          (status === "hidden" && !product.archivedAt && (!product.published || !product.active)) ||
          (status === "archived" && Boolean(product.archivedAt));
        const matchesStock =
          stock === "all" ||
          (stock === "available" && product.stock > product.minStock) ||
          (stock === "low" && product.stock > 0 && product.stock <= product.minStock) ||
          (stock === "empty" && product.stock <= 0);
        const matchesFlag =
          flag === "all" ||
          (flag === "sale" && product.onSale) ||
          (flag === "featured" && product.featured) ||
          (flag === "new" && product.isNew);
        const matchesArchive = status === "archived" || !product.archivedAt;
        return matchesArchive && matchesQuery && matchesCategory && matchesSubcategory && matchesStatus && matchesStock && matchesFlag;
      })
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "price") return b.price - a.price;
        if (sort === "stock") return a.stock - b.stock;
        if (sort === "category") return a.categoryName.localeCompare(b.categoryName);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [categoryId, flag, products, query, sort, status, stock, subcategoryId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    params.delete("page");
    const next = params.toString();
    window.history.replaceState(null, "", next ? `?${next}` : window.location.pathname);
  }

  function goToPage(nextPage: number) {
    const bounded = Math.max(1, Math.min(nextPage, totalPages));
    setPage(bounded);
    const params = new URLSearchParams(window.location.search);
    if (bounded > 1) params.set("page", String(bounded));
    else params.delete("page");
    const next = params.toString();
    window.history.replaceState(null, "", next ? `?${next}` : window.location.pathname);
  }

  function toggleSelected(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleAllVisible() {
    const visibleIds = paginated.map((product) => product.id);
    const allVisibleSelected = visibleIds.every((id) => selected.includes(id));
    setSelected(allVisibleSelected ? selected.filter((id) => !visibleIds.includes(id)) : Array.from(new Set([...selected, ...visibleIds])));
  }

  return (
    <div className="grid gap-6">
      {okMessage ? <AdminNotice type="ok" message={okMessage} /> : null}
      {errorMessage ? <AdminNotice type="error" message={errorMessage} /> : null}

      <header className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-emerald-700">Catalogo</p>
          <h1 className="mt-1 text-3xl font-black text-stone-950">Productos</h1>
          <p className="mt-1 text-sm text-stone-500">Gestiona el catalogo de la tienda con busqueda, filtros y acciones rapidas.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/gestion-2002/categorias" className="inline-flex h-11 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-800 hover:bg-stone-50">
            <Layers3 size={18} />
            Categorias
          </Link>
          <button type="button" className="inline-flex h-11 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-800 hover:bg-stone-50">
            <Upload size={18} />
            Importar / Exportar
          </button>
          <button onClick={() => setEditing(emptyProduct(parents[0]?.id ?? ""))} className="inline-flex h-11 items-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-emerald-800">
            <Plus size={18} />
            Nuevo producto
          </button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Metric label="Total productos" value={metrics.total} icon={<Package size={18} />} />
        <Metric label="Publicados" value={metrics.published} icon={<Eye size={18} />} />
        <Metric label="Sin stock" value={metrics.noStock} icon={<Boxes size={18} />} danger />
        <Metric label="En oferta" value={metrics.sale} icon={<BadgePercent size={18} />} />
        <Metric label="Destacados" value={metrics.featured} icon={<Star size={18} />} />
        <Metric label="Ocultos" value={metrics.drafts} icon={<EyeOff size={18} />} />
        <Metric label="Archivados" value={metrics.archived} icon={<Trash2 size={18} />} />
      </section>

      {(metrics.withoutImage || metrics.noStock || metrics.lowStock) ? (
        <section className="grid gap-3 lg:grid-cols-3">
          {metrics.withoutImage ? <AlertCard icon={<ImageOff size={18} />} title="Productos sin imagen" text={`${metrics.withoutImage} productos necesitan imagen para verse mejor en catalogo.`} /> : null}
          {metrics.noStock ? <AlertCard icon={<Boxes size={18} />} title="Productos sin stock" text={`${metrics.noStock} productos no se pueden vender hasta reponer stock.`} danger /> : null}
          {metrics.lowStock ? <AlertCard icon={<AlertTriangle size={18} />} title="Stock bajo" text={`${metrics.lowStock} productos estan cerca de agotarse.`} /> : null}
        </section>
      ) : null}

      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(5,1fr)_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-3 text-stone-400" size={18} />
            <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Buscar por nombre, SKU o descripcion" className="h-11 w-full rounded-md border border-stone-200 pl-10 pr-3 text-sm outline-none focus:border-emerald-600" />
          </label>
          <Select value={categoryId} onChange={setCategoryId}>
            <option value="">Todas las categorias</option>
            {parents.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </Select>
          <Select value={subcategoryId} onChange={setSubcategoryId}>
            <option value="">Todas las subcategorias</option>
            {subcategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </Select>
          <Select value={status} onChange={setStatus}>
            <option value="all">Todos los estados</option>
            <option value="published">Publicado</option>
            <option value="hidden">Oculto</option>
            <option value="archived">Archivados</option>
          </Select>
          <Select value={stock} onChange={setStock}>
            <option value="all">Todo stock</option>
            <option value="available">Con stock</option>
            <option value="low">Bajo stock</option>
            <option value="empty">Sin stock</option>
          </Select>
          <Select value={flag} onChange={setFlag}>
            <option value="all">Todos</option>
            <option value="sale">Ofertas</option>
            <option value="featured">Destacados</option>
            <option value="new">Producto nuevo</option>
          </Select>
          <div className="flex gap-2">
            <Select value={sort} onChange={setSort} icon={<ArrowUpDown size={16} />}>
              <option value="recent">Mas reciente</option>
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
              <option value="stock">Stock</option>
              <option value="category">Categoria</option>
            </Select>
            <button title="Vista tabla" onClick={() => setView("table")} className={cn("h-11 w-11 rounded-md border border-stone-200", view === "table" && "bg-stone-950 text-white")}>
              <Table2 className="mx-auto" size={18} />
            </button>
            <button title="Vista cards" onClick={() => setView("cards")} className={cn("h-11 w-11 rounded-md border border-stone-200", view === "cards" && "bg-stone-950 text-white")}>
              <Grid2X2 className="mx-auto" size={18} />
            </button>
          </div>
        </div>
        <BulkBar selected={selected} categories={parents} onClear={() => setSelected([])} />
      </section>

      {filtered.length ? (
        view === "table" ? (
          <ProductTable products={paginated} selected={selected} onToggle={toggleSelected} onToggleAll={toggleAllVisible} onEdit={setEditing} />
        ) : (
          <ProductCards products={paginated} selected={selected} onToggle={toggleSelected} onEdit={setEditing} />
        )
      ) : (
        <EmptyProducts onCreate={() => setEditing(emptyProduct(parents[0]?.id ?? ""))} />
      )}

      {filtered.length ? (
        <Pagination current={safePage} total={totalPages} totalItems={filtered.length} pageSize={pageSize} onPage={goToPage} />
      ) : null}

      {editing ? (
        <ProductEditor product={editing} categories={categories} onClose={() => setEditing(null)} />
      ) : null}
    </div>
  );
}

function ProductTable({
  products,
  selected,
  onToggle,
  onToggleAll,
  onEdit,
}: {
  products: AdminProduct[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onEdit: (product: AdminProduct) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-stone-100 text-xs uppercase text-stone-500">
            <tr>
              <th className="w-10 p-3">
                <input type="checkbox" onChange={onToggleAll} checked={products.every((product) => selected.includes(product.id)) && products.length > 0} />
              </th>
              <th className="p-3">Producto</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Oferta</th>
              <th className="p-3">Destacado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-stone-100 align-middle">
                <td className="p-3"><input type="checkbox" checked={selected.includes(product.id)} onChange={() => onToggle(product.id)} /></td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <ProductThumb product={product} />
                    <div>
                      <p className="font-black text-stone-950">{product.name}</p>
                      <p className="text-xs text-stone-500">{product.sku || product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{product.categoryName}</td>
                <td className="p-3 font-bold">{formatMoney(product.price)}</td>
                <td className="p-3"><StockBadge product={product} /></td>
                <td className="p-3"><StatusBadge product={product} /></td>
                <td className="p-3"><QuickToggle product={product} action="onSale" active={product.onSale} label="Oferta" /></td>
                <td className="p-3"><QuickToggle product={product} action="featured" active={product.featured} label="Destacado" /></td>
                <td className="p-3">
                  <ProductActions product={product} onEdit={() => onEdit(product)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductCards({
  products,
  selected,
  onToggle,
  onEdit,
}: {
  products: AdminProduct[];
  selected: string[];
  onToggle: (id: string) => void;
  onEdit: (product: AdminProduct) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="relative aspect-[4/3] bg-stone-100">
            <input className="absolute left-3 top-3 z-10" type="checkbox" checked={selected.includes(product.id)} onChange={() => onToggle(product.id)} />
            <ProductImage product={product} />
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              <StatusBadge product={product} />
              {product.onSale ? <Badge className="bg-rose-100 text-rose-800">Oferta</Badge> : null}
              {product.featured ? <Badge className="bg-amber-100 text-amber-800">Destacado</Badge> : null}
            </div>
          </div>
          <div className="grid gap-3 p-4">
            <div>
              <h2 className="font-black text-stone-950">{product.name}</h2>
              <p className="text-sm text-stone-500">{product.categoryName}</p>
            </div>
            <div className="flex items-center justify-between">
              <strong>{formatMoney(product.price)}</strong>
              <StockBadge product={product} />
            </div>
            <ProductActions product={product} onEdit={() => onEdit(product)} />
          </div>
        </article>
      ))}
    </div>
  );
}

function ProductEditor({ product, categories, onClose }: { product: AdminProduct; categories: AdminCategory[]; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Basico");
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [subcategoryId, setSubcategoryId] = useState(product.subcategoryId ?? "");
  const [images, setImages] = useState(product.images.map((image) => image.url));
  const [mainImage, setMainImage] = useState(product.images.find((image) => image.isMain)?.url ?? product.images[0]?.url ?? "");
  const [state, action, pending] = useActionState(upsertProduct, null);
  const parents = categories.filter((category) => !category.parentId);
  const children = categories.filter((category) => category.parentId === categoryId);

  function closeWithCheck() {
    if (confirm("Si hay cambios sin guardar se van a perder. Queres cerrar?")) onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/45 p-3 backdrop-blur-sm">
      <div className="mx-auto my-4 max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 p-4 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase text-emerald-700">{product.id ? "Editar producto" : "Nuevo producto"}</p>
            <h2 className="text-xl font-black text-stone-950">{product.id ? product.name : "Cargar producto"}</h2>
          </div>
          <button onClick={closeWithCheck} className="grid h-10 w-10 place-items-center rounded-md border border-stone-200 text-stone-700">
            <X size={18} />
          </button>
        </div>

        <form action={action} className="grid">
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="imageUrls" value={images.join("\n")} />
          <input type="hidden" name="mainImageUrl" value={mainImage || images[0] || ""} />
          <div className="border-b border-stone-200 px-4 pt-3">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={cn("h-10 whitespace-nowrap border-b-2 px-3 text-sm font-bold text-stone-500", activeTab === tab ? "border-emerald-700 text-emerald-800" : "border-transparent")}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[430px] p-5">
            <div className={cn("grid gap-4", activeTab !== "Basico" && "hidden")}>
                <Field label="Nombre" required>
                  <input name="name" value={name} onChange={(event) => setName(event.target.value)} onBlur={() => !slug && setSlug(slugify(name))} className={inputClass} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Slug unico">
                    <input name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} className={inputClass} />
                  </Field>
                  <Field label="SKU opcional">
                    <input name="sku" defaultValue={product.sku ?? ""} placeholder="Ej: ZK-COC-001" className={inputClass} />
                  </Field>
                </div>
                <Field label="Descripcion corta">
                  <input name="shortDescription" defaultValue={product.shortDescription ?? ""} maxLength={160} className={inputClass} />
                </Field>
                <Field label="Descripcion completa">
                  <textarea name="description" defaultValue={product.description} rows={7} placeholder="Opcional. Si la dejas vacia usamos la descripcion corta o el nombre." className={textareaClass} />
                </Field>
            </div>

            <div className={cn("grid gap-4 md:grid-cols-2", activeTab !== "Precio y stock" && "hidden")}>
                <Field label="Precio" required>
                  <input name="price" type="number" min="1" step="0.01" defaultValue={product.price || ""} className={inputClass} />
                </Field>
                <Field label="Precio anterior">
                  <input name="previousPrice" type="number" min="0" step="0.01" defaultValue={product.previousPrice ?? ""} className={inputClass} />
                </Field>
                <Field label="Stock" required>
                  <input name="stock" type="number" min="0" defaultValue={product.stock} className={inputClass} />
                </Field>
                <Field label="Stock minimo">
                  <input name="minStock" type="number" min="0" defaultValue={product.minStock} className={inputClass} />
                </Field>
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 md:col-span-2">
                  <p className="text-sm font-bold text-stone-800">Estado stock automatico</p>
                  <p className="mt-1 text-sm text-stone-500">Disponible si el stock supera el minimo, bajo stock si esta entre 1 y el minimo, sin stock si es 0.</p>
                </div>
            </div>

            <div className={cn("grid gap-4 md:grid-cols-2", activeTab !== "Categoria" && "hidden")}>
                <Field label="Categoria" required>
                  <select name="categoryId" value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setSubcategoryId(""); }} className={inputClass}>
                    <option value="">Elegir categoria</option>
                    {parents.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </Field>
                <Field label="Subcategoria">
                  <select name="subcategoryId" value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)} className={inputClass}>
                    <option value="">Sin subcategoria</option>
                    {children.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </Field>
                <Field label="Etiquetas">
                  <input name="tags" defaultValue={product.tags.join(", ")} placeholder="bazar, cocina, regalo" className={inputClass} />
                </Field>
            </div>

            <div className={cn(activeTab !== "Imagenes" && "hidden")}>
              <ImageManager images={images} mainImage={mainImage} onImages={setImages} onMainImage={setMainImage} />
            </div>

            <div className={cn("grid gap-5", activeTab !== "Publicacion" && "hidden")}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Check name="published" label="Publicado" checked={product.published} />
                  <Check name="active" label="Activo" checked={product.active} />
                  <Check name="featured" label="Destacado" checked={product.featured} />
                  <Check name="onSale" label="Oferta" checked={product.onSale} />
                  <Check name="isNew" label="Producto nuevo" checked={product.isNew} />
                </div>
                <Field label="Orden visual">
                  <input name="sortOrder" type="number" defaultValue={product.sortOrder} className={inputClass} />
                </Field>
                <Field label="SEO title">
                  <input name="seoTitle" defaultValue={product.seoTitle ?? ""} maxLength={70} className={inputClass} />
                </Field>
                <Field label="SEO description">
                  <textarea name="seoDescription" defaultValue={product.seoDescription ?? ""} rows={3} maxLength={160} className={textareaClass} />
                </Field>
                {product.slug ? (
                  <Link target="_blank" href={`/producto/${product.slug}`} className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold">
                    <Eye size={16} />
                    Vista previa publica
                  </Link>
                ) : null}
            </div>
          </div>

          <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-stone-200 bg-white/95 p-4 backdrop-blur sm:flex-row sm:justify-end">
            {state?.message ? (
              <p className={cn("mr-auto rounded-md px-3 py-2 text-sm font-bold", state.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800")}>
                {state.message}
              </p>
            ) : null}
            <button type="button" onClick={closeWithCheck} className="h-11 rounded-md border border-stone-300 px-5 font-bold text-stone-800">Cancelar</button>
            <button disabled={pending} className="h-11 rounded-md bg-emerald-700 px-5 font-bold text-white disabled:bg-stone-300">
              {pending ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImageManager({
  images,
  mainImage,
  onImages,
  onMainImage,
}: {
  images: string[];
  mainImage: string;
  onImages: (images: string[]) => void;
  onMainImage: (url: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function uploadFiles(files: FileList | File[]) {
    const selectedFiles = Array.from(files);
    if (!selectedFiles.length) return;
    setMessage("");
    startTransition(async () => {
      const uploaded: string[] = [];
      for (const file of selectedFiles) {
        const data = new FormData();
        data.set("file", file);
        data.set("scope", "products");
        const response = await fetch("/api/admin/upload", { method: "POST", body: data });
        const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
        if (!response.ok || !payload?.url) {
          setMessage(payload?.error ?? "No se pudo subir una imagen. Revisa la configuracion de imagenes.");
          return;
        }
        uploaded.push(payload.url);
      }
      const nextImages = Array.from(new Set([...images, ...uploaded]));
      onImages(nextImages);
      if (!mainImage && nextImages[0]) onMainImage(nextImages[0]);
      setMessage("Imagenes subidas. Guarda el producto para persistir los cambios.");
    });
  }

  function move(url: string, direction: -1 | 1) {
    const index = images.indexOf(url);
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onImages(next);
  }

  return (
    <div className="grid gap-4">
      <div
        onDrop={(event) => {
          event.preventDefault();
          uploadFiles(event.dataTransfer.files);
        }}
        onDragOver={(event) => event.preventDefault()}
        className="grid min-h-40 place-items-center rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 p-6 text-center"
      >
        <ImagePlus className="text-emerald-700" size={30} />
        <p className="mt-2 font-black text-stone-950">Arrastra imagenes o subi varias juntas</p>
        <p className="mt-1 text-sm text-stone-500">JPG, PNG, WEBP, SVG o ICO. Si la carga no esta activa, vas a ver un mensaje claro.</p>
        <label className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-md bg-stone-950 px-4 text-sm font-bold text-white">
          {pending ? "Subiendo..." : "Seleccionar imagenes"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon" multiple className="sr-only" onChange={(event) => event.target.files && uploadFiles(event.target.files)} />
        </label>
      </div>
      {message ? <p className={cn("text-sm font-bold", message.startsWith("Imagenes") ? "text-emerald-700" : "text-rose-700")}>{message}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((url) => (
          <div key={url} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <div className="relative aspect-[4/3] bg-stone-100">
              <Image src={url} alt="Imagen producto" fill className="object-contain p-2" unoptimized={url.endsWith(".svg") || url.endsWith(".ico")} />
              {mainImage === url ? <Badge className="absolute left-2 top-2 bg-emerald-100 text-emerald-800">Principal</Badge> : null}
            </div>
            <div className="flex flex-wrap gap-2 p-2">
              <button type="button" onClick={() => onMainImage(url)} className="h-9 rounded-md border border-stone-200 px-3 text-xs font-bold">Principal</button>
              <button type="button" onClick={() => move(url, -1)} className="h-9 rounded-md border border-stone-200 px-3 text-xs font-bold">Subir</button>
              <button type="button" onClick={() => move(url, 1)} className="h-9 rounded-md border border-stone-200 px-3 text-xs font-bold">Bajar</button>
              <button type="button" onClick={() => onImages(images.filter((image) => image !== url))} className="h-9 rounded-md border border-rose-200 px-3 text-xs font-bold text-rose-700">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {!images.length ? <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">Recomendado: carga al menos una imagen para que la card se vea profesional.</p> : null}
    </div>
  );
}

function ProductActions({ product, onEdit }: { product: AdminProduct; onEdit: () => void }) {
  const archived = Boolean(product.archivedAt);
  return (
    <div className="flex flex-wrap justify-end gap-1">
      {archived ? (
        <form action={restoreProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button title="Restaurar y publicar" className="grid h-9 w-9 place-items-center rounded-md border border-emerald-200 text-emerald-800 hover:bg-emerald-50">
            <Eye size={16} />
          </button>
        </form>
      ) : (
        <form action={updateProductQuickAction}>
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="action" value="published" />
          <input type="hidden" name="value" value={(!product.published || !product.active).toString()} />
          <button title={product.published && product.active ? "Ocultar de la tienda" : "Publicar en tienda"} className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 hover:bg-stone-50">
            {product.published && product.active ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </form>
      )}
      <button title="Editar" onClick={onEdit} className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 hover:bg-stone-50"><Edit size={16} /></button>
      {!archived ? (
        <form action={duplicateProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button title="Duplicar" className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 hover:bg-stone-50"><Copy size={16} /></button>
        </form>
      ) : null}
      <Link title="Ver producto" target="_blank" href={`/producto/${product.slug}`} className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 hover:bg-stone-50"><Eye size={16} /></Link>
      {!archived ? (
        <>
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <button title="Ocultar de la tienda" className="grid h-9 w-9 place-items-center rounded-md border border-amber-200 text-amber-800 hover:bg-amber-50"><EyeOff size={16} /></button>
          </form>
          <form action={archiveProduct}>
            <input type="hidden" name="id" value={product.id} />
            <button title="Archivar" className="grid h-9 w-9 place-items-center rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50"><Trash2 size={16} /></button>
          </form>
        </>
      ) : (
        <form action={permanentlyDeleteProduct} onSubmit={(event) => !confirm("Vas a eliminar definitivamente este producto. Si tiene pedidos asociados se bloqueara para proteger el historial. Confirmas?") && event.preventDefault()}>
          <input type="hidden" name="id" value={product.id} />
          <button title="Eliminar definitivamente" className="grid h-9 w-9 place-items-center rounded-md border border-rose-200 text-rose-700 hover:bg-rose-50"><Trash2 size={16} /></button>
        </form>
      )}
    </div>
  );
}

function QuickToggle({ product, action, active, label }: { product: AdminProduct; action: "onSale" | "featured"; active: boolean; label: string }) {
  return (
    <form action={updateProductQuickAction}>
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="value" value={(!active).toString()} />
      <button className={cn("rounded-full px-3 py-1 text-xs font-black", active ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500")}>
        {active ? label : "No"}
      </button>
    </form>
  );
}

function BulkBar({ selected, categories, onClear }: { selected: string[]; categories: AdminCategory[]; onClear: () => void }) {
  if (!selected.length) return null;
  return (
    <form action={bulkUpdateProducts} onSubmit={(event) => {
      const data = new FormData(event.currentTarget);
      if (data.get("bulkAction") === "archive" && !confirm("Vas a archivar varios productos. No apareceran en la tienda ni en la vista normal. Confirmas la accion masiva?")) event.preventDefault();
    }} className="mt-4 flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 lg:flex-row lg:items-center">
      {selected.map((id) => <input key={id} type="hidden" name="ids" value={id} />)}
      <p className="text-sm font-black text-emerald-900">{selected.length} seleccionados</p>
      <select name="bulkAction" required className="h-10 rounded-md border border-emerald-200 bg-white px-3 text-sm">
        <option value="">Accion masiva</option>
        <option value="publish">Publicar</option>
        <option value="hide">Ocultar de tienda</option>
        <option value="sale-on">Marcar oferta</option>
        <option value="sale-off">Quitar oferta</option>
        <option value="category">Cambiar categoria</option>
        <option value="archive">Archivar</option>
      </select>
      <select name="bulkCategoryId" className="h-10 rounded-md border border-emerald-200 bg-white px-3 text-sm">
        <option value="">Categoria si aplica</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <button className="h-10 rounded-md bg-emerald-700 px-4 text-sm font-bold text-white">Aplicar</button>
      <button type="button" onClick={onClear} className="h-10 rounded-md border border-emerald-300 px-4 text-sm font-bold text-emerald-900">Limpiar</button>
    </form>
  );
}

function AdminNotice({ type, message }: { type: "ok" | "error"; message: string }) {
  return (
    <div className={cn("rounded-lg border p-4 text-sm font-bold", type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-800")}>
      {message}
    </div>
  );
}

function ProductThumb({ product }: { product: AdminProduct }) {
  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100">
      <ProductImage product={product} />
    </div>
  );
}

function ProductImage({ product }: { product: AdminProduct }) {
  const url = product.images[0]?.url || "/product-fallback.svg";
  return <Image src={url} alt={product.name} fill className="object-contain p-1" unoptimized={url.endsWith(".svg") || url.endsWith(".ico")} />;
}

function StatusBadge({ product }: { product: AdminProduct }) {
  if (product.archivedAt) return <Badge className="bg-stone-300 text-stone-800">Archivado</Badge>;
  const active = product.published && product.active;
  return <Badge className={active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700"}>{active ? "Publicado" : "Oculto"}</Badge>;
}

function StockBadge({ product }: { product: AdminProduct }) {
  if (product.stock <= 0) return <Badge className="bg-rose-100 text-rose-800">Sin stock</Badge>;
  if (product.stock <= product.minStock) return <Badge className="bg-amber-100 text-amber-900">Bajo: {product.stock}</Badge>;
  return <Badge className="bg-emerald-100 text-emerald-800">Stock: {product.stock}</Badge>;
}

function Metric({ label, value, icon, danger }: { label: string; value: number; icon: React.ReactNode; danger?: boolean }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className={cn("grid h-9 w-9 place-items-center rounded-md", danger ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800")}>{icon}</div>
      <p className="mt-3 text-2xl font-black text-stone-950">{value}</p>
      <p className="text-sm font-semibold text-stone-500">{label}</p>
    </div>
  );
}

function AlertCard({ icon, title, text, danger }: { icon: React.ReactNode; title: string; text: string; danger?: boolean }) {
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4 shadow-sm", danger ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50")}>
      <div className={cn("mt-0.5", danger ? "text-rose-700" : "text-amber-700")}>{icon}</div>
      <div>
        <p className={cn("font-black", danger ? "text-rose-950" : "text-amber-950")}>{title}</p>
        <p className={cn("mt-1 text-sm leading-6", danger ? "text-rose-800" : "text-amber-800")}>{text}</p>
      </div>
    </div>
  );
}

function Pagination({
  current,
  total,
  totalItems,
  pageSize,
  onPage,
}: {
  current: number;
  total: number;
  totalItems: number;
  pageSize: number;
  onPage: (page: number) => void;
}) {
  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, totalItems);
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="font-semibold text-stone-600">Mostrando {from}-{to} de {totalItems} productos</p>
      <div className="flex items-center gap-2">
        <button disabled={current <= 1} onClick={() => onPage(current - 1)} className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 px-3 font-bold disabled:opacity-40">
          <ChevronLeft size={16} />
          Anterior
        </button>
        <span className="rounded-md bg-stone-100 px-3 py-2 font-black text-stone-800">{current} / {total}</span>
        <button disabled={current >= total} onClick={() => onPage(current + 1)} className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 px-3 font-bold disabled:opacity-40">
          Siguiente
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function EmptyProducts({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <Filter className="text-stone-400" size={32} />
      <h2 className="mt-3 text-xl font-black text-stone-950">No hay productos para estos filtros</h2>
      <p className="mt-1 text-sm text-stone-500">Ajusta la busqueda o carga un producto nuevo.</p>
      <button onClick={onCreate} className="mt-4 h-11 rounded-md bg-emerald-700 px-5 font-bold text-white">Nuevo producto</button>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-stone-800">
      {label}{required ? <span className="sr-only"> requerido</span> : null}
      {children}
    </label>
  );
}

function Check({ name, label, checked }: { name: string; label: string; checked: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-stone-200 p-3 text-sm font-bold text-stone-800">
      {label}
      <input type="checkbox" name={name} defaultChecked={checked} className="h-5 w-5" />
    </label>
  );
}

function Select({ value, onChange, children, icon }: { value: string; onChange: (value: string) => void; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <label className="relative block">
      {icon ? <span className="pointer-events-none absolute left-3 top-3 text-stone-400">{icon}</span> : null}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={cn("h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm outline-none focus:border-emerald-600", icon && "pl-9")}>
        {children}
      </select>
    </label>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-black", className)}>{children}</span>;
}

function emptyProduct(categoryId: string): AdminProduct {
  const now = new Date().toISOString();
  return {
    id: "",
    name: "",
    slug: "",
    sku: null,
    shortDescription: null,
    description: "",
    price: 0,
    previousPrice: null,
    stock: 0,
    minStock: 3,
    tags: [],
    featured: false,
    onSale: false,
    isNew: true,
    published: true,
    active: true,
    archivedAt: null,
    sortOrder: 0,
    seoTitle: null,
    seoDescription: null,
    categoryId,
    subcategoryId: null,
    categoryName: "",
    createdAt: now,
    updatedAt: now,
    images: [],
  };
}

const inputClass = "h-11 rounded-md border border-stone-200 px-3 text-sm outline-none focus:border-emerald-600";
const textareaClass = "rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-600";
