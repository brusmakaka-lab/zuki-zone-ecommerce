"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { clearAdminSession, createAdminSession, requireAdminSession, validateAdminPassword } from "@/lib/admin-auth";
import { getPrisma, hasDatabase } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await requireAdminSession();
  if (!hasDatabase()) throw new Error("DATABASE_URL no esta configurada.");
  return session;
}

export async function loginAdmin(_: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await validateAdminPassword(email, password);

  if (!user) return { ok: false, message: "Email o contraseña incorrectos." };

  await createAdminSession(user.id);
  redirect("/gestion-2002/dashboard");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/gestion-2002/login");
}

export async function updateAdminCredentials(_: unknown, formData: FormData) {
  const admin = await requireAdmin();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !currentPassword) return { ok: false, message: "Completa email y contraseña actual." };
  if (newPassword && newPassword.length < 8) return { ok: false, message: "La nueva contraseña debe tener al menos 8 caracteres." };
  if (newPassword !== confirmPassword) return { ok: false, message: "La confirmación no coincide." };

  const user = await getPrisma().user.findUnique({ where: { id: admin.id } });
  if (!user?.passwordHash) return { ok: false, message: "No se encontro el administrador." };
  const valid = await compare(currentPassword, user.passwordHash);
  if (!valid) return { ok: false, message: "La contraseña actual es incorrecta." };

  await getPrisma().user.update({
    where: { id: admin.id },
    data: {
      email,
      passwordHash: newPassword ? await hash(newPassword, 12) : user.passwordHash,
      mustChangePassword: false,
    },
  });

  revalidatePath("/gestion-2002/configuracion/seguridad");
  revalidatePath("/gestion-2002/dashboard");
  return { ok: true, message: "Credenciales actualizadas." };
}

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(8),
  price: z.coerce.number().positive(),
  previousPrice: z.coerce.number().optional(),
  categoryId: z.string().min(1),
  stock: z.coerce.number().int().min(0),
  imageUrls: z.string().optional(),
  mainImageUrl: z.string().optional(),
  featured: z.string().optional(),
  onSale: z.string().optional(),
  published: z.string().optional(),
  active: z.string().optional(),
});

export async function upsertProduct(formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.parse(Object.fromEntries(formData));
  const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.name);
  const imageUrls = (parsed.imageUrls ?? "")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
  const mainImageUrl = parsed.mainImageUrl || imageUrls[0] || "/product-fallback.svg";
  const allImages = Array.from(new Set([mainImageUrl, ...imageUrls].filter(Boolean)));
  const data = {
    name: parsed.name,
    slug,
    description: parsed.description,
    price: parsed.price.toFixed(2),
    previousPrice: parsed.previousPrice ? parsed.previousPrice.toFixed(2) : null,
    categoryId: parsed.categoryId,
    stock: parsed.stock,
    featured: parsed.featured === "on",
    onSale: parsed.onSale === "on",
    published: parsed.published === "on",
    active: parsed.active === "on",
  };

  const product = parsed.id
    ? await getPrisma().product.update({ where: { id: parsed.id }, data })
    : await getPrisma().product.create({ data });

  await getPrisma().productImage.deleteMany({ where: { productId: product.id } });
  await getPrisma().productImage.createMany({
    data: allImages.map((url, index) => ({
      productId: product.id,
      url,
      alt: parsed.name,
      isMain: url === mainImageUrl,
      sortOrder: index,
    })),
  });

  revalidatePath("/gestion-2002/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${slug}`);
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await getPrisma().product.update({ where: { id }, data: { active: false, published: false } });
  revalidatePath("/gestion-2002/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");
}

