import Link from "next/link";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getSettings } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

export default async function ReturnsPage() {
  const settings = await getSettings();

  return (
    <main className="bg-stone-50">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Cambios y devoluciones</p>
        <h1 className="mt-2 text-4xl font-black text-stone-950 md:text-5xl">Si algo no coincide, lo revisamos con tu numero de pedido.</h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">
          Queremos que compres con informacion clara. Si recibiste un producto distinto a lo acordado, con falla visible o necesitas revisar tu compra, escribinos por WhatsApp.
        </p>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Card icon={<WhatsAppIcon size={24} className="h-6 w-6" />} title="Contacto directo" text="Mandanos el numero de pedido, fotos si corresponde y una breve descripcion del caso." />
          <Card icon={<RotateCcw size={22} />} title="Cambios coordinados" text="Evaluamos estado del producto, stock disponible y forma de entrega o retiro." />
          <Card icon={<ShieldCheck size={22} />} title="Pedido registrado" text="Cada compra queda guardada para poder dar seguimiento sin perder informacion." />
        </section>
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <p className="font-black">Politica simple</p>
          <p className="mt-1">Los cambios se coordinan con el comercio. El producto debe conservarse en buen estado y la resolucion depende del tipo de producto, disponibilidad y motivo del reclamo.</p>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappUrl(settings.whatsappNumber, "Hola Zuki Zone, quiero consultar por un cambio o devolucion.")} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 font-black text-white">
            <WhatsAppIcon size={20} className="h-5 w-5" />
            Escribir por WhatsApp
          </a>
          <Link href="/preguntas-frecuentes" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 px-5 font-black text-stone-950">
            Ver preguntas frecuentes
          </Link>
        </div>
      </section>
    </main>
  );
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="text-emerald-700">{icon}</div>
      <h2 className="mt-4 font-black text-stone-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </article>
  );
}
