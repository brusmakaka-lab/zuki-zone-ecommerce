import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { AnalyticsEventType } from "@prisma/client";
import { getPrisma, hasDatabase } from "@/lib/prisma";

const allowedTypes = new Set(Object.values(AnalyticsEventType));

export async function POST(request: Request) {
  if (!hasDatabase()) return NextResponse.json({ ok: true });

  const payload = (await request.json().catch(() => null)) as {
    type?: AnalyticsEventType;
    productId?: string;
    metadata?: Record<string, unknown>;
  } | null;

  if (!payload?.type || !allowedTypes.has(payload.type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await getPrisma().analyticsEvent.create({
    data: {
      type: payload.type,
      productId: payload.productId || null,
      metadata: payload.metadata as Prisma.InputJsonValue | undefined,
    },
  }).catch(() => null);

  return NextResponse.json({ ok: true });
}
