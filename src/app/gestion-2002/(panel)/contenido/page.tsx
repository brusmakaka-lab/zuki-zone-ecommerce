import { updateSettings, upsertBenefit, upsertHeroSlide, upsertIdea } from "@/app/gestion-2002/actions";
import { AdminImageUpload } from "@/components/admin-image-upload";
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
        <div className="grid gap-4 md:grid-cols-2">
          <AdminImageUpload label="Logo header/footer" name="logoUrl" scope="brand" value={settings.logoUrl} hint="Recomendado: PNG/SVG horizontal. Header usa 44-56px de alto." />
          <AdminImageUpload label="Favicon" name="faviconUrl" scope="brand" value={settings.faviconUrl} hint="Recomendado: 32x32 o 48x48 en PNG/ICO/SVG." />
        </div>
        <AdminImageUpload label="Imagen para compartir en redes" name="ogImageUrl" scope="brand" value={settings.ogImageUrl} hint="Recomendado: 1200x630. Se ve cuando compartis la tienda por WhatsApp o redes." />
        <div className="grid gap-4 md:grid-cols-4">
          <input name="logoHeight" defaultValue={settings.logoHeight ?? 48} type="number" min={32} max={96} className="h-11 rounded-md border border-stone-200 px-3" placeholder="Alto logo" />
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
            <AdminImageUpload label="Imagen hero" name="imageUrl" scope="hero" required />
          </div>
          <input name="subtitle" placeholder="Subtitulo" className="h-11 rounded-md border border-stone-200 px-3" />
          <div className="grid gap-3 md:grid-cols-4">
            <input name="ctaLabel" placeholder="Texto del boton" className="h-11 rounded-md border border-stone-200 px-3" />
            <input name="ctaHref" placeholder="Link del boton. Ej: /catalogo" className="h-11 rounded-md border border-stone-200 px-3" />
            <input name="sortOrder" type="number" placeholder="Orden" className="h-11 rounded-md border border-stone-200 px-3" />
            <label className="flex items-center gap-2 text-sm font-semibold"><input name="active" type="checkbox" defaultChecked /> Activo</label>
          </div>
          <button className="h-10 rounded-md bg-violet-700 px-4 font-bold text-white md:w-fit">Crear slide</button>
        </form>
        <div className="mt-4 grid gap-2 text-sm text-stone-600">
          {slides.map((slide) => (
            <form key={slide.id} action={upsertHeroSlide} className="grid gap-3 rounded-md border border-stone-100 p-3">
              <input type="hidden" name="id" value={slide.id} />
              <input name="title" defaultValue={slide.title} className="h-10 rounded-md border border-stone-200 px-3 font-semibold text-stone-900" />
              <input name="subtitle" defaultValue={slide.subtitle ?? ""} className="h-10 rounded-md border border-stone-200 px-3" />
              <AdminImageUpload label="Imagen actual" name="imageUrl" scope="hero" value={slide.imageUrl} />
              <div className="grid gap-3 md:grid-cols-4">
                <input name="ctaLabel" defaultValue={slide.ctaLabel ?? ""} placeholder="Texto del boton" className="h-10 rounded-md border border-stone-200 px-3" />
                <input name="ctaHref" defaultValue={slide.ctaHref ?? ""} placeholder="Link del boton" className="h-10 rounded-md border border-stone-200 px-3" />
                <input name="sortOrder" type="number" defaultValue={slide.sortOrder} className="h-10 rounded-md border border-stone-200 px-3" />
                <label className="flex items-center gap-2 font-semibold text-stone-900"><input name="active" type="checkbox" defaultChecked={slide.active} /> Activo</label>
              </div>
              <button className="h-10 rounded-md bg-violet-700 px-4 font-bold text-white md:w-fit">Guardar slide</button>
            </form>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-black">Ideas para tu casa</h2>
        <form action={upsertIdea} className="mt-4 grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input name="title" placeholder="Titulo" required className="h-11 rounded-md border border-stone-200 px-3" />
            <AdminImageUpload label="Imagen idea" name="imageUrl" scope="ideas" required />
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
          {ideas.map((idea) => (
            <form key={idea.id} action={upsertIdea} className="grid gap-3 rounded-md border border-stone-100 p-3">
              <input type="hidden" name="id" value={idea.id} />
              <input name="title" defaultValue={idea.title} className="h-10 rounded-md border border-stone-200 px-3 font-semibold text-stone-900" />
              <textarea name="excerpt" defaultValue={idea.excerpt} rows={2} className="rounded-md border border-stone-200 px-3 py-2" />
              <AdminImageUpload label="Imagen actual" name="imageUrl" scope="ideas" value={idea.imageUrl} />
              <div className="grid gap-3 md:grid-cols-3">
                <input name="href" defaultValue={idea.href ?? ""} className="h-10 rounded-md border border-stone-200 px-3" />
                <input name="sortOrder" type="number" defaultValue={idea.sortOrder} className="h-10 rounded-md border border-stone-200 px-3" />
                <label className="flex items-center gap-2 font-semibold text-stone-900"><input name="active" type="checkbox" defaultChecked={idea.active} /> Activa</label>
              </div>
              <button className="h-10 rounded-md bg-violet-700 px-4 font-bold text-white md:w-fit">Guardar idea</button>
            </form>
          ))}
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
