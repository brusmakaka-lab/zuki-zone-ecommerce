import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { RepeatOrderButton } from "@/components/cart/repeat-order-button";
import { StatusTracker } from "@/components/status-tracker";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getOrderById, getOrderForUser, getSettings } from "@/lib/data";
import { orderStatusLabels } from "@/lib/order-status";
import { formatMoney, whatsappUrl } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export default async function OrderPage({ params }: { params: Params }) {
  const session = await auth();
  const { id } = await params;
  const [order, settings] = await Promise.all([
    session?.user?.id ? getOrderForUser(id, session.user.id) : getOrderById(id),
    getSettings(),
  ]);
  if (!order) notFound();
  const cancelled = order.status === "CANCELADO";
  const delivered = order.status === "ENTREGADO";
  const latestStatusNote = [...order.statusHistory].reverse().find((history) => history.note)?.note;
  const visibleNote = cancelled ? order.cancelReason || order.customerNote || latestStatusNote : order.customerNote || latestStatusNote;
  const whatsappMessage = cancelled
    ? `Hola Zuki Zone, quiero consultar por mi pedido cancelado #${order.orderNumber}.`
    : `Hola Zuki Zone, quiero consultar por mi pedido #${order.orderNumber}. Estado: ${orderStatusLabels[order.status]}.`;
  const repeatItems = order.items.map((item) => ({
    productId: item.product.id,
    name: item.productName,
    slug: item.product.slug,
    image: item.product.images[0]?.url || "/product-fallback.svg",
    price: item.product.price,
    stock: item.product.stock,
    quantity: item.quantity,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">Seguimiento</p>
        <h1 className="mt-2 text-4xl font-black text-stone-950">Pedido #{order.orderNumber}</h1>
        <p className="mt-2 font-semibold text-stone-700">Estado actual: {orderStatusLabels[order.status]}</p>
        <div className={`mt-5 rounded-lg border p-4 text-sm font-semibold ${cancelled ? "border-rose-200 bg-rose-50 text-rose-800" : delivered ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
          {cancelled ? "Este pedido fue cancelado. Si queres retomarlo, podes volver a comprar los productos o escribirnos por WhatsApp." : delivered ? "Compra finalizada. Gracias por elegir Zuki Zone." : "Estamos revisando tu pedido. Te vamos a contactar para coordinar pago, retiro o envio."}
          {visibleNote ? <p className="mt-2 font-normal">{visibleNote}</p> : null}
          {order.customerNote && order.customerNote !== visibleNote ? <p className="mt-2 font-normal">{order.customerNote}</p> : null}
        </div>
        <div className="mt-8">
          <StatusTracker status={order.status} />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappUrl(settings.whatsappNumber, whatsappMessage)} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-emerald-700 px-4 text-sm font-bold text-emerald-800">
            <WhatsAppIcon size={19} className="h-[19px] w-[19px]" />
            Contactar por WhatsApp
          </a>
          <RepeatOrderButton items={repeatItems} />
          <Link href="/catalogo" className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-900">
            Seguir comprando
          </Link>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-black">Productos</h2>
          <div className="mt-4 grid gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 border-b border-stone-100 pb-3 text-sm">
                <Link href={`/producto/${item.product.slug}`} className="font-semibold text-stone-800 hover:text-emerald-800">
                  {item.productName} x{item.quantity}
                </Link>
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
      {order.statusHistory.length ? (
        <section className="mt-6 rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-black">Historial del pedido</h2>
          <div className="mt-4 grid gap-3">
            {order.statusHistory.map((history) => (
              <div key={history.id} className="rounded-md bg-stone-50 p-3 text-sm text-stone-600">
                <strong className="text-stone-950">{orderStatusLabels[history.status]}</strong> · {history.createdAt.toLocaleString("es-AR")}
                {history.note ? <p className="mt-1">{history.note}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
