"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";
import { auth } from "@/auth";
import { getPrisma, hasDatabase } from "@/lib/prisma";
import { getProductsByIds, getSettings } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  address: z.string().min(4),
  city: z.string().min(2),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

const checkoutSchema = profileSchema.extend({
  email: z.string().email().optional().or(z.literal("")),
  items: z
    .string()
    .transform((value) => JSON.parse(value) as { productId: string; quantity: number }[])
    .pipe(z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(99) })).min(1)),
  observations: z.string().optional(),
});

export async function saveProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/mi-cuenta");
  if (!hasDatabase()) return;

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  await getPrisma().customerProfile.upsert({
    where: { userId: session.user.id },
    update: parsed.data,
    create: { ...parsed.data, userId: session.user.id },
  });

  revalidatePath("/mi-cuenta");
}

export async function createCheckoutOrder(_: unknown, formData: FormData) {
  const session = await auth();
  if (!hasDatabase()) return { ok: false, message: "Configura DATABASE_URL para generar pedidos reales." };

  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "No pudimos validar el checkout." };

  const products = await getProductsByIds(parsed.data.items.map((item) => item.productId));
  const items = parsed.data.items
    .map((item) => {
      const product = products.find((current) => current.id === item.productId);
      if (!product) return null;
      return {
        product,
        quantity: item.quantity,
        total: product.price * item.quantity,
      };
    })
    .filter(Boolean) as { product: (typeof products)[number]; quantity: number; total: number }[];

  if (!items.length) return { ok: false, message: "El carrito esta vacio." };

  const total = items.reduce((sum, item) => sum + item.total, 0);
  const settings = await getSettings();

  const order = await getPrisma().order.create({
    data: {
      userId: session?.user?.id,
      status: OrderStatus.CONSULTA_RECIBIDA,
      customerName: parsed.data.fullName,
      customerEmail: session?.user?.email ?? parsed.data.email ?? null,
      customerPhone: parsed.data.phone,
      address: parsed.data.address,
      city: parsed.data.city,
      reference: parsed.data.reference,
      observations: parsed.data.observations || parsed.data.notes,
      subtotal: total.toFixed(2),
      total: total.toFixed(2),
      items: {
        create: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: item.product.price.toFixed(2),
          quantity: item.quantity,
        })),
      },
      statusHistory: {
        create: { status: OrderStatus.CONSULTA_RECIBIDA, note: "Pedido generado desde checkout." },
      },
    },
  });

  const summary = [
    `Hola, quiero consultar por el pedido #${order.orderNumber}.`,
    ...items.map((item) => `- ${item.product.name} x${item.quantity}`),
    `Total: $${total.toLocaleString("es-AR")}`,
    `Cliente: ${parsed.data.fullName}`,
    `Telefono: ${parsed.data.phone}`,
    `Direccion: ${parsed.data.address}, ${parsed.data.city}`,
  ].join("\n");

  const params = new URLSearchParams({
    pedido: order.id,
    numero: String(order.orderNumber),
    whatsapp: whatsappUrl(settings.whatsappNumber, summary),
  });

  redirect(`/checkout/exito?${params.toString()}`);
}
