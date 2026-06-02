import { MessageCircle, RotateCcw, ShieldCheck } from "lucide-react";

export default function ReturnsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Cambios y devoluciones</p>
      <h1 className="mt-2 text-4xl font-black text-stone-950">Compra con acompañamiento</h1>
      <p className="mt-4 text-lg leading-8 text-stone-600">Si el producto no coincide con lo acordado o necesitás revisar una compra, escribinos por WhatsApp con el número de pedido.</p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Card icon={<MessageCircle size={22} />} title="Contacto directo" text="Resolvemos cada caso por WhatsApp para mantener trazabilidad." />
        <Card icon={<RotateCcw size={22} />} title="Cambios coordinados" text="Evaluamos estado del producto, stock disponible y logística." />
        <Card icon={<ShieldCheck size={22} />} title="Pedido registrado" text="Cada compra queda guardada con datos y seguimiento." />
      </section>
    </main>
  );
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><div className="text-emerald-700">{icon}</div><h2 className="mt-4 font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p></article>;
}
