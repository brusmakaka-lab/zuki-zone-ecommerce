import Link from "next/link";
import { Clock, HeartHandshake, PackageCheck, Store, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getSettings } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main className="bg-stone-50">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_430px] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Nosotros</p>
          <h1 className="mt-3 text-4xl font-black text-stone-950 md:text-5xl">Somos Zuki Zone, una tienda online pensada para resolver compras cotidianas sin vueltas.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
            Seleccionamos productos de bazar, organizacion, deco y uso diario para que puedas comprar desde el catalogo, consultar por WhatsApp y recibir seguimiento claro del pedido.
          </p>
          <p className="mt-4 max-w-2xl leading-7 text-stone-600">
            Detras de la tienda hay atencion real: revisamos stock, coordinamos entrega o retiro y dejamos cada pedido registrado para que sepas en que estado esta.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/catalogo" className="inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 font-bold text-white">Ver productos</Link>
            <a href={whatsappUrl(settings.whatsappNumber, "Hola, quiero conocer mas sobre Zuki Zone.")} className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-stone-300 px-5 font-bold text-stone-900">
              <WhatsAppIcon size={20} className="h-5 w-5" />
              Hablar por WhatsApp
            </a>
          </div>
        </div>
        <div className="grid gap-3">
          <Info icon={<Store size={22} />} title="Tienda online activa" text="Catalogo disponible todos los dias y atencion comercial en horario de tienda." />
          <Info icon={<Clock size={22} />} title="Horario de atencion" text="Respondemos consultas de lunes a sabados de 9 a 19 hs." />
          <Info icon={<Truck size={22} />} title="Envios y retiro" text="Coordinamos la mejor opcion segun zona, producto y disponibilidad." />
          <Info icon={<PackageCheck size={22} />} title="Pedido registrado" text="Tu compra queda guardada con productos, datos y seguimiento." />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 md:grid-cols-[280px_1fr] md:items-start">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-800">
              <HeartHandshake className="h-9 w-9" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-stone-950">Nuestra forma de vender</h2>
              <div className="mt-4 grid gap-4 text-sm leading-7 text-stone-600 md:grid-cols-3">
                <p><strong className="text-stone-950">1. Elegis productos.</strong><br />Agregas al carrito o nos consultas directo si tenes dudas.</p>
                <p><strong className="text-stone-950">2. Confirmamos stock.</strong><br />Revisamos disponibilidad, entrega, retiro y forma de pago.</p>
                <p><strong className="text-stone-950">3. Seguimos tu pedido.</strong><br />El estado queda visible y podes escribirnos por WhatsApp.</p>
              </div>
            </div>
          </div>
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
