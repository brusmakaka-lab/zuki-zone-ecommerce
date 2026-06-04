import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const pages = ["", "/catalogo", "/categorias", "/ofertas", "/contacto", "/nosotros", "/envios", "/cambios-devoluciones", "/preguntas-frecuentes", "/politica-privacidad"];

  return [
    ...pages.map((page) => ({ url: `${siteUrl}${page}`, lastModified: new Date() })),
    ...categories.map((category) => ({
      url: `${siteUrl}/catalogo?categoria=${category.slug}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/producto/${product.slug}`,
      lastModified: new Date(),
    })),
  ];
}
