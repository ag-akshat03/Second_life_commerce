"use client";

import { useEffect } from "react";
import { addRecentlyViewed } from "@/lib/recentlyViewed";

export default function TrackView({ product }: { product: any }) {
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product]);

  return null;
}