import { updateSettings, upsertBenefit, upsertHeroSlide, upsertIdea } from "@/app/gestion-2002/actions";
import { getSettings } from "@/lib/data";
import { getPrisma, hasDatabase } from "@/lib/prisma";

export default async function AdminContentPage() {
  const settings = await getSettings();
  const [slides, ideas, benefits] = hasDatabase()
    ? await Promise.all([
        getPrisma().heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
        getPrisma().inspirationIdea.findMany({ orderBy: { sortOrder: "asc" } }),
        getPrisma().storeBenefit.findMany({ orderBy: { sortOrder: "asc" } }),
      ])
    : [[], [], []];

  return (
    <div>
      <h1 className="text-3xl font-black text-stone-950">Contenido web</h1>
      <form action={updateSettings} className="mt-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <input name="storeName" defaultValue={settings.storeName} className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="tagline" defaultValue={settings.tagline} className="h-11 rounded-md border border-stone-200 px-3" />
        </div>
        <input name="heroTitle" defaultValue={settings.heroTitle} className="h-11 rounded-md border border-stone-200 px-3" />
        <textarea name="heroText" defaultValue={settings.heroText} rows={3} className="rounded-md border border-stone-200 px-3 py-2" />
        <textarea name="bannerText" defaultValue={settings.bannerText ?? ""} rows={2} className="rounded-md border border-stone-200 px-3 py-2" />
        <div className="grid gap-4 md:grid-cols-3">
          <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="email" defaultValue={settings.email} className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="address" defaultValue={settings.address} className="h-11 rounded-md border border-stone-200 px-3" />
        </div>
        <input name="shippingText" defaultValue={settings.shippingText ?? ""} className="h-11 rounded-md border border-stone-200 px-3" />
        <input name="paymentText" defaultValue={settings.paymentText ?? ""} className="h-11 rounded-md border border-stone-200 px-3" />
        <textarea name="aboutText" defaultValue={settings.aboutText ?? ""} rows={3} className="rounded-md border border-stone-200 px-3 py-2" />
        <div className="grid gap-4 md:grid-cols-3">
          <input name="instagramUrl" defaultValue={settings.instagramUrl ?? ""} placeholder="Instagram" className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="facebookUrl" defaultValue={settings.facebookUrl ?? ""} placeholder="Facebook" className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="tiktokUrl" defaultValue={settings.tiktokUrl ?? ""} placeholder="TikTok" className="h-11 rounded-md border border-stone-200 px-3" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="newsletterTitle" defaultValue={settings.newsletterTitle ?? ""} placeholder="Titulo newsletter" className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="newsletterText" defaultValue={settings.newsletterText ?? ""} placeholder="Texto newsletter" className="h-11 rounded-md border border-stone-200 px-3" />
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          <input name="logoUrl" defaultValue={settings.logoUrl ?? ""} placeholder="Logo URL" className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="faviconUrl" defaultValue={settings.faviconUrl ?? ""} placeholder="Favicon URL" className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="primaryColor" defaultValue={settings.primaryColor ?? "#7c3aed"} type="color" className="h-11 rounded-md border border-stone-200 px-2" />
          <input name="accentColor" defaultValue={settings.accentColor ?? "#f97316"} type="color" className="h-11 rounded-md border border-stone-200 px-2" />
          <input name="radius" defaultValue={settings.radius ?? 10} type="number" className="h-11 rounded-md border border-stone-200 px-3" />
        </div>
        <select name="themeMode" defaultValue={settings.themeMode ?? "light"} className="h-11 rounded-md border border-stone-200 px-3 md:w-fit">
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>
        <button className="h-11 rounded-md bg-emerald-700 px-5 font-bold text-white md:w-fit">Guardar contenido</button>
      </form>

      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-black">Hero y banners</h2>
        <form action={upsertHeroSlide} className="mt-4 grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input name="title" placeholder="Titulo" required className="h-11 rounded-md border border-stone-200 px-3" />
            <input name="imageUrl" placeholder="Imagen" required className="h-11 rounded-md border border-stone-200 px-3" />
          </div>
          <input name="subtitle" placeholder="Subtitulo" className="h-11 rounded-md border border-stone-200 px-3" />
          <div className="grid gap-3 md:grid-cols-4">
            <input name="ctaLabel" placeholder="CTA" className="h-11 rounded-md border border-stone-200 px-3" />
            <input name="ctaHref" placeholder="/catalogo" className="h-11 rounded-md border border-stone-200 px-3" />
            <input name="sortOrder" type="number" placeholder="Orden" className="h-11 rounded-md border border-stone-200 px-3" />
            <label className="flex items-center gap-2 text-sm font-semibold"><input name="active" type="checkbox" defaultChecked /> Activo</label>
          </div>
          <button className="h-10 rounded-md bg-violet-700 px-4 font-bold text-white md:w-fit">Crear slide</button>
        </form>
        <div className="mt-4 grid gap-2 text-sm text-stone-600">
          {slides.map((slide) => <p key={slide.id}>{slide.title} · {slide.active ? "activo" : "oculto"}</p>)}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-black">Ideas para tu casa</h2>
        <form action={upsertIdea} className="mt-4 grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input name="title" placeholder="Titulo" required className="h-11 rounded-md border border-stone-200 px-3" />
            <input name="imageUrl" placeholder="Imagen" required className="h-11 rounded-md border border-stone-200 px-3" />
          </div>
          <textarea name="excerpt" placeholder="Resumen" required rows={2} className="rounded-md border border-stone-200 px-3 py-2" />
          <div className="grid gap-3 md:grid-cols-3">
            <input name="href" placeholder="/catalogo" className="h-11 rounded-md border border-stone-200 px-3" />
            <input name="sortOrder" type="number" placeholder="Orden" className="h-11 rounded-md border border-stone-200 px-3" />
            <label className="flex items-center gap-2 text-sm font-semibold"><input name="active" type="checkbox" defaultChecked /> Activa</label>
          </div>
          <button className="h-10 rounded-md bg-violet-700 px-4 font-bold text-white md:w-fit">Crear idea</button>
        </form>
        <div className="mt-4 grid gap-2 text-sm text-stone-600">
          {ideas.map((idea) => <p key={idea.id}>{idea.title} · {idea.active ? "activa" : "oculta"}</p>)}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-black">Beneficios comerciales</h2>
        <form action={upsertBenefit} className="mt-4 grid gap-3 md:grid-cols-5">
          <input name="title" placeholder="Titulo" required className="h-11 rounded-md border border-stone-200 px-3" />
          <input name="description" placeholder="Descripcion" className="h-11 rounded-md border border-stone-200 px-3 md:col-span-2" />
          <select name="icon" className="h-11 rounded-md border border-stone-200 px-3">
            <option value="credit-card">Tarjeta</option>
            <option value="store">Retiro</option>
            <option value="truck">Envios</option>
            <option value="map">Pais</option>
          </select>
          <button className="h-11 rounded-md bg-violet-700 px-4 font-bold text-white">Crear</button>
          <label className="flex items-center gap-2 text-sm font-semibold"><input name="active" type="checkbox" defaultChecked /> Activo</label>
        </form>
        <div className="mt-4 grid gap-2 text-sm text-stone-600">
          {benefits.map((benefit) => <p key={benefit.id}>{benefit.title}</p>)}
        </div>
      </section>
    </div>
  );
}