export async function upsertCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "");
  const id = String(formData.get("id") ?? "");
  const slug = slugify(String(formData.get("slug") || name));
  const description = String(formData.get("description") ?? "");
  const imageUrl = String(formData.get("imageUrl") || `/category-${slug}.svg`);
  const parentIdRaw = String(formData.get("parentId") ?? "");
  const parentId = parentIdRaw || null;

  if (id) {
    await getPrisma().category.update({ where: { id }, data: { name, slug, description, imageUrl, parentId } });
  } else {
    await getPrisma().category.create({ data: { name, slug, description, imageUrl, parentId } });
  }
  revalidatePath("/gestion-2002/categorias");
  revalidatePath("/catalogo");
  revalidatePath("/");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId"));
  const status = formData.get("status") as OrderStatus;
  const note = String(formData.get("note") ?? "");

  await getPrisma().order.update({
    where: { id: orderId },
    data: {
      status,
      statusHistory: { create: { status, note: note || null } },
    },
  });

  revalidatePath("/gestion-2002/pedidos");
  revalidatePath(`/pedido/${orderId}`);
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  await getPrisma().siteSettings.upsert({
    where: { id: "main" },
    update: {
      storeName: String(formData.get("storeName")),
      tagline: String(formData.get("tagline")),
      heroTitle: String(formData.get("heroTitle")),
      heroText: String(formData.get("heroText")),
      whatsappNumber: String(formData.get("whatsappNumber")),
      email: String(formData.get("email")),
      address: String(formData.get("address")),
      bannerText: String(formData.get("bannerText")),
      shippingText: String(formData.get("shippingText")),
      paymentText: String(formData.get("paymentText")),
      aboutText: String(formData.get("aboutText")),
      newsletterTitle: String(formData.get("newsletterTitle")),
      newsletterText: String(formData.get("newsletterText")),
      instagramUrl: String(formData.get("instagramUrl")),
      facebookUrl: String(formData.get("facebookUrl")),
      tiktokUrl: String(formData.get("tiktokUrl")),
      logoUrl: String(formData.get("logoUrl")),
      logoHeight: Number(formData.get("logoHeight") || 48),
      faviconUrl: String(formData.get("faviconUrl")),
      ogImageUrl: String(formData.get("ogImageUrl")),
      primaryColor: String(formData.get("primaryColor") || "#7c3aed"),
      accentColor: String(formData.get("accentColor") || "#f97316"),
      radius: Number(formData.get("radius") || 10),
      themeMode: String(formData.get("themeMode") || "light"),
    },
    create: {
      id: "main",
      storeName: String(formData.get("storeName")),
      tagline: String(formData.get("tagline")),
      heroTitle: String(formData.get("heroTitle")),
      heroText: String(formData.get("heroText")),
      whatsappNumber: String(formData.get("whatsappNumber")),
      email: String(formData.get("email")),
      address: String(formData.get("address")),
      bannerText: String(formData.get("bannerText")),
      shippingText: String(formData.get("shippingText")),
      paymentText: String(formData.get("paymentText")),
      aboutText: String(formData.get("aboutText")),
      newsletterTitle: String(formData.get("newsletterTitle")),
      newsletterText: String(formData.get("newsletterText")),
      instagramUrl: String(formData.get("instagramUrl")),
      facebookUrl: String(formData.get("facebookUrl")),
      tiktokUrl: String(formData.get("tiktokUrl")),
      logoUrl: String(formData.get("logoUrl")),
      logoHeight: Number(formData.get("logoHeight") || 48),
      faviconUrl: String(formData.get("faviconUrl")),
      ogImageUrl: String(formData.get("ogImageUrl")),
      primaryColor: String(formData.get("primaryColor") || "#7c3aed"),
      accentColor: String(formData.get("accentColor") || "#f97316"),
      radius: Number(formData.get("radius") || 10),
      themeMode: String(formData.get("themeMode") || "light"),
    },
  });
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/gestion-2002/contenido");
}

export async function upsertHeroSlide(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const data = {
    title: String(formData.get("title")),
    subtitle: String(formData.get("subtitle") || ""),
    imageUrl: String(formData.get("imageUrl")),
    ctaLabel: String(formData.get("ctaLabel") || "Comprar"),
    ctaHref: String(formData.get("ctaHref") || "/catalogo"),
    sortOrder: Number(formData.get("sortOrder") || 0),
    active: formData.get("active") === "on",
  };
  if (id) await getPrisma().heroSlide.update({ where: { id }, data });
  else await getPrisma().heroSlide.create({ data });
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/gestion-2002/contenido");
}

export async function upsertIdea(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const data = {
    title: String(formData.get("title")),
    excerpt: String(formData.get("excerpt")),
    imageUrl: String(formData.get("imageUrl")),
    href: String(formData.get("href") || "/catalogo"),
    sortOrder: Number(formData.get("sortOrder") || 0),
    active: formData.get("active") === "on",
  };
  if (id) await getPrisma().inspirationIdea.update({ where: { id }, data });
  else await getPrisma().inspirationIdea.create({ data });
  revalidatePath("/");
  revalidatePath("/gestion-2002/contenido");
}

export async function upsertBenefit(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const data = {
    title: String(formData.get("title")),
    description: String(formData.get("description") || ""),
    icon: String(formData.get("icon") || "sparkles"),
    sortOrder: Number(formData.get("sortOrder") || 0),
    active: formData.get("active") === "on",
  };
  if (id) await getPrisma().storeBenefit.update({ where: { id }, data });
  else await getPrisma().storeBenefit.create({ data });
  revalidatePath("/");
  revalidatePath("/gestion-2002/contenido");
}
