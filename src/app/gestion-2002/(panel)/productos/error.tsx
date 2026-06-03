"use client";

import Link from "next/link";

export default function ProductsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-900">
      <h1 className="text-2xl font-black">No pudimos cargar productos</h1>
      <p className="mt-2 text-sm font-semibold">El panel encontro un problema inesperado. Proba recargar y, si sigue pasando, revisa los datos cargados recientemente.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={reset} className="h-10 rounded-md bg-rose-700 px-4 text-sm font-bold text-white">Reintentar</button>
        <Link href="/gestion-2002/dashboard" className="inline-flex h-10 items-center rounded-md border border-rose-300 px-4 text-sm font-bold">Volver al dashboard</Link>
      </div>
    </div>
  );
}
