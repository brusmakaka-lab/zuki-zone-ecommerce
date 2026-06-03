"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/cart-provider";

export function CheckoutSuccessClear() {
  const { clear, closeDrawer } = useCart();
  const didClear = useRef(false);

  useEffect(() => {
    if (didClear.current) return;
    didClear.current = true;
    clear();
    closeDrawer();
  }, [clear, closeDrawer]);

  return null;
}
