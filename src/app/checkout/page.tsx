import { auth } from "@/auth";
import { CheckoutClient } from "@/components/cart/checkout-client";
import { getCategories, getProducts, getSettings } from "@/lib/data";

export default async function CheckoutPage() {
  const [session, recommended, categories, settings] = await Promise.all([
    auth(),
    getProducts({ featured: true }),
    getCategories(),
    getSettings(),
  ]);

  return (
    <CheckoutClient
      userEmail={session?.user.email ?? ""}
      userName={session?.user.name ?? ""}
      recommended={recommended.slice(0, 4)}
      categories={categories.slice(0, 6)}
      settings={settings}
    />
  );
}
