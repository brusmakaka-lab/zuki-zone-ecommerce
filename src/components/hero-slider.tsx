"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, PackageCheck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const active = slides[index] ?? slides[0];
  const primaryLooksLikeOffers = active?.ctaHref === "/ofertas" || active?.ctaLabel?.toLowerCase().includes("oferta");
  const secondaryHref = primaryLooksLikeOffers ? "/catalogo" : "/ofertas";
  const secondaryLabel = primaryLooksLikeOffers ? "Ver catalogo" : "Ver ofertas";

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!active) return null;

  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      <div className="relative mx-auto h-[520px] max-w-[1600px] sm:h-[640px] lg:h-[72vh] lg:min-h-[560px]">
        <AnimatePresence mode="wait">
          <motion.div key={active.id} className="absolute inset-0" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.75 }}>
            <Image src={active.imageUrl} alt="" fill priority className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/84 via-stone-950/48 to-stone-950/10" />
        <div className="relative z-10 flex h-full items-center px-4 sm:px-8 lg:px-16">
          <div className="max-w-2xl drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]">
            <p className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">Zuki Zone | tienda activa</p>
            <h1 className="text-3xl font-black leading-tight sm:text-6xl">{active.title}</h1>
            {active.subtitle ? <p className="mt-4 text-sm leading-6 text-stone-100 sm:mt-5 sm:text-xl sm:leading-8">{active.subtitle}</p> : null}
            <div className="mt-5 grid max-w-xl gap-2 text-xs font-black text-white/95 sm:grid-cols-3 sm:text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 backdrop-blur">
                <Clock className="h-4 w-4 text-emerald-300" />
                Atencion Lun a Sab
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 backdrop-blur">
                <PackageCheck className="h-4 w-4 text-emerald-300" />
                Pedido registrado
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Compra acompanada
              </span>
            </div>
            {active.ctaHref ? (
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <Link href={active.ctaHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-6 font-black text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-600">
                  {active.ctaLabel ?? "Comprar"} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={secondaryHref} className="inline-flex h-12 items-center justify-center rounded-md border border-white/35 bg-white/10 px-6 font-black text-white backdrop-blur transition hover:bg-white/20">
                  {secondaryLabel}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
        <div className="absolute bottom-6 left-4 z-10 flex gap-2 sm:left-8 lg:left-16">
          {slides.map((slide, current) => (
            <button key={slide.id} onClick={() => setIndex(current)} className={`h-2.5 rounded-full transition-all ${current === index ? "w-10 bg-white" : "w-2.5 bg-white/45"}`} aria-label={`Ver slide ${current + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
