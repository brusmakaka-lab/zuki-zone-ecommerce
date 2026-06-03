import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CreditCard, MapPinned, PackageCheck, ShieldCheck, Store, Truck } from "lucide-react";
import { HeroSlider } from "@/components/hero-slider";
import { ProductCarousel } from "@/components/product-carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getBenefits, getCategories, getHeroSlides, getIdeas, getProducts, getSettings } from "@/lib/data";

const iconMap = {
  "credit-card": CreditCard,
  store: Store,
  truck: Truck,
  map: MapPinned,
  sparkles: PackageCheck,
};

export default async function Home() {
  const [settings, categories, slides, ideas, benefits, featured, offers] = await Promise.all([
    getSettings(),
    getCategories(),
    getHeroSlides(),
    getIdeas(),
    getBenefits(),
    getProducts({ featured: true }),
    getProducts({ onSale: true }),
  ]);

  const quickAccess = categories.slice(0, 8);

  return (
    <div className="bg-stone-50">
      <HeroSlider slides={slides} />

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Compra simple y cercana</p>
            <p className="mt-1 text-sm text-stone-600">{settings.bannerText ?? "Coordinamos tu pedido por WhatsApp con atencion personalizada."}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/catalogo" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-black text-white">
              Ver catalogo
              <ArrowRight size={17} />
            </Link>
            <Link href="/ofertas" className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-black text-stone-900">
              Ofertas activas
            </Link>
          </div>
        </div>
      </section>

      <ScrollReveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = iconMap[benefit.icon as keyof typeof iconMap] ?? PackageCheck;
            return (
              <div key={benefit.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <Icon className="h-7 w-7 text-violet-700" />
                <p className="mt-3 font-black text-stone-950">{benefit.title}</p>
                {benefit.description ? <p className="mt-1 text-sm leading-6 text-stone-600">{benefit.description}</p> : null}
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-950 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            <span className="font-bold">Pedido registrado y con seguimiento</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-emerald-700" />
            <span className="font-bold">Pagas al coordinar la compra</span>
          </div>
          <div className="flex items-center gap-3">
            <WhatsAppIcon size={22} className="h-5 w-5" />
            <span className="font-bold">Atencion directa por WhatsApp</span>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-wider text-violet-700">Categorias</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">Todo para armar tu casa a tu manera</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((category, index) => (
            <Link key={category.id} href={`/catalogo?categoria=${category.slug}`} className={`group relative overflow-hidden rounded-xl bg-stone-900 ${index === 0 ? "lg:col-span-2" : ""}`}>
              <div className="relative aspect-[5/3]">
                <Image src={category.imageUrl ?? "/product-fallback.svg"} alt={category.name} fill sizes={index === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"} className="object-cover opacity-85 transition duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <p className="text-2xl font-black">{category.name}</p>
                <p className="mt-1 max-w-md text-sm text-stone-100">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {quickAccess.map((category) => (
            <Link key={category.id} href={`/catalogo?categoria=${category.slug}`} className="rounded-lg border border-stone-200 bg-white px-4 py-4 text-center text-sm font-black text-stone-800 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:text-violet-800">
              {category.name}
            </Link>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {featured.length ? <ProductCarousel title="Destacados" products={featured} /> : null}
      </ScrollReveal>

      {offers.length ? (
        <ScrollReveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ProductCarousel
            title="Ofertas"
            products={offers}
            action={
              <Link href="/ofertas" className="hidden rounded-md bg-orange-500 px-4 py-2 text-sm font-black text-white sm:inline-flex">
                Ver mas
              </Link>
            }
          />
        </ScrollReveal>
      ) : null}

      {ideas.length ? (
      <ScrollReveal className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-violet-700">Inspiracion Zuki</p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">Ideas para tu casa</h2>
            </div>
            <Link href="/catalogo" className="text-sm font-black text-violet-800">
              Ver productos
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {ideas.map((idea) => (
              <Link key={idea.id} href={idea.href ?? "/catalogo"} className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <Image src={idea.imageUrl} alt={idea.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-xl font-black text-stone-950">{idea.title}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{idea.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>
      ) : null}

      <section className="bg-stone-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-emerald-300">Newsletter</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">{settings.newsletterTitle ?? "Recibi novedades de Zuki Zone"}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-300 sm:text-base">{settings.newsletterText ?? settings.tagline}</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row lg:self-end">
            <input type="email" placeholder="tu@email.com" className="h-12 flex-1 rounded-md border border-white/20 bg-white px-4 text-stone-950 outline-none" />
            <button className="h-12 rounded-md bg-orange-500 px-6 font-black text-white">Suscribirme</button>
          </form>
        </div>
      </section>
    </div>
  );
}
