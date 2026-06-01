import { NextResponse, type NextRequest } from "next/server";

const attempts = new Map<string, { count: number; resetAt: number }>();
const windowMs = 60_000;
const maxAttempts = 20;

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/login" && request.nextUrl.pathname !== "/gestion-2002/login") {
    return NextResponse.next();
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const current = attempts.get(ip);

  if (!current || current.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs });
    return NextResponse.next();
  }

  current.count += 1;
  if (current.count > maxAttempts) {
    return new NextResponse("Demasiados intentos. Proba nuevamente en un minuto.", { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/gestion-2002/login"],
};
