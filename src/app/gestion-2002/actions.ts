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
  name: z.string().trim().min(2, "El nombre es obligatorio."),
  slug: z.string().optional(),
  sku: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("El precio debe ser mayor a cero."),
  previousPrice: z.coerce.number().optional(),
  categoryId: z.string().min(1, "Elegi una categoria."),
  subcategoryId: z.string().optional(),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
  minStock: z.coerce.number().int().min(0).optional(),
  tags: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  imageUrls: z.string().optional(),
  mainImageUrl: z.string().optional(),
  featured: z.string().optional(),
  onSale: z.string().optional(),
  isNew: z.string().optional(),
  published: z.string().optional(),
  active: z.string().optional(),
});

type ProductFormState = { ok: boolean; message: string };

function productRedirect(message: string, type: "ok" | "error" = "ok"): never {
  redirect(`/gestion-2002/productos?${type}=${encodeURIComponent(message)}`);
}

export async function upsertProduct(_: ProductFormState | null, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const parsedResult = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsedResult.success) {
    const message = parsedResult.error.issues[0]?.message ?? "No pudimos validar el producto.";
    return { ok: false, message };
  }
  const parsed = parsedResult.data;
  const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.name);
  const sku = parsed.sku?.trim() || null;
  const description = parsed.description?.trim() || parsed.shortDescription?.trim() || `Producto ${parsed.name}.`;
  const tags = (parsed.tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const imageUrls = (parsed.imageUrls ?? "")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
  const mainImageUrl = parsed.mainImageUrl || imageUrls[0] || "/product-fallback.svg";
  const allImages = Array.from(new Set([mainImageUrl, ...imageUrls].filter(Boolean)));

  const category = await getPrisma().category.findUnique({ where: { id: parsed.categoryId }, select: { id: true, parentId: true } });
  if (!category || category.parentId) return { ok: false, message: "Elegi una categoria principal valida." };
  if (parsed.subcategoryId) {
    const subcategory = await getPrisma().category.findUnique({ where: { id: parsed.subcategoryId }, select: { parentId: true } });
    if (!subcategory || subcategory.parentId !== parsed.categoryId) {
      return { ok: false, message: "La subcategoria no pertenece a la categoria elegida." };
    }
  }

  const data = {
    name: parsed.name,
    slug,
    sku,
    shortDescription: parsed.shortDescription?.trim() || null,
    description,
    price: parsed.price.toFixed(2),
    previousPrice: parsed.previousPrice ? parsed.previousPrice.toFixed(2) : null,
    categoryId: parsed.categoryId,
    subcategoryId: parsed.subcategoryId || null,
    stock: parsed.stock,
    minStock: parsed.minStock ?? 3,
    tags,
    featured: parsed.featured === "on",
    onSale: parsed.onSale === "on",
    isNew: parsed.isNew === "on",
    published: parsed.published === "on",
    active: parsed.active === "on",
    sortOrder: parsed.sortOrder ?? 0,
    seoTitle: parsed.seoTitle?.trim() || null,
    seoDescription: parsed.seoDescription?.trim() || null,
  };

  let product;
  try {
    product = parsed.id
      ? await getPrisma().product.update({ where: { id: parsed.id }, data })
      : await getPrisma().product.create({ data });
  } catch (error) {
    console.error("upsertProduct failed", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { ok: false, message: "El slug o SKU ya esta en uso. Cambialo y volve a guardar." };
    }
    return { ok: false, message: "No se pudo guardar el producto. Revisa los datos y volve a intentar." };
  }

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
  return { ok: true, message: parsed.id ? "Producto actualizado correctamente." : "Producto creado correctamente." };
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await getPrisma().product.update({ where: { id }, data: { active: false, published: false } });
  revalidatePath("/gestion-2002/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");
  productRedirect("Producto ocultado de la tienda.");
}

export async function restoreProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const product = await getPrisma().product.update({
    where: { id },
    data: { active: true, published: true, archivedAt: null },
    select: { slug: true },
  });
  revalidatePath("/gestion-2002/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${product.slug}`);
  revalidatePath("/");
  productRedirect("Producto publicado nuevamente.");
}

