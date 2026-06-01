"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    images: { url: string }[];
  };
  className?: string;
};

export function AddToCartButton({ product, className }: Props) {
  const { addItem } = useCart();
  const disabled = product.stock <= 0;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        addItem({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          stock: product.stock,
          image: product.images[0]?.url ?? "/product-fallback.svg",
        })
      }
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300",
        className,
      )}
    >
      <ShoppingBag className="h-4 w-4" />
      {disabled ? "Sin stock" : "Agregar"}
    </button>
  );
}
