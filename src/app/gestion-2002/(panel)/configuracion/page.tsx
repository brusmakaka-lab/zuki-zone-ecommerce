import Link from "next/link";
import { ImageUp, Lock, Palette, Wallet } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-6">
      <header className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Configuracion</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">Ajustes de la tienda</h1>
        <p className="mt-2 text-sm text-stone-600">Accesos rapidos para mantener la tienda actualizada y lista para vender.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        <SettingCard icon={<ImageUp size={22} />} title="Imagenes y marca" text="Cambia logo, favicon, portada, banners e imagenes principales." href="/gestion-2002/contenido" />
        <SettingCard icon={<Wallet size={22} />} title="Pagos y consultas" text="El checkout coordina el pedido por WhatsApp y deja todo registrado en pedidos." href="/gestion-2002/pedidos" />
        <SettingCard icon={<Lock size={22} />} title="Seguridad" text="Actualiza el email y la contrasena de ingreso al panel." href="/gestion-2002/configuracion/seguridad" />
        <SettingCard icon={<Palette size={22} />} title="Apariencia" text="Ajusta colores, textos principales, beneficios y redes desde contenido." href="/gestion-2002/contenido" />
      </section>
    </div>
  );
}

function SettingCard({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href: string }) {
  return (
    <Link href={href} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50">
      <div className="grid h-11 w-11 place-items-center rounded-md bg-emerald-100 text-emerald-800">{icon}</div>
      <h2 className="mt-4 text-lg font-black text-stone-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </Link>
  );
}
