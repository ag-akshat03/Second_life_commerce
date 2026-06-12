"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { heroSlides } from "@/lib/data";

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  function move(direction: number) {
    setActive((value) => (value + direction + heroSlides.length) % heroSlides.length);
  }

  return (
    <section className="relative min-h-[520px] overflow-hidden bg-slate-950 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.55 }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt={slide.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-amazon-navy via-amazon-navy/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950" />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-5 py-12">
        <motion.div
          key={`${slide.title}-content`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <p className="mb-4 inline-flex rounded-sm bg-amazon-gold px-3 py-1 text-sm font-black uppercase text-slate-950">
            {slide.eyebrow}
          </p>
          <h1 className="text-4xl font-black tracking-normal sm:text-5xl lg:text-6xl">{slide.title}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-100 sm:text-lg">{slide.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="inline-flex h-11 items-center rounded-md bg-amazon-gold px-4 text-sm font-bold text-slate-950 shadow-sm hover:bg-[#f5a742]"
            >
              {slide.cta}
            </Link>
            <Link
              href="/search?sort=discount"
              className="inline-flex h-11 items-center rounded-md border border-white/30 px-4 text-sm font-bold hover:bg-white/10"
            >
              View lightning deals
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-16 right-5 flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            className="rounded-full bg-white/90 p-2 text-slate-950 shadow-md hover:bg-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            className="rounded-full bg-white/90 p-2 text-slate-950 shadow-md hover:bg-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
