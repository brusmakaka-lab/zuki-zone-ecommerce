import { CartPageClient } from "@/components/cart/cart-page-client";
import { getCategories, getProducts } from "@/lib/data";

export default async function CartPage() {
  const [recommended, categories] = await Promise.all([
    getProducts({ featured: true }),
    getCategories(),
  ]);

  return <CartPageClient recommended={recommended.slice(0, 4)} categories={categories.slice(0, 6)} />;
}
