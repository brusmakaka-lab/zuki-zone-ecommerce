import Link from "next/link";
import { logoutAdmin } from "@/app/gestion-2002/actions";
import { requireAdminSession } from "@/lib/admin-auth";

const nav = [
  ["Dashboard", "/gestion-2002/dashboard"],
  ["Productos", "/gestion-2002/productos"],
  ["Categorias", "/gestion-2002/categorias"],
  ["Pedidos", "/gestion-2002/pedidos"],
  ["Clientes", "/gestion-2002/clientes"],
  ["Contenido", "/gestion-2002/contenido"],
  ["Configuracion", "/gestion-2002/configuracion"],
  ["Seguridad", "/gestion-2002/configuracion/seguridad"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="bg-stone-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4">
          <p className="px-3 text-sm font-black uppercase tracking-wider text-stone-500">Admin</p>
          <p className="px-3 pt-1 text-xs text-stone-500">{session.email}</p>
          <nav className="mt-4 grid gap-1">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-900">
                {label}
              </Link>
            ))}
          </nav>
          <form action={logoutAdmin} className="mt-4 border-t border-stone-100 pt-4">
            <button className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50">
              Cerrar sesion
            </button>
          </form>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
