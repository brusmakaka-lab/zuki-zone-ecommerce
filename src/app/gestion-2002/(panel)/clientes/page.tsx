import { getPrisma, hasDatabase } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  if (!hasDatabase()) return <AdminNotice title="Clientes" />;
  const users = await getPrisma().user.findMany({ include: { profile: true, orders: true }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-3xl font-black text-stone-950">Clientes</h1>
      <div className="mt-6 grid gap-3">
        {users.map((user) => (
          <div key={user.id} className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="font-black">{user.name ?? user.email}</p>
            <p className="text-sm text-stone-500">{user.email}</p>
            <p className="mt-2 text-sm">Pedidos: {user.orders.length}</p>
            {user.profile?.phone ? <p className="text-sm">Telefono: {user.profile.phone}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminNotice({ title }: { title: string }) {
  return <div className="rounded-lg border border-amber-200 bg-amber-50 p-6"><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 text-sm">Configura DATABASE_URL para administrar.</p></div>;
}