export async function archiveProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const product = await getPrisma().product.update({
    where: { id },
    data: { active: false, published: false, archivedAt: new Date() },
    select: { slug: true },
  });
  revalidatePath("/gestion-2002/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${product.slug}`);
  revalidatePath("/");
  productRedirect("Producto archivado. No aparece en la tienda ni en la vista normal.");
}

export async function permanentlyDeleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const orderItems = await getPrisma().orderItem.count({ where: { productId: id } });
  if (orderItems > 0) {
    productRedirect("No se puede eliminar definitivamente porque tiene pedidos asociados. Archivarlo mantiene el historial seguro.", "error");
  }
  const product = await getPrisma().product.findUnique({ where: { id }, select: { slug: true } });
  if (!product) productRedirect("Producto no encontrado.", "error");

  await getPrisma().$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { productId: id } });
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.product.delete({ where: { id } });
  });
  revalidatePath("/gestion-2002/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${product.slug}`);
  revalidatePath("/");
  productRedirect("Producto eliminado definitivamente.");
}

export async function updateProductQuickAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Producto invalido.");

  const data =
    action === "published"
      ? { published: value, active: value }
      : action === "featured"
        ? { featured: value }
        : action === "onSale"
          ? { onSale: value }
          : null;

  if (!data) throw new Error("Accion no soportada.");
  const product = await getPrisma().product.update({ where: { id }, data, select: { slug: true } });
  revalidatePath("/gestion-2002/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${product.slug}`);
  revalidatePath("/");
}

export async function duplicateProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const product = await getPrisma().product.findUnique({
    where: { id },
    include: { images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }] } },
  });
  if (!product) throw new Error("Producto no encontrado.");

  const copy = await getPrisma().product.create({
    data: {
      name: `${product.name} copia`,
      slug: `${product.slug}-copia-${Date.now().toString(36)}`,
      sku: product.sku ? `${product.sku}-COPIA-${Date.now().toString(36)}` : null,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      previousPrice: product.previousPrice,
      stock: product.stock,
      minStock: product.minStock,
      tags: product.tags,
      featured: false,
      onSale: product.onSale,
      isNew: product.isNew,
      published: false,
      active: false,
      archivedAt: null,
      sortOrder: product.sortOrder,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      images: {
        create: product.images.map((image, index) => ({
          url: image.url,
          alt: image.alt,
          isMain: image.isMain,
          sortOrder: index,
        })),
      },
    },
  });

  revalidatePath("/gestion-2002/productos");
  redirect(`/gestion-2002/productos?edit=${copy.id}`);
}

export async function bulkUpdateProducts(formData: FormData) {
  await requireAdmin();
  const ids = formData.getAll("ids").map(String).filter(Boolean);
  const action = String(formData.get("bulkAction") ?? "");
  const categoryId = String(formData.get("bulkCategoryId") ?? "");
  if (!ids.length) throw new Error("Selecciona al menos un producto.");

  const data =
    action === "publish"
      ? { published: true, active: true, archivedAt: null }
      : action === "hide"
        ? { published: false, active: false }
        : action === "sale-on"
          ? { onSale: true }
          : action === "sale-off"
            ? { onSale: false }
            : action === "archive"
              ? { published: false, active: false, archivedAt: new Date() }
              : action === "delete"
                ? { published: false, active: false }
                : action === "category" && categoryId
                  ? { categoryId }
                  : null;

  if (!data) throw new Error("Elegi una accion masiva valida.");
  await getPrisma().product.updateMany({ where: { id: { in: ids } }, data });
  revalidatePath("/gestion-2002/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");
}

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "El nombre es obligatorio."),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
  active: z.string().optional(),
});

function categoryRedirect(message: string, type: "ok" | "error" = "ok"): never {
  redirect(`/gestion-2002/categorias?${type}=${encodeURIComponent(message)}`);
}

