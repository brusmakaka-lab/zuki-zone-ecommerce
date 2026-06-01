"use client";

import { useState, useTransition } from "react";

export function AdminLoginForm() {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setMessage("");

    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (response.ok) {
        window.location.href = "/gestion-2002/dashboard";
        return;
      }

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(data?.error ?? "No pudimos iniciar sesion.");
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm font-bold text-stone-800">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-11 rounded-md border border-stone-200 px-3 font-normal outline-violet-700"
          placeholder="admin@zukizone.com"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-stone-800">
        Contraseña
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 rounded-md border border-stone-200 px-3 font-normal outline-violet-700"
          placeholder="••••••••"
        />
      </label>
      {message ? <p className="rounded-md bg-rose-50 p-3 text-sm font-bold text-rose-700">{message}</p> : null}
      <button disabled={pending} className="h-11 rounded-md bg-violet-700 font-black text-white disabled:bg-stone-300">
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
