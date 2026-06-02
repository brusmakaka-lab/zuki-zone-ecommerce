import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/gestion-2002/actions";
import { getPrisma, hasDatabase } from "@/lib/prisma";
import { orderStatusLabels } from "@/lib/order-status";
import { formatMoney, whatsappUrl } from "@/lib/utils";

export default async function AdminOrdersPage() {
  if (!hasDatabase()) return <AdminNotice title="Pedidos" />;
  const orders = await getPrisma().order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-3xl font-black text-stone-950">Pedidos</h1>
      {orders.length ? (
        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
          <section key={order.id} className="rounded-lg border border-stone-200 bg-white p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <div>
                <p className="text-lg font-black">Pedido #{order.orderNumber}</p>
                <p className="mt-1 text-sm text-stone-500">{order.customerName} · {order.customerPhone}</p>
                <p className="mt-1 text-sm text-stone-500">{order.address}, {order.city}</p>
                <div className="mt-4 grid gap-2 text-sm">
                  {order.items.map((item) => (
                    <p key={item.id}>{item.productName} x{item.quantity}</p>
                  ))}
                </div>
                <a className="mt-4 inline-flex rounded-md border border-emerald-700 px-4 py-2 text-sm font-bold text-emerald-800" href={whatsappUrl(order.customerPhone, `Hola ${order.customerName}, te escribo por tu pedido #${order.orderNumber}.`)}>
                  Abrir WhatsApp del cliente
                </a>
              </div>
              <form action={updateOrderStatus} className="grid gap-3">
                <input type="hidden" name="orderId" value={order.id} />
                <p className="font-black">{formatMoney(Number(order.total))}</p>
                <select name="status" defaultValue={order.status} className="h-11 rounded-md border border-stone-200 px-3">
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>{orderStatusLabels[status]}</option>
                  ))}
                </select>
                <textarea name="note" placeholder="Nota interna opcional" rows={3} className="rounded-md border border-stone-200 px-3 py-2" />
                <button className="h-11 rounded-md bg-emerald-700 px-5 font-bold text-white">Actualizar estado</button>
              </form>
            </div>
          </section>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-black text-stone-950">Todavia no hay pedidos</h2>
          <p className="mt-2 text-sm text-stone-600">Cuando un cliente confirme una compra o consulta, vas a verla aca con sus datos y estado.</p>
        </div>
      )}
    </div>
  );
}

function AdminNotice({ title }: { title: string }) {
  return <div className="rounded-lg border border-amber-200 bg-amber-50 p-6"><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 text-sm">El panel necesita la base de datos conectada para administrar esta seccion.</p></div>;
}