export async function upsertCategory(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse(Object.fromEntries(formData));
  const id = parsed.id || "";
  const slug = slugify(parsed.slug || parsed.name);
  const parentId = parsed.parentId || null;

  if (id && parentId === id) categoryRedirect("Una categoria no puede ser subcategoria de si misma.", "error");

  const data = {
    name: parsed.name,
    slug,
    description: parsed.description?.trim() || null,
    imageUrl: parsed.imageUrl?.trim() || null,
    parentId,
    sortOrder: parsed.sortOrder ?? 0,
    active: parsed.active === "on",
  };

  try {
    if (id) await getPrisma().category.update({ where: { id }, data });
    else await getPrisma().category.create({ data: { ...data, active: true } });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      categoryRedirect("Ya existe una categoria con esa direccion corta. Cambiala y volve a guardar.", "error");
    }
    throw error;
  }
  revalidatePath("/gestion-2002/categorias");
  revalidatePath("/catalogo");
  revalidatePath("/");
  categoryRedirect(id ? "Categoria actualizada." : "Categoria creada.");
}

export async function removeCategoryImage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) categoryRedirect("Categoria invalida.", "error");

  await getPrisma().category.update({ where: { id }, data: { imageUrl: null } });
  revalidatePath("/gestion-2002/categorias");
  revalidatePath("/catalogo");
  revalidatePath("/");
  categoryRedirect("Imagen quitada. La categoria sigue existiendo.");
}

export async function toggleCategoryActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const active = String(formData.get("active") ?? "") === "true";
  if (!id) categoryRedirect("Categoria invalida.", "error");

  await getPrisma().category.update({ where: { id }, data: { active } });
  revalidatePath("/gestion-2002/categorias");
  revalidatePath("/catalogo");
  revalidatePath("/");
  categoryRedirect(active ? "Categoria visible en la tienda." : "Categoria ocultada de la tienda.");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) categoryRedirect("Categoria invalida.", "error");

  const [directProducts, subcategoryProducts, children] = await Promise.all([
    getPrisma().product.count({ where: { categoryId: id } }),
    getPrisma().product.count({ where: { subcategoryId: id } }),
    getPrisma().category.count({ where: { parentId: id } }),
  ]);
  const products = directProducts + subcategoryProducts;

  if (products > 0) {
    categoryRedirect(`No se puede eliminar porque tiene ${products} producto${products === 1 ? "" : "s"} asociado${products === 1 ? "" : "s"}. Ocultala o reasigna esos productos.`, "error");
  }
  if (children > 0) {
    categoryRedirect(`No se puede eliminar porque tiene ${children} subcategoria${children === 1 ? "" : "s"}. Eliminalas o movelas primero.`, "error");
  }

  await getPrisma().category.delete({ where: { id } });
  revalidatePath("/gestion-2002/categorias");
  revalidatePath("/catalogo");
  revalidatePath("/");
  categoryRedirect("Categoria eliminada definitivamente.");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId"));
  const status = formData.get("status") as OrderStatus;
  const note = String(formData.get("note") ?? "");
  const adminNote = formData.has("adminNote") ? String(formData.get("adminNote") ?? "") : undefined;
  const customerNote = formData.has("customerNote") ? String(formData.get("customerNote") ?? "") : undefined;
  const cancelReason = formData.has("cancelReason") ? String(formData.get("cancelReason") ?? "") : undefined;

  const prisma = getPrisma();
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new Error("Pedido no encontrado.");
    if (!Object.values(OrderStatus).includes(status)) throw new Error("Estado invalido.");

    if (status === OrderStatus.CANCELADO && order.status !== OrderStatus.CANCELADO) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    if (order.status === OrderStatus.CANCELADO && status !== OrderStatus.CANCELADO) {
      for (const item of order.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId }, select: { stock: true, name: true } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`No hay stock suficiente para reactivar ${product?.name ?? "este producto"}.`);
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        status,
        adminNote: adminNote === undefined ? order.adminNote : adminNote || null,
        customerNote: customerNote === undefined ? order.customerNote : customerNote || note || null,
        cancelReason:
          status === OrderStatus.CANCELADO
            ? cancelReason === undefined
              ? order.cancelReason || note || customerNote || null
              : cancelReason || note || customerNote || null
            : null,
        statusHistory: { create: { status, note: note || customerNote || cancelReason || null } },
      },
    });
  });

  revalidatePath("/gestion-2002/pedidos");
  revalidatePath(`/pedido/${orderId}`);
  revalidatePath("/catalogo");
  revalidatePath("/");
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
