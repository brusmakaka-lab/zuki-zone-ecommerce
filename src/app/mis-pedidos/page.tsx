import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserOrders } from "@/lib/data";
import { orderStatusLabels } from "@/lib/order-status";
import { formatMoney } from "@/lib/utils";

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/mis-pedidos");
  const orders = await getUserOrders(session.user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-stone-950">Mis pedidos</h1>
      <div className="mt-8 grid gap-4">
        {orders.length ? (
          orders.map((order) => (
            <Link key={order.id} href={`/pedido/${order.id}`} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-black">Pedido #{order.orderNumber}</p>
                  <p className="text-sm text-stone-500">{order.createdAt.toLocaleDateString("es-AR")}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-emerald-800">{orderStatusLabels[order.status]}</p>
                  <p className="text-lg font-black">{formatMoney(order.total)}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-stone-200 bg-white p-10 text-center">
            <p className="font-bold">Todavia no tenes pedidos.</p>
            <Link href="/catalogo" className="mt-5 inline-flex rounded-md bg-emerald-700 px-5 py-3 font-bold text-white">
              Ver productos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
