import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

async function guard() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json({ ok: true });
}

export const GET = guard;
export const POST = guard;
export const PUT = guard;
export const PATCH = guard;
export const DELETE = guard;
