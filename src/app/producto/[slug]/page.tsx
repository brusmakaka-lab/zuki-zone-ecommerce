import Link from "next/link";
import { notFound } from "next/navigation";
import { CreditCard, HelpCircle, MessageCircle, PackageCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { getProductBySlug, getProducts, getSettings } from "@/lib/data";
import { formatMoney, whatsappUrl } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, relatedProducts, fallbackProducts] = await Promise.all([
    getSettings(),
    getProducts({ category: product.category.slug }),
    getProducts({ featured: true }),
  ]);
  const related = Array.from(
    new Map(
      [...relatedProducts, ...fallbackProducts]
        .filter((current) => current.id !== product.id)
        .map((current) => [current.id, current]),
    ).values(),
  ).slice(0, 4);
  const productMessage = `Hola Zuki Zone, quiero consultar por ${product.name} (${formatMoney(product.price)}).`;

  return (
    <div className="bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={product.images} productName={product.name} />
        <div className="self-start rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/catalogo?categoria=${product.category.slug}`} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">
              {product.category.name}
            </Link>
            {product.onSale ? <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black uppercase text-rose-700">Precio especial</span> : null}
            {product.featured ? <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black uppercase text-stone-800">Seleccion Zuki</span> : null}
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight text-stone-950 md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">{product.shortDescription || product.description}</p>
          <div className="mt-6 rounded-lg bg-stone-50 p-4">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-4xl font-black text-stone-950">{formatMoney(product.price)}</p>
              {product.previousPrice ? <p className="text-lg text-stone-400 line-through">{formatMoney(product.previousPrice)}</p> : null}
            </div>
            <p className="mt-2 text-sm font-semibold text-stone-600">
              {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock disponible"}
            </p>
          </div>
          <div className="mt-6 grid gap-3">
            <AddToCartButton product={product} className="h-12 w-full px-6 text-base" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/checkout" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 px-6 font-bold text-stone-950 hover:border-emerald-700">
                Comprar ahora
              </Link>
              <a href={whatsappUrl(settings.whatsappNumber, productMessage)} className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-emerald-600 px-6 font-bold text-emerald-700">
                <MessageCircle size={18} />
                Consultar
              </a>
            </div>
          </div>
          <div className="mt-6 grid gap-3 border-t border-stone-100 pt-5 sm:grid-cols-2">
            <TrustItem icon={<Truck size={18} />} title="Envios coordinados" text={settings.shippingText ?? "Coordinamos entrega o retiro segun tu zona."} />
            <TrustItem icon={<CreditCard size={18} />} title="Medios de pago" text={settings.paymentText ?? "Transferencia, efectivo o pago a coordinar."} />
            <TrustItem icon={<RotateCcw size={18} />} title="Cambios" text="Si algo no coincide, escribinos y lo resolvemos." />
            <TrustItem icon={<ShieldCheck size={18} />} title="Compra segura" text="Tu pedido queda registrado y con seguimiento." />
          </div>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-stone-950">Detalles del producto</h2>
          <p className="mt-4 leading-8 text-stone-600">{product.description}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniBenefit icon={<PackageCheck size={18} />} title="Listo para usar" />
            <MiniBenefit icon={<ShieldCheck size={18} />} title="Seleccionado por Zuki" />
            <MiniBenefit icon={<MessageCircle size={18} />} title="Asesoria por WhatsApp" />
          </div>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black text-stone-950"><HelpCircle size={20} /> Preguntas frecuentes</h2>
          <FAQ question="Como coordino el envio?" answer="Al confirmar el pedido te contactamos por WhatsApp para definir entrega, retiro y disponibilidad." />
          <FAQ question="Puedo comprar como invitado?" answer="Si. No hace falta crear una cuenta para enviar la consulta y dejar el pedido registrado." />
          <FAQ question="El precio queda confirmado?" answer="Confirmamos precio, stock y forma de pago antes de preparar el pedido." />
        </div>
      </section>

      {related.length ? (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Tambien puede interesarte</p>
              <h2 className="mt-1 text-3xl font-black text-stone-950">Combinalo con estos productos</h2>
            </div>
            <Link href={`/catalogo?categoria=${product.category.slug}`} className="hidden rounded-md border border-stone-300 px-4 py-2 text-sm font-bold sm:inline-flex">Ver categoria</Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
      </div>
    </div>
  );
}

function TrustItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-md bg-stone-50 p-3">
      <div className="mt-0.5 text-emerald-700">{icon}</div>
      <div>
        <p className="text-sm font-black text-stone-950">{title}</p>
        <p className="mt-1 text-xs leading-5 text-stone-600">{text}</p>
      </div>
    </div>
  );
}

function MiniBenefit({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm font-bold text-stone-800">
      <span className="text-emerald-700">{icon}</span>
      {title}
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="border-b border-stone-100 py-4 last:border-b-0">
      <summary className="cursor-pointer font-bold text-stone-950">{question}</summary>
      <p className="mt-2 text-sm leading-6 text-stone-600">{answer}</p>
    </details>
  );
}
