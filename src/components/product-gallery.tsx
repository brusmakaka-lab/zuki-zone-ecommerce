"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
};

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const safeImages = images.length ? images : [];
  const [active, setActive] = useState(safeImages[0]);
  const [zoomOpen, setZoomOpen] = useState(false);

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 bg-[radial-gradient(circle_at_20%_15%,#fef3c7,transparent_28%),linear-gradient(135deg,#f8fafc,#e0f2fe_48%,#dcfce7)] shadow-sm">
        {active ? (
          <>
            <Image src={active.url} alt={active.alt ?? productName} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition duration-500 hover:scale-[1.03]" unoptimized={active.url.endsWith(".svg") || active.url.endsWith(".ico")} />
            <button type="button" onClick={() => setZoomOpen(true)} className="absolute bottom-3 right-3 inline-flex h-10 items-center gap-2 rounded-md bg-white/95 px-3 text-sm font-black text-stone-950 shadow-sm backdrop-blur transition hover:bg-white">
              <Maximize2 className="h-4 w-4" />
              Zoom
            </button>
          </>
        ) : (
          <div className="grid h-full place-items-center p-8 text-center">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-800">Zuki Zone</p>
              <p className="mt-3 text-2xl font-black leading-tight text-stone-950">{productName}</p>
              <p className="mt-2 text-sm font-semibold text-stone-600">Imagen en preparacion</p>
            </div>
          </div>
        )}
      </div>
      {safeImages.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(image)}
              className={`relative h-20 w-20 flex-none overflow-hidden rounded-md border bg-stone-100 ring-offset-2 transition ${
                active?.id === image.id ? "border-emerald-700 ring-2 ring-emerald-600" : "border-stone-200"
              }`}
            >
              <Image src={image.url} alt={image.alt ?? productName} fill sizes="80px" className="object-cover" unoptimized={image.url.endsWith(".svg") || image.url.endsWith(".ico")} />
            </button>
          ))}
        </div>
      ) : null}
      {zoomOpen && active ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/90 p-4">
          <button type="button" onClick={() => setZoomOpen(false)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-md bg-white text-stone-950">
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[82vh] w-full max-w-5xl">
            <Image src={active.url} alt={active.alt ?? productName} fill sizes="100vw" className="object-contain" unoptimized={active.url.endsWith(".svg") || active.url.endsWith(".ico")} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
