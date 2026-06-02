"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!active) return null;

  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      <div className="relative mx-auto h-[72vh] min-h-[560px] max-w-[1600px]">
        <AnimatePresence mode="wait">
          <motion.div key={active.id} className="absolute inset-0" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.75 }}>
            <Image src={active.imageUrl} alt="" fill priority className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/88 via-stone-950/46 to-transparent" />
        <div className="relative z-10 flex h-full items-center px-4 sm:px-8 lg:px-16">
          <motion.div key={`${active.id}-text`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">Zuki Zone</p>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">{active.title}</h1>
            {active.subtitle ? <p className="mt-5 text-lg leading-8 text-stone-100 sm:text-xl">{active.subtitle}</p> : null}
            {active.ctaHref ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={active.ctaHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-6 font-black text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-600">
                  {active.ctaLabel ?? "Comprar"} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/ofertas" className="inline-flex h-12 items-center justify-center rounded-md border border-white/35 bg-white/10 px-6 font-black text-white backdrop-blur transition hover:bg-white/20">
                  Ver ofertas
                </Link>
              </div>
            ) : null}
          </motion.div>
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
