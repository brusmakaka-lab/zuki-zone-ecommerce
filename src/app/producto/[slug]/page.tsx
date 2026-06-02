import Link from "next/link";
import { notFound } from "next/navigation";
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

  const [settings, relatedProducts] = await Promise.all([
    getSettings(),
    getProducts({ category: product.category.slug }),
  ]);
  const related = relatedProducts
    .filter((current) => current.id !== product.id)
    .slice(0, 4);
  const productMessage = `Hola Zuki Zone, quiero consultar por ${product.name} (${formatMoney(product.price)}).`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />
        <div className="self-center">
          <Link href={`/catalogo?categoria=${product.category.slug}`} className="text-sm font-bold uppercase tracking-wider text-emerald-700">
            {product.category.name}
          </Link>
          <h1 className="mt-3 text-4xl font-black leading-tight text-stone-950">{product.name}</h1>
          <p className="mt-5 text-lg leading-8 text-stone-600">{product.description}</p>
          <div className="mt-6 flex items-end gap-3">
            <p className="text-4xl font-black text-stone-950">{formatMoney(product.price)}</p>
            {product.previousPrice ? <p className="text-lg text-stone-400 line-through">{formatMoney(product.previousPrice)}</p> : null}
          </div>
          <p className="mt-3 text-sm font-semibold text-stone-600">
            {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock disponible"}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={product} className="h-12 px-6" />
            <Link href="/checkout" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 px-6 font-bold text-stone-950 hover:border-emerald-700">
              Comprar ahora
            </Link>
            <a href={whatsappUrl(settings.whatsappNumber, productMessage)} className="inline-flex h-12 items-center justify-center rounded-md border border-emerald-600 px-6 font-bold text-emerald-700">
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
      {related.length ? (
        <section className="mt-14">
          <h2 className="text-2xl font-black text-stone-950">Tambien puede interesarte</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
