"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
};

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const safeImages = images.length ? images : [{ id: "fallback", url: "/product-fallback.svg", alt: productName }];
  const [active, setActive] = useState(safeImages[0]);

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
        <Image src={active.url} alt={active.alt ?? productName} fill priority className="object-cover" unoptimized={active.url.endsWith(".svg")} />
      </div>
      {safeImages.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(image)}
              className={`relative h-20 w-20 flex-none overflow-hidden rounded-md border bg-stone-100 ${
                active.id === image.id ? "border-violet-700" : "border-stone-200"
              }`}
            >
              <Image src={image.url} alt={image.alt ?? productName} fill className="object-cover" unoptimized={image.url.endsWith(".svg")} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
