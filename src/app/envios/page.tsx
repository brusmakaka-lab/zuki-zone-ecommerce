import { MapPin, PackageCheck, Truck } from "lucide-react";
import { getSettings } from "@/lib/data";

export default async function ShippingPage() {
  const settings = await getSettings();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Envios</p>
      <h1 className="mt-2 text-4xl font-black text-stone-950">Envios y retiros coordinados</h1>
      <p className="mt-4 text-lg leading-8 text-stone-600">{settings.shippingText ?? "Coordinamos cada entrega segun zona, disponibilidad y tipo de producto."}</p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Card icon={<Truck size={22} />} title="Envios por zona" text="Te confirmamos opciones y tiempos antes de preparar el pedido." />
        <Card icon={<MapPin size={22} />} title="Retiro coordinado" text="Si preferis retirar, pactamos dia y horario por WhatsApp." />
        <Card icon={<PackageCheck size={22} />} title="Pedido preparado" text="Armamos tu compra cuando confirmamos stock y forma de pago." />
      </section>
    </main>
  );
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><div className="text-emerald-700">{icon}</div><h2 className="mt-4 font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p></article>;
}
