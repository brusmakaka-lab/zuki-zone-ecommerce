import { AdminProductsManager } from "@/components/admin-products-manager";
import { getPrisma, hasDatabase } from "@/lib/prisma";

export default async function AdminProductsPage() {
  if (!hasDatabase()) return <AdminNotice title="Productos" />;
  const prisma = getPrisma();
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }] },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <AdminProductsManager
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
      }))}
      products={products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        shortDescription: product.shortDescription,
        description: product.description,
        price: Number(product.price),
        previousPrice: product.previousPrice ? Number(product.previousPrice) : null,
        stock: product.stock,
        minStock: product.minStock,
        tags: product.tags,
        featured: product.featured,
        onSale: product.onSale,
        isNew: product.isNew,
        published: product.published,
        active: product.active,
        sortOrder: product.sortOrder,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId,
        categoryName: product.category.name,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        images: product.images.map((image) => ({
          id: image.id,
          url: image.url,
          alt: image.alt,
          isMain: image.isMain,
          sortOrder: image.sortOrder,
        })),
      }))}
    />
  );
}

function AdminNotice({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
      <h1 className="text-2xl font-black">{title}</h1>
      <p className="mt-2 text-sm">Configura DATABASE_URL para administrar.</p>
    </div>
  );
}
