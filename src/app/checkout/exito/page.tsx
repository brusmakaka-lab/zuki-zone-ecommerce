import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";

type SearchParams = Promise<{
  pedido?: string;
  numero?: string;
  whatsapp?: string;
}>;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-12">
      <section className="w-full rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <h1 className="mt-5 text-3xl font-black text-stone-950">Pedido generado</h1>
        <p className="mt-3 text-stone-600">
          Guardamos tu pedido{params.numero ? ` #${params.numero}` : ""}. Ahora podes enviar la consulta por WhatsApp para coordinar pago y entrega.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {params.whatsapp ? (
            <a
              href={params.whatsapp}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-600 font-black text-white"
            >
              <MessageCircle className="h-5 w-5" />
              Enviar WhatsApp
            </a>
          ) : null}
          {params.pedido ? (
            <Link href={`/pedido/${params.pedido}`} className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 font-bold">
              Ver seguimiento
            </Link>
          ) : (
            <Link href="/catalogo" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 font-bold">
              Seguir comprando
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
