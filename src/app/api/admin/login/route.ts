import { NextResponse } from "next/server";
import { createAdminSession, validateAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Completa email y contraseña." }, { status: 400 });
  }

  const user = await validateAdminPassword(email, password);
  if (!user) {
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }

  await createAdminSession(user.id);
  return NextResponse.json({ ok: true });
}
