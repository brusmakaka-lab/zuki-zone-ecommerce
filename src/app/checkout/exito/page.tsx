import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckoutSuccessClear } from "@/components/cart/checkout-success-clear";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getOrderById } from "@/lib/data";
import { formatMoney } from "@/lib/utils";

type SearchParams = Promise<{
  pedido?: string;
  numero?: string;
  whatsapp?: string;
}>;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const order = params.pedido ? await getOrderById(params.pedido) : null;

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-12">
      <CheckoutSuccessClear />
      <section className="w-full rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <h1 className="mt-5 text-3xl font-black text-stone-950">Pedido generado</h1>
        <p className="mt-3 text-stone-600">
          Guardamos tu pedido{params.numero ? ` #${params.numero}` : ""}. Ahora podes enviar la consulta por WhatsApp para coordinar pago y entrega.
        </p>
        {order ? (
          <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-4 text-left">
            <p className="text-sm font-black uppercase text-emerald-700">Resumen del pedido</p>
            <div className="mt-3 grid gap-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <span>{item.productName} x{item.quantity}</span>
                  <strong>{formatMoney(item.unitPrice * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-lg font-black">
              <span>Total</span>
              <span>{formatMoney(order.total)}</span>
            </div>
          </div>
        ) : null}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {params.whatsapp ? (
            <a
              href={params.whatsapp}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-600 font-black text-white"
            >
              <WhatsAppIcon size={22} className="h-5 w-5" />
              Enviar WhatsApp
            </a>
          ) : null}
          {params.pedido ? (
            <Link href={`/pedido/${params.pedido}`} className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 font-bold">
              Ver seguimiento
            </Link>
          ) : null}
        </div>
        <Link href="/catalogo" className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-md border border-stone-300 font-bold sm:w-auto sm:px-6">
          Seguir comprando
        </Link>
      </section>
    </div>
  );
}
