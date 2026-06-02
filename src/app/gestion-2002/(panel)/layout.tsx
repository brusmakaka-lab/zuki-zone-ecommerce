import Link from "next/link";
import { ExternalLink, LayoutDashboard, Lock, LogOut, Package, Settings, ShoppingBag, Tags, Users, Wand2 } from "lucide-react";
import { logoutAdmin } from "@/app/gestion-2002/actions";
import { requireAdminSession } from "@/lib/admin-auth";

const nav = [
  { label: "Dashboard", href: "/gestion-2002/dashboard", icon: LayoutDashboard },
  { label: "Productos", href: "/gestion-2002/productos", icon: Package },
  { label: "Categorias", href: "/gestion-2002/categorias", icon: Tags },
  { label: "Pedidos", href: "/gestion-2002/pedidos", icon: ShoppingBag },
  { label: "Clientes", href: "/gestion-2002/clientes", icon: Users },
  { label: "Contenido", href: "/gestion-2002/contenido", icon: Wand2 },
  { label: "Configuracion", href: "/gestion-2002/configuracion", icon: Settings },
  { label: "Seguridad", href: "/gestion-2002/configuracion/seguridad", icon: Lock },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-5">
          <div className="rounded-lg bg-stone-950 p-4 text-white">
            <p className="text-sm font-black uppercase">Zuki Zone</p>
            <p className="mt-1 text-xs text-stone-300">Panel de gestion</p>
          </div>
          <p className="mt-4 truncate px-3 text-xs font-semibold text-stone-500">{session.email}</p>
          <nav className="mt-3 grid gap-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-900">
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/" target="_blank" className="mt-4 flex items-center gap-3 rounded-md border border-stone-200 px-3 py-2.5 text-sm font-bold text-stone-800 hover:bg-stone-50">
            <ExternalLink size={17} />
            Ver tienda
          </Link>
          <form action={logoutAdmin} className="mt-3 border-t border-stone-100 pt-3">
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50">
              <LogOut size={17} />
              Cerrar sesion
            </button>
          </form>
        </aside>
        <main className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm shadow-sm">
            <div>
              <p className="font-black text-stone-950">Gestion del comercio</p>
              <p className="text-xs text-stone-500">Cambios de productos, contenido y pedidos quedan guardados en Neon.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/gestion-2002/productos" className="rounded-md bg-emerald-700 px-3 py-2 font-bold text-white">
                Nuevo producto
              </Link>
              <Link href="/gestion-2002/contenido" className="rounded-md border border-stone-300 px-3 py-2 font-bold text-stone-800">
                Portada
              </Link>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
