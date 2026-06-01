import { auth } from "@/auth";
import { CheckoutClient } from "@/components/cart/checkout-client";

export default async function CheckoutPage() {
  const session = await auth();

  return <CheckoutClient userEmail={session?.user.email ?? ""} userName={session?.user.name ?? ""} />;
}
