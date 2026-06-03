import Link from "next/link";
import Image from "next/image";
import { Camera, Mail, MapPin, Share2 } from "lucide-react";
import type { StoreSettings } from "@/lib/demo-data";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappUrl } from "@/lib/utils";

export function SiteFooter({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-9 sm:px-6 md:grid-cols-5 md:py-12 lg:px-8">
        <div className="md:pr-4">
          {settings.logoUrl ? (
            <Image src={settings.logoUrl} alt={settings.storeName} width={240} height={64} className="h-14 w-auto object-contain" unoptimized={settings.logoUrl.endsWith(".svg")} />
          ) : (
            <p className="text-xl font-black">{settings.storeName}</p>
          )}
          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-300">{settings.aboutText ?? settings.tagline}</p>
        </div>
        <div>
          <p className="font-black">Nosotros</p>
          <div className="mt-3 grid gap-2 text-sm text-stone-300">
            <Link href="/nosotros">Quienes somos</Link>
            <Link href="/catalogo">Productos</Link>
            <Link href="/mis-pedidos">Seguimiento</Link>
          </div>
        </div>
        <div>
          <p className="font-black">Compras</p>
          <div className="mt-3 grid gap-2 text-sm text-stone-300">
            <Link href="/ofertas">Ofertas</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/mi-cuenta">Mi cuenta</Link>
            <Link href="/envios">Envios</Link>
            <Link href="/cambios-devoluciones">Cambios y devoluciones</Link>
            <Link href="/preguntas-frecuentes">Preguntas frecuentes</Link>
          </div>
        </div>
        <div>
          <p className="font-black">Contacto</p>
          <div className="mt-3 grid gap-2.5 text-sm text-stone-300">
            <a className="inline-flex items-center gap-2" href={whatsappUrl(settings.whatsappNumber, "Hola, quiero consultar por productos.")}>
              <WhatsAppIcon size={18} className="h-4 w-4" /> WhatsApp
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
          <p className="font-black">Newsletter</p>
          <p className="mt-3 text-sm leading-6 text-stone-300">{settings.newsletterText ?? "Recibi novedades y ofertas."}</p>
          <form className="mt-3 grid gap-2">
            <input type="email" placeholder="Email" className="h-11 rounded-md border border-white/10 bg-white px-3 text-sm text-stone-950" />
            <button className="h-11 rounded-md bg-emerald-700 text-sm font-black text-white">Suscribirme</button>
          </form>
        </div>
      </div>
    </footer>
  );
}
