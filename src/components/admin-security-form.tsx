"use client";

import { useActionState } from "react";
import { updateAdminCredentials } from "@/app/gestion-2002/actions";

export function AdminSecurityForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(updateAdminCredentials, null);

  return (
    <form action={action} className="mt-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-5">
      <label className="grid gap-2 text-sm font-bold">
        Email admin
        <input name="email" type="email" defaultValue={email} required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Contraseña actual
        <input name="currentPassword" type="password" required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          Nueva contraseña
          <input name="newPassword" type="password" minLength={8} className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Confirmar nueva contraseña
          <input name="confirmPassword" type="password" minLength={8} className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
        </label>
      </div>
      {state?.message ? (
        <p className={`rounded-md p-3 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
          {state.message}
        </p>
      ) : null}
      <button disabled={pending} className="h-11 rounded-md bg-violet-700 px-5 font-black text-white disabled:bg-stone-300 md:w-fit">
        {pending ? "Guardando..." : "Guardar seguridad"}
      </button>
    </form>
  );
}
