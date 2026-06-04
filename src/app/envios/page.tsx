import Link from "next/link";
import { Clock, MapPin, PackageCheck, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getSettings } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

export default async function ShippingPage() {
  const settings = await getSettings();

  return (
    <main className="bg-stone-50">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Envios y retiro</p>
        <h1 className="mt-2 text-4xl font-black text-stone-950 md:text-5xl">Coordinamos la entrega antes de preparar tu pedido.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">
          Trabajamos con pedidos registrados y contacto directo por WhatsApp. Te confirmamos stock, zona, costo estimado y horario disponible antes de avanzar.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappUrl(settings.whatsappNumber, "Hola Zuki Zone, quiero consultar por envios o retiro.")} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 font-black text-white">
            <WhatsAppIcon size={20} className="h-5 w-5" />
            Consultar envio
          </a>
          <Link href="/catalogo" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 px-5 font-black text-stone-950">
            Ver productos
          </Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <Card icon={<Truck size={22} />} title="Envios por zona" text="Para CABA, alrededores y otras zonas te confirmamos opciones disponibles por WhatsApp." />
        <Card icon={<MapPin size={22} />} title="Retiro coordinado" text="Si preferis retirar, pactamos dia y franja horaria antes de preparar la compra." />
        <Card icon={<PackageCheck size={22} />} title="Pedido protegido" text="Tu pedido queda guardado con detalle de productos, datos de entrega y seguimiento." />
        <Card icon={<Clock size={22} />} title="Horarios" text="Atendemos consultas de lunes a sabados de 9 a 19 hs." />
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
