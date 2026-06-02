import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getPrisma, hasDatabase } from "@/lib/prisma";
import { orderStatusLabels } from "@/lib/order-status";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!hasDatabase()) return NextResponse.json({ error: "No disponible" }, { status: 503 });

  const orders = await getPrisma().order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
  const rows = [
    ["numero", "fecha", "estado", "cliente", "telefono", "email", "localidad", "total", "productos"],
    ...orders.map((order) => [
      String(order.orderNumber),
      order.createdAt.toISOString(),
      orderStatusLabels[order.status],
      order.customerName,
      order.customerPhone,
      order.customerEmail ?? "",
      order.city,
      String(order.total),
      order.items.map((item) => `${item.productName} x${item.quantity}`).join(" | "),
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-zuki-zone.csv"`,
    },
  });
}
