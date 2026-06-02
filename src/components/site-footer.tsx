import Link from "next/link";
import Image from "next/image";
import { Camera, Mail, MapPin, MessageCircle, Share2 } from "lucide-react";
import type { StoreSettings } from "@/lib/demo-data";
import { whatsappUrl } from "@/lib/utils";

export function SiteFooter({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-5 lg:px-8">
        <div>
          {settings.logoUrl ? (
            <Image src={settings.logoUrl} alt={settings.storeName} width={240} height={64} className="h-14 w-auto object-contain" unoptimized={settings.logoUrl.endsWith(".svg")} />
          ) : (
            <p className="text-xl font-black">{settings.storeName}</p>
          )}
          <p className="mt-3 text-sm leading-6 text-stone-300">{settings.aboutText ?? settings.tagline}</p>
        </div>
        <div>
          <p className="font-semibold">Nosotros</p>
          <div className="mt-4 grid gap-2 text-sm text-stone-300">
            <Link href="/nosotros">Quienes somos</Link>
            <Link href="/catalogo">Productos</Link>
            <Link href="/mis-pedidos">Seguimiento</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Compras</p>
          <div className="mt-4 grid gap-2 text-sm text-stone-300">
            <Link href="/ofertas">Ofertas</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/mi-cuenta">Mi cuenta</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Contacto</p>
          <div className="mt-4 grid gap-3 text-sm text-stone-300">
            <a className="inline-flex items-center gap-2" href={whatsappUrl(settings.whatsappNumber, "Hola, quiero consultar por productos.")}>
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <Link className="inline-flex items-center gap-2" href="/contacto">
              <MapPin className="h-4 w-4" /> Contacto
            </Link>
            <a className="inline-flex items-center gap-2" href={`mailto:${settings.email}`}>
              <Mail className="h-4 w-4" /> {settings.email}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {settings.address}
            </span>
            {settings.instagramUrl ? (
              <a className="inline-flex items-center gap-2" href={settings.instagramUrl}>
                <Camera className="h-4 w-4" /> Instagram
              </a>
            ) : null}
            {settings.facebookUrl ? (
              <a className="inline-flex items-center gap-2" href={settings.facebookUrl}>
                <Share2 className="h-4 w-4" /> Facebook
              </a>
            ) : null}
          </div>
        </div>
        <div>
          <p className="font-semibold">Newsletter</p>
          <p className="mt-4 text-sm leading-6 text-stone-300">{settings.newsletterText ?? "Recibi novedades y ofertas."}</p>
          <form className="mt-4 grid gap-2">
            <input type="email" placeholder="Email" className="h-10 rounded-md border border-white/10 bg-white px-3 text-sm text-stone-950" />
            <button className="h-10 rounded-md bg-violet-700 text-sm font-black text-white">Suscribirme</button>
          </form>
        </div>
      </div>
    </footer>
  );
}
