import Link from "next/link";
import { ShieldCheck, Store, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getSettings } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main className="bg-stone-50">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Nosotros</p>
          <h1 className="mt-3 text-4xl font-black text-stone-950 md:text-5xl">Bazar practico para una casa mas simple y linda</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">{settings.aboutText ?? settings.tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/catalogo" className="rounded-md bg-emerald-700 px-5 py-3 font-bold text-white">Ver productos</Link>
            <a href={whatsappUrl(settings.whatsappNumber, "Hola, quiero conocer mas sobre Zuki Zone.")} className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-5 py-3 font-bold text-stone-900">
              <WhatsAppIcon size={20} className="h-5 w-5" />
              Hablar por WhatsApp
            </a>
          </div>
        </div>
        <div className="grid gap-3">
          <Info icon={<Store size={22} />} title="Atencion cercana" text="Te ayudamos a elegir productos para tu casa, regalo o emprendimiento." />
          <Info icon={<Truck size={22} />} title="Envios y retiro" text="Coordinamos entrega segun zona, disponibilidad y tipo de pedido." />
          <Info icon={<ShieldCheck size={22} />} title="Compra clara" text="Confirmas tu pedido, recibis seguimiento y mantenes contacto directo con la tienda." />
        </div>
      </section>
    </main>
  );
}

function Info({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid h-11 w-11 place-items-center rounded-md bg-emerald-100 text-emerald-800">{icon}</div>
      <h2 className="mt-4 text-lg font-black text-stone-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </article>
  );
}
