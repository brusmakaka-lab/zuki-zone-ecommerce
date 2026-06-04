import Link from "next/link";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getSettings } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <main className="bg-stone-50">
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Privacidad</p>
        <h1 className="mt-2 text-4xl font-black text-stone-950 md:text-5xl">Politica de privacidad simple</h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">
          Usamos tus datos solo para responder consultas, registrar pedidos, coordinar pagos, envios, retiros y seguimiento. No vendemos tu informacion ni la usamos para fines ajenos a la tienda.
        </p>
        <div className="mt-8 grid gap-4">
          <Card icon={<ShieldCheck size={22} />} title="Datos que pedimos" text="Nombre, telefono, email opcional, direccion, localidad y observaciones necesarias para preparar y coordinar tu pedido." />
          <Card icon={<LockKeyhole size={22} />} title="Como los usamos" text="Para confirmar stock, armar el pedido, contactar por WhatsApp, coordinar entrega o retiro y mantener historial de seguimiento." />
          <Card icon={<Mail size={22} />} title="Contacto" text={`Si queres consultar o corregir tus datos, podes escribirnos a ${settings.email} o por WhatsApp.`} />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappUrl(settings.whatsappNumber, "Hola Zuki Zone, quiero consultar sobre privacidad de datos.")} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 font-black text-white">
            <WhatsAppIcon size={20} className="h-5 w-5" />
            Consultar por WhatsApp
          </a>
          <Link href="/catalogo" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 px-5 font-black text-stone-950">
            Volver a la tienda
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
      <p className="mt-2 leading-7 text-stone-600">{text}</p>
    </article>
  );
}
