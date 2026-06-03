import { Mail, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getSettings } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Contacto</p>
        <h1 className="mt-3 text-4xl font-black text-stone-950">Estamos para ayudarte</h1>
        <p className="mt-3 max-w-2xl text-stone-600">Consultanos por productos, stock, envios o retiros. Respondemos por WhatsApp y email.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a href={whatsappUrl(settings.whatsappNumber, "Hola, quiero hacer una consulta sobre Zuki Zone.")} className="rounded-lg border border-stone-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50">
            <WhatsAppIcon size={28} className="h-7 w-7" alt="WhatsApp" />
            <h2 className="mt-4 font-black text-stone-950">WhatsApp</h2>
            <p className="mt-1 text-sm text-stone-600">Atencion directa para consultas y pedidos.</p>
          </a>
          <a href={`mailto:${settings.email}`} className="rounded-lg border border-stone-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50">
            <Mail className="text-emerald-700" size={24} />
            <h2 className="mt-4 font-black text-stone-950">Email</h2>
            <p className="mt-1 text-sm text-stone-600">{settings.email}</p>
          </a>
          <div className="rounded-lg border border-stone-200 p-5">
            <MapPin className="text-emerald-700" size={24} />
            <h2 className="mt-4 font-black text-stone-950">Direccion</h2>
            <p className="mt-1 text-sm text-stone-600">{settings.address}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
