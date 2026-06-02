import { unstable_noStore as noStore } from "next/cache";
import type { Prisma } from "@prisma/client";
import {
  demoBenefits,
  demoCategories,
  demoHeroSlides,
  demoIdeas,
  demoProducts,
  demoSettings,
  type StoreOrder,
} from "@/lib/demo-data";
import { getPrisma, hasDatabase } from "@/lib/prisma";

const productInclude = {
  category: true,
  images: { orderBy: [{ isMain: "desc" as const }, { sortOrder: "asc" as const }] },
};

function numberFromDecimal(value: Prisma.Decimal | number | string | null | undefined) {
  if (value == null) return null;
  return Number(value);
}

function normalizeProduct<T extends { price: Prisma.Decimal; previousPrice: Prisma.Decimal | null }>(
  product: T,
) {
  return {
    ...product,
    price: numberFromDecimal(product.price) ?? 0,
    previousPrice: numberFromDecimal(product.previousPrice),
  };
}

function filterDemoProducts(filters?: {
  category?: string;
  q?: string;
  featured?: boolean;
  onSale?: boolean;
  min?: number;
  max?: number;
}) {
  return demoProducts.filter((product) => {
    const matchesCategory = !filters?.category || product.category.slug === filters.category;
    const matchesSearch =
      !filters?.q ||
      product.name.toLowerCase().includes(filters.q.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.q.toLowerCase());
    const matchesFeatured = filters?.featured ? product.featured : true;
    const matchesSale = filters?.onSale ? product.onSale : true;
    const matchesMin = filters?.min ? product.price >= filters.min : true;
    const matchesMax = filters?.max ? product.price <= filters.max : true;
    return matchesCategory && matchesSearch && matchesFeatured && matchesSale && matchesMin && matchesMax;
  });
}

export async function getSettings() {
  noStore();
  if (!hasDatabase()) return demoSettings;

  try {
    return (await getPrisma().siteSettings.findUnique({ where: { id: "main" } })) ?? demoSettings;
  } catch {
    return demoSettings;
  }
}

export async function getCategories() {
  noStore();
  if (!hasDatabase()) return demoCategories;

  try {
    return await getPrisma().category.findMany({
      where: { active: true, parentId: null },
      include: { children: { where: { active: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    return demoCategories;
  }
}

export async function getHeroSlides() {
  noStore();
  if (!hasDatabase()) return demoHeroSlides;

  try {
    return await getPrisma().heroSlide.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return demoHeroSlides;
  }
}

export async function getIdeas() {
  noStore();
  if (!hasDatabase()) return demoIdeas;

  try {
    return await getPrisma().inspirationIdea.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return demoIdeas;
  }
}

export async function getBenefits() {
  noStore();
  if (!hasDatabase()) return demoBenefits;

  try {
    return await getPrisma().storeBenefit.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return demoBenefits;
  }
}

export async function getProducts(filters?: {
  category?: string;
  q?: string;
  featured?: boolean;
  onSale?: boolean;
  min?: number;
  max?: number;
}) {
  noStore();
  if (!hasDatabase()) return filterDemoProducts(filters);

  try {
    const products = await getPrisma().product.findMany({
      where: {
        active: true,
        published: true,
        category: filters?.category ? { slug: filters.category } : undefined,
        featured: filters?.featured || undefined,
        onSale: filters?.onSale || undefined,
        price: {
          gte: filters?.min,
          lte: filters?.max,
        },
        OR: filters?.q
          ? [
              { name: { contains: filters.q, mode: "insensitive" } },
              { description: { contains: filters.q, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: productInclude,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return products.map(normalizeProduct);
  } catch {
    return filterDemoProducts(filters);
  }
}

export async function getProductBySlug(slug: string) {
  noStore();
  if (!hasDatabase()) return demoProducts.find((product) => product.slug === slug) ?? null;

  try {
    const product = await getPrisma().product.findFirst({
      where: { slug, active: true, published: true },
      include: productInclude,
    });
    return product ? normalizeProduct(product) : null;
  } catch {
    return demoProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getProductsByIds(ids: string[]) {
  noStore();
  if (!ids.length) return [];
  if (!hasDatabase()) return demoProducts.filter((product) => ids.includes(product.id));

  try {
    const products = await getPrisma().product.findMany({
      where: { id: { in: ids }, active: true, published: true },
      include: productInclude,
    });
    return products.map(normalizeProduct);
  } catch {
    return demoProducts.filter((product) => ids.includes(product.id));
  }
}

export async function getUserOrders(userId: string): Promise<StoreOrder[]> {
  noStore();
  if (!hasDatabase()) return [];

  const orders = await getPrisma().order.findMany({
    where: { userId },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice) })),
  }));
}

export async function getOrderForUser(orderId: string, userId: string) {
  noStore();
  if (!hasDatabase()) return null;

  const order = await getPrisma().order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) return null;
  return {
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice) })),
  };
}

export async function getOrderById(orderId: string) {
  noStore();
  if (!hasDatabase()) return null;

  const order = await getPrisma().order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) return null;
  return {
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice) })),
  };
}
