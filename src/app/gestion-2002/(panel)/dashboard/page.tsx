import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ImageOff, PackagePlus, Palette, Plus, Tags } from "lucide-react";
import { OrderStatus } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";
import { orderStatusLabels } from "@/lib/order-status";
import { getPrisma, hasDatabase } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const admin = await requireAdminSession();
  if (!hasDatabase()) {
    return <AdminEmpty title="Dashboard" />;
  }

  const prisma = getPrisma();
  const [orders, products, lowStock, latestProducts, productsWithoutImage, noStock] = await Promise.all([
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.product.count(),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, take: 8, orderBy: { stock: "asc" } }),
    prisma.product.findMany({
      include: { images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }], take: 1 } },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({ where: { images: { none: {} } }, take: 6, orderBy: { updatedAt: "desc" } }),
    prisma.product.findMany({ where: { stock: { lte: 0 } }, take: 6, orderBy: { updatedAt: "desc" } }),
  ]);

  const total = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const statusCounts = Object.values(OrderStatus).map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));
  const consulted = new Map<string, number>();
  orders.flatMap((order) => order.items).forEach((item) => {
    consulted.set(item.productName, (consulted.get(item.productName) ?? 0) + item.quantity);
  });
  const topProducts = [...consulted.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="grid gap-6">
      <header className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-emerald-700">Resumen</p>
        <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-stone-950">Dashboard</h1>
            <p className="mt-1 text-sm text-stone-500">Control rapido de ventas, catalogo y contenido de la tienda.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/gestion-2002/productos" className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-bold text-white">
              <PackagePlus size={17} />
              Nuevo producto
            </Link>
            <Link href="/gestion-2002/categorias" className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold">
              <Tags size={17} />
              Nueva categoria
            </Link>
            <Link href="/gestion-2002/contenido" className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold">
              <Palette size={17} />
              Cambiar portada
            </Link>
            <Link href="/" target="_blank" className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold">
              <ExternalLink size={17} />
              Ver tienda
            </Link>
          </div>
        </div>
      </header>

      {admin.mustChangePassword ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
          Por seguridad cambia la contrasena inicial.
          <Link href="/gestion-2002/configuracion/seguridad" className="ml-2 text-violet-800 underline">
            Ir a seguridad
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Ventas/consultas" value={String(orders.length)} />
        <Metric label="Total cotizado" value={formatMoney(total)} />
        <Metric label="Productos" value={String(products)} />
        <Metric label="Stock bajo" value={String(lowStock.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Pedidos por estado">
          <div className="grid gap-2">
            {statusCounts.map((item) => (
              <div key={item.status} className="flex justify-between border-b border-stone-100 py-2 text-sm">
                <span>{orderStatusLabels[item.status]}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Productos mas consultados">
          <div className="grid gap-2">
            {topProducts.length ? (
              topProducts.map(([name, quantity]) => (
                <div key={name} className="flex justify-between border-b border-stone-100 py-2 text-sm">
                  <span>{name}</span>
                  <strong>{quantity}</strong>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-500">Sin pedidos todavia.</p>
            )}
          </div>
        </Panel>

        <Panel title="Stock bajo">
          <div className="grid gap-2">
            {lowStock.length ? (
              lowStock.map((product) => (
                <div key={product.id} className="flex justify-between border-b border-stone-100 py-2 text-sm">
                  <span>{product.name}</span>
                  <strong>{product.stock}</strong>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-500">Sin alertas de stock bajo.</p>
            )}
          </div>
        </Panel>

        <Panel title="Ultimos productos cargados">
          <div className="grid gap-3">
            {latestProducts.map((product) => (
              <Link key={product.id} href={`/gestion-2002/productos?edit=${product.id}`} className="flex items-center gap-3 rounded-md border border-stone-100 p-2 hover:bg-stone-50">
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-stone-100">
                  {product.images[0]?.url ? (
                    <Image src={product.images[0].url} alt={product.name} fill className="object-contain p-1" unoptimized={product.images[0].url.endsWith(".svg") || product.images[0].url.endsWith(".ico")} />
                  ) : (
                    <ImageOff className="absolute left-3 top-3 text-stone-400" size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-stone-950">{product.name}</p>
                  <p className="text-xs text-stone-500">Editar producto</p>
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Pendientes del catalogo">
          <div className="grid gap-3">
            <ActionList title="Productos sin imagen" items={productsWithoutImage.map((product) => product.name)} href="/gestion-2002/productos" />
            <ActionList title="Productos sin stock" items={noStock.map((product) => product.name)} href="/gestion-2002/productos" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-stone-950">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ActionList({ title, items, href }: { title: string; items: string[]; href: string }) {
  return (
    <div className="rounded-md border border-stone-100 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-stone-950">{title}</p>
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
          <Plus size={14} />
          Resolver
        </Link>
      </div>
      {items.length ? (
        <ul className="mt-2 grid gap-1 text-sm text-stone-600">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-stone-500">Sin pendientes.</p>
      )}
    </div>
  );
}

function AdminEmpty({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
      <h1 className="text-2xl font-black">{title}</h1>
      <p className="mt-2 text-sm">Configura DATABASE_URL y ejecuta las migraciones para usar el panel.</p>
    </div>
  );
}
