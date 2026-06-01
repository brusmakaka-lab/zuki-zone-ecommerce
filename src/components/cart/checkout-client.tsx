"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCheckoutOrder } from "@/app/actions";
import { useCart } from "@/components/cart/cart-provider";
import { formatMoney } from "@/lib/utils";

export function CheckoutClient({ userEmail, userName }: { userEmail: string; userName: string }) {
  const { items, total } = useCart();
  const [state, action, pending] = useActionState(createCheckoutOrder, null);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <h1 className="text-3xl font-black">Tu carrito esta vacio.</h1>
        <Link href="/catalogo" className="mt-5 inline-flex rounded-md bg-emerald-700 px-5 py-3 font-bold text-white">
          Elegir productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
      <section>
        <h1 className="text-4xl font-black text-stone-950">Checkout</h1>
        <p className="mt-2 text-stone-600">El pedido se guarda y se envia la consulta por WhatsApp al comercio.</p>
        <form action={action} className="mt-8 grid gap-4 rounded-lg border border-stone-200 bg-white p-5">
          <input type="hidden" name="items" value={JSON.stringify(items.map((item) => ({ productId: item.productId, quantity: item.quantity })))} />
          <label className="grid gap-2 text-sm font-semibold">
            Nombre completo
            <input name="fullName" defaultValue={userName} required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Email opcional
              <input name="email" defaultValue={userEmail} type="email" className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Telefono
              <input name="phone" required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold">
            Direccion
            <input name="address" required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Localidad
              <input name="city" required className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Referencia
              <input name="reference" className="h-11 rounded-md border border-stone-200 px-3 font-normal" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold">
            Observaciones
            <textarea name="observations" rows={4} className="rounded-md border border-stone-200 px-3 py-2 font-normal" />
          </label>
          {state?.message ? <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-800">{state.message}</p> : null}
          <button disabled={pending} className="h-12 rounded-md bg-emerald-700 font-bold text-white disabled:bg-stone-300">
            {pending ? "Generando pedido..." : "Generar pedido y abrir WhatsApp"}
          </button>
          <p className="text-sm text-stone-500">Mercado Pago queda preparado para activarse con token real. Mientras tanto, el flujo usa consulta / pago a coordinar.</p>
        </form>
      </section>
      <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-xl font-black">Resumen</h2>
        <div className="mt-4 grid gap-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-4 text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span className="font-bold">{formatMoney(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-stone-200 pt-5 text-lg font-black">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </aside>
    </div>
  );
}
