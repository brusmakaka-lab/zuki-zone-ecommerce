import Link from "next/link";
import Image from "next/image";
import { Search, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { CartIndicator } from "@/components/cart/cart-indicator";
import type { StoreSettings } from "@/lib/demo-data";
import type { StoreCategory } from "@/lib/demo-data";
import { MegaMenu, MobileMenu } from "@/components/mega-menu";

export async function SiteHeader({ settings, categories }: { settings: StoreSettings; categories: StoreCategory[] }) {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.storeName}
              width={220}
              height={settings.logoHeight ?? 48}
              className="h-10 w-auto object-contain md:h-12"
              priority
              unoptimized={settings.logoUrl.endsWith(".svg")}
            />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-md bg-violet-700 text-lg font-black text-white">
              ZZ
            </span>
          )}
          <span className="leading-tight">
            <span className="block text-base font-black text-stone-950">{settings.storeName}</span>
            <span className="hidden text-xs text-stone-500 sm:block">Tienda online</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
          <MegaMenu categories={categories} />
          <Link href="/catalogo" className="hover:text-emerald-800">
            Catalogo
          </Link>
          <Link href="/ofertas" className="hover:text-emerald-800">
            Ofertas
          </Link>
          <Link href="/contacto" className="hover:text-emerald-800">
            Contacto
          </Link>
          <Link href="/mis-pedidos" className="hover:text-emerald-800">
            Mis pedidos
          </Link>
        </nav>
        <form action="/catalogo" className="ml-auto hidden max-w-xs flex-1 items-center rounded-md border border-stone-200 bg-stone-50 px-3 md:flex">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            name="q"
            placeholder="Buscar productos"
            className="h-10 w-full bg-transparent px-2 text-sm outline-none"
          />
        </form>
        <CartIndicator />
        <Link
          href={session ? "/mi-cuenta" : "/login"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-900 transition hover:border-emerald-700"
          aria-label={session ? "Mi cuenta" : "Ingresar"}
        >
          <UserRound className="h-5 w-5" />
        </Link>
        <MobileMenu categories={categories} />
      </div>
    </header>
  );
}
