"use client";

import { usePathname } from "next/navigation";
import { AddToCartModal } from "@/components/cart/add-to-cart-modal";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export function PublicChrome({
  children,
  header,
  footer,
  whatsappNumber,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  whatsappNumber: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/gestion-2002") || pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <CartProvider>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      <CartDrawer />
      <AddToCartModal />
      <WhatsAppFloat phone={whatsappNumber} />
    </CartProvider>
  );
}
