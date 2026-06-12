"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="grid gap-3 lg:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-3 overflow-auto lg:order-1 lg:flex-col">
        {images.map((image, index) => (
          <button
            type="button"
            key={image}
            onClick={() => setActive(image)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-white",
              active === image ? "border-amazon-orange ring-2 ring-amazon-orange/25" : "border-slate-200"
            )}
            aria-label={`View image ${index + 1}`}
          >
            <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-square overflow-hidden rounded-lg bg-slate-100 shadow-soft lg:order-2">
        <Image src={active} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
    </div>
  );
}
