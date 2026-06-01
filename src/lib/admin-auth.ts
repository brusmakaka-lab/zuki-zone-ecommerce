import "server-only";

import { compare } from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma, hasDatabase } from "@/lib/prisma";

const cookieName = "zuki_admin_session";
const maxAgeSeconds = 60 * 60 * 8;

function getSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "development-only-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function verify(value: string, signature: string) {
  const expected = sign(value);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function createAdminSession(userId: string) {
  const expires = Date.now() + maxAgeSeconds * 1000;
  const payload = `${userId}.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getAdminSession() {
  if (!hasDatabase()) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;

  const [userId, expiresRaw, signature] = token.split(".");
  if (!userId || !expiresRaw || !signature) return null;

  const payload = `${userId}.${expiresRaw}`;
  if (!verify(payload, signature)) return null;
  if (Number(expiresRaw) < Date.now()) return null;

  const user = await getPrisma().user.findFirst({
    where: { id: userId, role: "ADMIN" },
    select: { id: true, email: true, role: true, mustChangePassword: true },
  });

  return user;
}

export async function requireAdminSession() {
  const admin = await getAdminSession();
  if (!admin) redirect("/gestion-2002/login");
  return admin;
}

export async function validateAdminPassword(email: string, password: string) {
  if (!hasDatabase()) return null;
  const user = await getPrisma().user.findFirst({
    where: { email: email.toLowerCase(), role: "ADMIN" },
  });

  if (!user?.passwordHash) return null;
  const valid = await compare(password, user.passwordHash);
  return valid ? user : null;
}
