const faqs = [
  ["Como compro?", "Agregas productos al carrito, completas tus datos y enviamos la consulta por WhatsApp para confirmar stock, pago y entrega."],
  ["Tengo que crear una cuenta?", "No. Podes comprar como invitado. Si usas cuenta, guardas datos y seguimiento."],
  ["Como pago?", "El pago se coordina con la tienda antes de preparar el pedido."],
  ["Hacen envios?", "Si. Las opciones dependen de zona, producto y disponibilidad."],
  ["Como sigo mi pedido?", "Con el numero de pedido podes consultar el estado desde Mis pedidos o por WhatsApp."],
];

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Ayuda</p>
      <h1 className="mt-2 text-4xl font-black text-stone-950">Preguntas frecuentes</h1>
      <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        {faqs.map(([question, answer]) => (
          <details key={question} className="border-b border-stone-100 py-4 last:border-b-0">
            <summary className="cursor-pointer font-black text-stone-950">{question}</summary>
            <p className="mt-2 leading-7 text-stone-600">{answer}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
