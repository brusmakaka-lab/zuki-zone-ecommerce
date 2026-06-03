import Link from "next/link";
import { CheckCircle2, Clock, Download, PackageCheck, Search, Truck } from "lucide-react";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/gestion-2002/actions";
import { AdminConfirmSubmitButton } from "@/components/admin-confirm-submit-button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getPrisma, hasDatabase } from "@/lib/prisma";
import { orderStatusLabels } from "@/lib/order-status";
import { cn, formatMoney, whatsappUrl } from "@/lib/utils";

type SearchParams = Promise<{ estado?: string; q?: string }>;

const closedStatuses = new Set<OrderStatus>([OrderStatus.ENTREGADO]);
const newStatuses = new Set<OrderStatus>([OrderStatus.CONSULTA_RECIBIDA, OrderStatus.PENDIENTE_DE_PAGO]);

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  if (!hasDatabase()) return <AdminNotice title="Pedidos" />;
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const status = Object.values(OrderStatus).includes(params.estado as OrderStatus) ? (params.estado as OrderStatus) : undefined;

  const orders = await getPrisma().order.findMany({
    where: {
      status,
      OR: q
        ? [
            { customerName: { contains: q, mode: "insensitive" } },
            { customerPhone: { contains: q, mode: "insensitive" } },
            { customerEmail: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: { items: true, statusHistory: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  const allOrders = await getPrisma().order.findMany({ select: { status: true, total: true } });
  const metrics = {
    total: allOrders.length,
    new: allOrders.filter((order) => newStatuses.has(order.status)).length,
    closed: allOrders.filter((order) => closedStatuses.has(order.status)).length,
    cancelled: allOrders.filter((order) => order.status === OrderStatus.CANCELADO).length,
    amount: allOrders.reduce((sum, order) => sum + Number(order.total), 0),
  };

  return (
    <div className="grid gap-6">
      <header className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-emerald-700">Operacion</p>
            <h1 className="mt-1 text-3xl font-black text-stone-950">Pedidos</h1>
            <p className="mt-1 text-sm text-stone-500">Seguimiento, contacto con clientes, notas internas y cambios de estado.</p>
          </div>
          <Link href="/api/admin/orders/export" className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold">
            <Download size={17} />
            Exportar CSV
          </Link>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-5">
        <Metric label="Pedidos totales" value={String(metrics.total)} />
        <Metric label="Pedidos nuevos" value={String(metrics.new)} />
        <Metric label="Cerrados" value={String(metrics.closed)} />
        <Metric label="Cancelados" value={String(metrics.cancelled)} />
        <Metric label="Total estimado" value={formatMoney(metrics.amount)} />
      </section>

      <form className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_240px_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 text-stone-400" size={18} />
          <input name="q" defaultValue={q} placeholder="Buscar cliente, telefono o email" className="h-11 w-full rounded-md border border-stone-200 pl-10 pr-3 text-sm outline-none focus:border-emerald-600" />
        </label>
        <select name="estado" defaultValue={status ?? ""} className="h-11 rounded-md border border-stone-200 px-3 text-sm">
          <option value="">Todos los estados</option>
          {Object.values(OrderStatus).map((item) => (
            <option key={item} value={item}>{orderStatusLabels[item]}</option>
          ))}
        </select>
        <button className="h-11 rounded-md bg-stone-950 px-5 text-sm font-bold text-white">Filtrar</button>
      </form>

      {orders.length ? (
        <div className="grid gap-4">
          {orders.map((order) => {
            const message = [
              `Hola ${order.customerName}, te escribo por tu pedido #${order.orderNumber}.`,
              `Estado actual: ${orderStatusLabels[order.status]}.`,
              "Cualquier duda respondeme por aca.",
            ].join("\n");

            return (
              <section key={order.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xl font-black">Pedido #{order.orderNumber}</p>
                      <StatusBadge status={order.status} />
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
                        {order.createdAt.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-1 text-sm text-stone-600">
                      <p><strong className="text-stone-950">{order.customerName}</strong> · {order.customerPhone}</p>
                      {order.customerEmail ? <p>{order.customerEmail}</p> : null}
                      <p>{order.address}, {order.city}</p>
                      {order.reference ? <p>Referencia: {order.reference}</p> : null}
                      {order.observations ? <p>Observaciones: {order.observations}</p> : null}
                      {order.customerNote ? <p className="rounded-md bg-emerald-50 p-2 font-semibold text-emerald-900">Nota para cliente: {order.customerNote}</p> : null}
                      {order.cancelReason ? <p className="rounded-md bg-rose-50 p-2 font-semibold text-rose-800">Motivo de cancelacion: {order.cancelReason}</p> : null}
                      {order.adminNote ? <p className="rounded-md bg-stone-50 p-2 font-semibold text-stone-700">Nota interna: {order.adminNote}</p> : null}
                    </div>
                    <div className="mt-4 overflow-hidden rounded-md border border-stone-100">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between gap-4 border-b border-stone-100 px-3 py-2 text-sm last:border-b-0">
                          <span>{item.productName} x{item.quantity}</span>
                          <strong>{formatMoney(Number(item.unitPrice) * item.quantity)}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <p className="text-lg font-black">{formatMoney(Number(order.total))}</p>
                      <a className="inline-flex h-10 items-center gap-2 rounded-md border border-emerald-700 px-4 text-sm font-bold text-emerald-800" href={whatsappUrl(order.customerPhone, message)}>
                        <WhatsAppIcon size={19} className="h-[19px] w-[19px]" />
                        WhatsApp
                      </a>
                      <Link href={`/pedido/${order.id}`} target="_blank" className="inline-flex h-10 items-center rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-800">
                        Ver seguimiento
                      </Link>
                    </div>
                    <QuickActions orderId={order.id} currentStatus={order.status} customerName={order.customerName} />
                    <div className="mt-4 rounded-md bg-stone-50 p-3">
                      <p className="text-sm font-black text-stone-950">Historial</p>
                      <div className="mt-2 grid gap-2">
                        {order.statusHistory.map((history) => (
                          <div key={history.id} className="text-xs text-stone-600">
                            <strong>{orderStatusLabels[history.status]}</strong> · {history.createdAt.toLocaleString("es-AR")}
                            {history.note ? <p className="mt-1">{history.note}</p> : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <form action={updateOrderStatus} className="grid h-fit gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4">
                    <input type="hidden" name="orderId" value={order.id} />
                    <label className="grid gap-2 text-sm font-bold">
                      Estado
                      <select name="status" defaultValue={order.status} className="h-11 rounded-md border border-stone-200 bg-white px-3 font-normal">
                        {Object.values(OrderStatus).map((item) => (
                          <option key={item} value={item}>{orderStatusLabels[item]}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                      Nota visible para el cliente
                      <textarea name="customerNote" defaultValue={order.customerNote ?? ""} placeholder="Ej: Tu pedido esta listo para coordinar retiro." rows={3} className="rounded-md border border-stone-200 bg-white px-3 py-2 font-normal" />
                      <span className="text-xs font-normal text-stone-500">Se muestra en el seguimiento del pedido.</span>
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                      Motivo de cancelacion
                      <textarea name="cancelReason" defaultValue={order.cancelReason ?? ""} placeholder="Ej: Producto sin stock o pedido anulado por el cliente." rows={3} className="rounded-md border border-stone-200 bg-white px-3 py-2 font-normal" />
                      <span className="text-xs font-normal text-stone-500">Solo se usa cuando el estado queda Cancelado.</span>
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                      Nota para historial
                      <textarea name="note" placeholder="Ej: Cliente respondido por WhatsApp" rows={2} className="rounded-md border border-stone-200 bg-white px-3 py-2 font-normal" />
                      <span className="text-xs font-normal text-stone-500">Queda guardada en el historial del pedido.</span>
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                      Nota interna
                      <textarea name="adminNote" defaultValue={order.adminNote ?? ""} placeholder="Dato interno para el equipo" rows={4} className="rounded-md border border-stone-200 bg-white px-3 py-2 font-normal" />
                    </label>
                    <button className="h-11 rounded-md bg-emerald-700 px-5 font-bold text-white">Guardar pedido</button>
                  </form>
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-black text-stone-950">No hay pedidos para estos filtros</h2>
          <p className="mt-2 text-sm text-stone-600">Cuando un cliente confirme una compra, vas a ver aca sus datos, productos y seguimiento.</p>
          <Link href="/gestion-2002/productos" className="mt-5 inline-flex rounded-md bg-emerald-700 px-5 py-3 font-bold text-white">Revisar productos</Link>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-stone-950">{value}</p>
    </div>
  );
}

function QuickActions({ orderId, currentStatus, customerName }: { orderId: string; currentStatus: OrderStatus; customerName: string }) {
  const actions: { label: string; status: OrderStatus; note: string; icon: React.ReactNode; className: string; disabled?: boolean }[] = [
    {
      label: "Confirmar",
      status: OrderStatus.PAGO_CONFIRMADO,
      note: "Pedido confirmado por el comercio.",
      icon: <CheckCircle2 size={16} />,
      className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    {
      label: "Preparar",
      status: OrderStatus.PREPARANDO_PEDIDO,
      note: "El pedido paso a preparacion.",
      icon: <PackageCheck size={16} />,
      className: "border-amber-200 bg-amber-50 text-amber-900",
    },
    {
      label: "Enviado",
      status: OrderStatus.ENVIADO,
      note: "El pedido fue marcado como enviado o en camino.",
      icon: <Truck size={16} />,
      className: "border-blue-200 bg-blue-50 text-blue-800",
    },
    {
      label: "Cerrar",
      status: OrderStatus.ENTREGADO,
      note: "Pedido cerrado como entregado.",
      icon: <CheckCircle2 size={16} />,
      className: "border-stone-300 bg-white text-stone-800",
    },
  ];

  return (
    <div className="mt-4 rounded-lg border border-stone-100 bg-stone-50 p-3">
      <p className="flex items-center gap-2 text-sm font-black text-stone-950">
        <Clock size={16} />
        Acciones rapidas
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((action) => (
          <form key={action.status} action={updateOrderStatus}>
            <input type="hidden" name="orderId" value={orderId} />
            <input type="hidden" name="status" value={action.status} />
            <input type="hidden" name="note" value={action.note} />
            <button disabled={currentStatus === action.status} className={cn("inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-45", action.className)}>
              {action.icon}
              {action.label}
            </button>
          </form>
        ))}
        <form action={updateOrderStatus}>
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="status" value={OrderStatus.CANCELADO} />
          <input type="hidden" name="note" value={`Pedido cancelado desde el panel. Cliente: ${customerName}.`} />
          <input type="hidden" name="cancelReason" value="Pedido cancelado desde el panel." />
          <AdminConfirmSubmitButton disabled={currentStatus === OrderStatus.CANCELADO} message="Vas a cancelar el pedido y restaurar el stock de sus productos. Confirmas?">
            Cancelar
          </AdminConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const tone =
    status === OrderStatus.CANCELADO
      ? "bg-rose-100 text-rose-800"
      : status === OrderStatus.ENTREGADO
        ? "bg-stone-200 text-stone-800"
        : status === OrderStatus.ENVIADO
          ? "bg-blue-100 text-blue-800"
          : status === OrderStatus.PREPARANDO_PEDIDO
            ? "bg-amber-100 text-amber-900"
            : "bg-emerald-100 text-emerald-800";
  return <span className={cn("rounded-full px-3 py-1 text-xs font-black", tone)}>{orderStatusLabels[status]}</span>;
}

function AdminNotice({ title }: { title: string }) {
  return <div className="rounded-lg border border-amber-200 bg-amber-50 p-6"><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 text-sm">El panel necesita la base de datos conectada para administrar esta seccion.</p></div>;
}
