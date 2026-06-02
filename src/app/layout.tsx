import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { PublicChrome } from "@/components/public-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories, getSettings } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const title = `${settings.storeName} | Tienda online`;
  const description = settings.tagline;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    icons: {
      icon: settings.faviconUrl || "/favicon.ico",
      shortcut: settings.faviconUrl || "/favicon.ico",
      apple: settings.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings.storeName,
      images: [settings.ogImageUrl || settings.logoUrl || "/zuki-hero-1.svg"],
    },
  };
}

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
        <PublicChrome
          header={<SiteHeader settings={settings} categories={categories} />}
          footer={<SiteFooter settings={settings} />}
          whatsappNumber={settings.whatsappNumber}
        >
          {children}
        </PublicChrome>
      </body>
    </html>
  );
}
