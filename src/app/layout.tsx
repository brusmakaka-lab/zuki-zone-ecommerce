import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { AddToCartModal } from "@/components/cart/add-to-cart-modal";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories, getSettings } from "@/lib/data";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zuki Zone | Tienda online",
  description: "E-commerce moderno con catalogo, carrito, checkout por WhatsApp y seguimiento de pedidos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const themeStyle = {
    "--brand-primary": settings.primaryColor ?? "#7c3aed",
    "--brand-accent": settings.accentColor ?? "#f97316",
    "--brand-radius": `${settings.radius ?? 10}px`,
  } as CSSProperties;

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans" style={themeStyle}>
        <CartProvider>
          <SiteHeader settings={settings} categories={categories} />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} />
          <CartDrawer />
          <AddToCartModal />
          <WhatsAppFloat phone={settings.whatsappNumber} />
        </CartProvider>
      </body>
    </html>
  );
}
