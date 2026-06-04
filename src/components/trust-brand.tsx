import Link from "next/link";
import { Clock, CreditCard, MapPin, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import type { StoreSettings } from "@/lib/demo-data";
import { whatsappUrl } from "@/lib/utils";

const trustItems = [
  {
    icon: CreditCard,
    title: "Medios de pago",
    text: "Transferencia, efectivo y pago a coordinar antes de preparar el pedido.",
    href: "/preguntas-frecuentes",
  },
  {
    icon: Truck,
    title: "Envios coordinados",
    text: "Despachos por zona y entregas al interior segun producto y disponibilidad.",
    href: "/envios",
  },
  {
    icon: MapPin,
    title: "Retiro pactado",
    text: "Retiro con dia y horario confirmado para que no pierdas tiempo.",
    href: "/envios",
  },
  {
    icon: RotateCcw,
    title: "Cambios claros",
    text: "Si algo no coincide con lo acordado, lo revisamos con tu numero de pedido.",
    href: "/cambios-devoluciones",
  },
];

export function TrustStrip({ settings }: { settings: StoreSettings }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-emerald-950">
      <div className="grid gap-3 text-sm md:grid-cols-4">
        <TrustMini icon={<ShieldCheck className="h-5 w-5" />} text="Pedido registrado y con seguimiento" />
        <TrustMini icon={<CreditCard className="h-5 w-5" />} text="Pago acordado con la tienda" />
        <TrustMini icon={<Clock className="h-5 w-5" />} text="Atencion Lun a Sab de 9 a 19 hs" />
        <a className="flex items-center gap-3 font-black" href={whatsappUrl(settings.whatsappNumber, "Hola Zuki Zone, quiero hacer una consulta.")}>
          <WhatsAppIcon size={22} className="h-5 w-5" />
          WhatsApp comercial activo
        </a>
      </div>
    </div>
  );
}

export function TrustPanel({ settings, compact = false }: { settings: StoreSettings; compact?: boolean }) {
  return (
    <section className={compact ? "" : "bg-white"}>
      <div className={compact ? "" : "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"}>
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Compra con respaldo real</p>
              <h2 className="mt-2 text-2xl font-black text-stone-950 sm:text-3xl">Antes de preparar tu pedido, confirmamos todo con vos.</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {trustItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.title} href={item.href} className="group rounded-lg border border-stone-200 bg-stone-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50">
                      <Icon className="h-6 w-6 text-emerald-700" />
                      <p className="mt-3 font-black text-stone-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{item.text}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
            <aside className="rounded-lg bg-stone-950 p-5 text-white">
              <p className="text-sm font-black uppercase tracking-wider text-emerald-300">Atencion directa</p>
              <h3 className="mt-3 text-2xl font-black">Zuki Zone responde por WhatsApp</h3>
              <p className="mt-3 text-sm leading-6 text-stone-300">Horario comercial: lunes a sabados de 9 a 19 hs. Respondemos consultas de stock, envios, retiro y cambios.</p>
              <a href={whatsappUrl(settings.whatsappNumber, "Hola Zuki Zone, quiero consultar por una compra.")} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 font-black text-white">
                <WhatsAppIcon size={22} className="h-5 w-5" />
                Consultar ahora
              </a>
              <div className="mt-4 grid gap-2 text-xs text-stone-300">
                <Link href="/politica-privacidad" className="underline-offset-4 hover:underline">Politica de privacidad simple</Link>
                <Link href="/envios" className="underline-offset-4 hover:underline">Politica de envios</Link>
                <Link href="/cambios-devoluciones" className="underline-offset-4 hover:underline">Cambios y devoluciones</Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustMini({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 font-black">
      <span className="text-emerald-700">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
