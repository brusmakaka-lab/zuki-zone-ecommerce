"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { createCheckoutOrder } from "@/app/actions";
import { CheckoutStartedTracker } from "@/components/analytics-trackers";
import { useCart } from "@/components/cart/cart-provider";
import { ProductCard } from "@/components/product-card";
import { TrustPanel } from "@/components/trust-brand";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import type { StoreCategory, StoreProduct, StoreSettings } from "@/lib/demo-data";
import { formatMoney } from "@/lib/utils";

export function CheckoutClient({
  userEmail,
  userName,
  recommended,
  categories,
  settings,
}: {
  userEmail: string;
  userName: string;
  recommended: StoreProduct[];
  categories: StoreCategory[];
  settings: StoreSettings;
}) {
  const { items, total } = useCart();
  const [state, action, pending] = useActionState(createCheckoutOrder, null);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-stone-200 bg-white p-7 text-center shadow-sm sm:p-10">
          <ShoppingBag className="mx-auto h-11 w-11 text-emerald-700" />
          <h1 className="mt-4 text-3xl font-black text-stone-950">Tu carrito esta vacio.</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-stone-600">
            Elegi productos del catalogo y volve para coordinar tu compra por WhatsApp con seguimiento del pedido.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/catalogo" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 font-bold text-white transition hover:bg-emerald-800">
              Elegir productos
              <ArrowRight size={18} />
            </Link>
            <Link href="/ofertas" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 px-5 font-bold text-stone-900 transition hover:border-emerald-300 hover:bg-emerald-50">
              Ver ofertas
            </Link>
          </div>
        </section>
        {categories.length ? (
          <section className="mt-8">
            <h2 className="text-xl font-black text-stone-950">Comprar por categoria</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalogo?categoria=${category.slug}`}
                  className="rounded-lg border border-stone-200 bg-white px-4 py-4 text-center text-sm font-black text-stone-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
        {recommended.length ? (
          <section className="mt-8">
            <h2 className="text-xl font-black text-stone-950">Recomendados para empezar</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
      <CheckoutStartedTracker enabled={items.length > 0} />
      <section>
        <h1 className="text-4xl font-black text-stone-950">Checkout</h1>
        <p className="mt-2 text-stone-600">Confirmamos tu pedido por WhatsApp para coordinar pago, retiro o envio.</p>
        <form action={action} className="mt-8 grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
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
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
            <p className="font-black">Pedido sin sorpresas</p>
            <p className="mt-1">Guardamos tu pedido, verificamos stock y te escribimos por WhatsApp antes de preparar o cobrar la compra.</p>
          </div>
          <button disabled={pending} className="h-12 rounded-md bg-emerald-700 font-bold text-white disabled:bg-stone-300">
            {pending ? "Generando pedido..." : "Generar pedido y abrir WhatsApp"}
          </button>
          <p className="text-sm text-stone-500">No se cobra online en este paso. Te contactamos para confirmar disponibilidad, medio de pago y entrega.</p>
        </form>
      </section>
      <aside className="order-first h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm lg:order-none">
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
        <div className="mt-5 grid gap-3 border-t border-stone-100 pt-5 text-sm">
          <Trust icon={<WhatsAppIcon size={18} className="h-[18px] w-[18px]" />} text="Confirmacion directa por WhatsApp" />
          <Trust icon={<Truck size={16} />} text="Envio o retiro coordinado" />
          <Trust icon={<CreditCard size={16} />} text="Pago a coordinar antes de preparar" />
          <Trust icon={<ShieldCheck size={16} />} text="Pedido registrado con seguimiento" />
        </div>
      </aside>
      <div className="lg:col-span-2">
        <TrustPanel settings={settings} compact />
      </div>
    </div>
  );
}

function Trust({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-stone-50 px-3 py-2 font-semibold text-stone-700">
      <span className="text-emerald-700">{icon}</span>
      {text}
    </div>
  );
}
