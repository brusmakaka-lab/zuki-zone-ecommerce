"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

type Props = {
  label: string;
  name: string;
  value?: string | null;
  scope: string;
  required?: boolean;
  hint?: string;
};

export function AdminImageUpload({ label, name, value, scope, required, hint }: Props) {
  const [url, setUrl] = useState(value ?? "");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("");

    startTransition(async () => {
      const data = new FormData();
      data.set("file", file);
      data.set("scope", scope);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !payload?.url) {
        setMessage(payload?.error ?? "No se pudo subir la imagen.");
        return;
      }

      setUrl(payload.url);
      setMessage("Imagen subida. Guarda el formulario para persistir el cambio.");
    });
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold text-stone-800">{label}</label>
      {url ? (
        <div className="relative h-32 w-full overflow-hidden rounded-md border border-stone-200 bg-stone-50">
          <Image src={url} alt={label} fill className="object-contain p-2" unoptimized={url.endsWith(".svg") || url.endsWith(".ico")} />
        </div>
      ) : null}
      <input name={name} value={url} onChange={(event) => setUrl(event.target.value)} required={required} placeholder="URL de imagen" className="h-11 rounded-md border border-stone-200 px-3 text-sm" />
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-bold">
          {pending ? "Subiendo..." : "Subir imagen"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon" className="sr-only" onChange={onFileChange} />
        </label>
        {url ? (
          <button type="button" onClick={() => setUrl("")} className="h-10 rounded-md border border-rose-200 px-4 text-sm font-bold text-rose-700">
            Eliminar
          </button>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-stone-500">{hint}</p> : null}
      {message ? <p className={`text-xs font-bold ${message.startsWith("Imagen") ? "text-emerald-700" : "text-rose-700"}`}>{message}</p> : null}
    </div>
  );
}
