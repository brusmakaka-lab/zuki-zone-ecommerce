import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);
const maxBytes = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Vercel Blob no esta configurado. Agrega BLOB_READ_WRITE_TOKEN en Vercel." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const scope = String(formData.get("scope") ?? "uploads").replace(/[^a-z0-9-_]/gi, "-").toLowerCase();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo no recibido." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Formato no permitido. Usa jpg, png, webp, svg o ico." }, { status: 400 });
  }

  if (file.size > maxBytes) {
    return NextResponse.json({ error: "La imagen supera el maximo de 4 MB." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const key = `${scope}/${Date.now()}-${safeName}`;
  const blob = await put(key, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
