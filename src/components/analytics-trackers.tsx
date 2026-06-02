"use client";

import { useEffect } from "react";

export function trackEvent(type: string, productId?: string, metadata?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ type, productId, metadata });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }
  fetch("/api/analytics", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => null);
}

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackEvent("PRODUCT_VIEW", productId);
  }, [productId]);

  return null;
}

export function CheckoutStartedTracker({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (enabled) trackEvent("CHECKOUT_STARTED");
  }, [enabled]);

  return null;
}

export function TrackedWhatsAppLink({
  href,
  productId,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  productId?: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} aria-label={ariaLabel} onClick={() => trackEvent("WHATSAPP_CLICK", productId)}>
      {children}
    </a>
  );
}
