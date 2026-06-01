import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { StatusTracker } from "@/components/status-tracker";
import { getOrderById, getOrderForUser } from "@/lib/data";
import { orderStatusLabels } from "@/lib/order-status";
import { formatMoney } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export default async function OrderPage({ params }: { params: Params }) {
  const session = await auth();
  const { id } = await params;
  const order = session?.user?.id ? await getOrderForUser(id, session.user.id) : await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">Seguimiento</p>
        <h1 className="mt-2 text-4xl font-black text-stone-950">Pedido #{order.orderNumber}</h1>
        <p className="mt-2 font-semibold text-stone-700">Estado actual: {orderStatusLabels[order.status]}</p>
        <div className="mt-8">
          <StatusTracker status={order.status} />
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-black">Productos</h2>
          <div className="mt-4 grid gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 border-b border-stone-100 pb-3 text-sm">
                <span>{item.productName} x{item.quantity}</span>
                <span className="font-bold">{formatMoney(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-black">Entrega</h2>
          <div className="mt-4 grid gap-2 text-sm text-stone-600">
            <p><strong>Cliente:</strong> {order.customerName}</p>
            <p><strong>Telefono:</strong> {order.customerPhone}</p>
            <p><strong>Direccion:</strong> {order.address}, {order.city}</p>
          </div>
          <div className="mt-5 flex justify-between border-t border-stone-200 pt-5 text-lg font-black">
            <span>Total</span>
            <span>{formatMoney(order.total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
