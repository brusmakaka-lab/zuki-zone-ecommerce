import { OrderStatus } from "@prisma/client";
import { getPrisma, hasDatabase } from "@/lib/prisma";
import { orderStatusLabels } from "@/lib/order-status";
import { formatMoney } from "@/lib/utils";
import { requireAdminSession } from "@/lib/admin-auth";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const admin = await requireAdminSession();
  if (!hasDatabase()) {
    return <AdminEmpty title="Dashboard" />;
  }

  const prisma = getPrisma();
  const [orders, products, lowStock] = await Promise.all([
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.product.count(),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, take: 8, orderBy: { stock: "asc" } }),
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
    <div>
      <h1 className="text-3xl font-black text-stone-950">Dashboard</h1>
      {admin.mustChangePassword ? (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
          Por seguridad cambia la contraseña inicial.
          <Link href="/gestion-2002/configuracion/seguridad" className="ml-2 text-violet-800 underline">
            Ir a seguridad
          </Link>
        </div>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Metric label="Ventas/consultas" value={String(orders.length)} />
        <Metric label="Total cotizado" value={formatMoney(total)} />
        <Metric label="Productos" value={String(products)} />
        <Metric label="Stock bajo" value={String(lowStock.length)} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
            {topProducts.length ? topProducts.map(([name, quantity]) => (
              <div key={name} className="flex justify-between border-b border-stone-100 py-2 text-sm">
                <span>{name}</span>
                <strong>{quantity}</strong>
              </div>
            )) : <p className="text-sm text-stone-500">Sin pedidos todavia.</p>}
          </div>
        </Panel>
        <Panel title="Stock bajo">
          <div className="grid gap-2">
            {lowStock.map((product) => (
              <div key={product.id} className="flex justify-between border-b border-stone-100 py-2 text-sm">
                <span>{product.name}</span>
                <strong>{product.stock}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <p className="text-sm font-semibold text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-stone-950">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
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
