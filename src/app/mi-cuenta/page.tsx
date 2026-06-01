import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { saveProfile } from "@/app/actions";
import { getPrisma, hasDatabase } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/mi-cuenta");

  const profile = hasDatabase()
    ? await getPrisma().customerProfile.findUnique({ where: { userId: session.user.id } }).catch(() => null)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-stone-950">Mi cuenta</h1>
          <p className="mt-2 text-stone-600">{session.user.email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="rounded-md border border-stone-300 px-4 py-2 text-sm font-bold">Salir</button>
        </form>
      </div>
      <form action={saveProfile} className="mt-8 grid gap-4 rounded-lg border border-stone-200 bg-white p-5">
        <label className="grid gap-2 text-sm font-semibold">
          Nombre completo
          <input name="fullName" defaultValue={profile?.fullName ?? session.user.name ?? ""} required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Telefono
            <input name="phone" defaultValue={profile?.phone ?? ""} required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Localidad
            <input name="city" defaultValue={profile?.city ?? ""} required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold">
          Direccion
          <input name="address" defaultValue={profile?.address ?? ""} required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Referencia
          <input name="reference" defaultValue={profile?.reference ?? ""} className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Observaciones
          <textarea name="notes" defaultValue={profile?.notes ?? ""} rows={4} className="rounded-md border border-stone-200 px-3 py-2 font-normal" />
        </label>
        <button className="h-12 rounded-md bg-emerald-700 font-bold text-white">Guardar datos</button>
      </form>
    </div>
  );
}
